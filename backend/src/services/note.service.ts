import Note from '../models/note.model';
import sequelize from '../database';

export const listNotes = async () => {
  const positioned = await Note.findAll({
    where: { position: { [sequelize.Sequelize.Op.ne]: null } },
    order: [['position', 'ASC']]
  });

  const unpositioned = await Note.findAll({
    where: { position: null },
    order: [['updatedAt', 'DESC']]
  });

  return [...positioned, ...unpositioned];
};

export const createNote = async (data: any) => {
  return await Note.create({
    title: data.title || 'Untitled',
    content: data.content || '',
    position: data.position ?? null
  });
};

export const getNote = async (id: number) => Note.findByPk(id);

export const updateNote = async (id: number, data: any) => {
  const note = await Note.findByPk(id);
  if (!note) return null;
  Object.assign(note, data);
  await note.save();
  return note;
};

export const deleteNote = async (id: number) => {
  const note = await Note.findByPk(id);
  if (!note) return false;
  await note.destroy();
  await compactPositions();
  return true;
};

export const moveNote = async (id: number, position: number | null) => {
  const t = await sequelize.transaction();
  try {
    const note = await Note.findByPk(id, { transaction: t, lock: t.LOCK.UPDATE });
    if (!note) throw new Error('not found');

    if (position === null) {
      note.position = null;
      await note.save({ transaction: t });
      await compactPositions({ transaction: t });
      await t.commit();
      return note;
    }

    if (position < 1) position = 1;

    const others = await Note.findAll({
      where: {
        position: { [sequelize.Sequelize.Op.ne]: null },
        id: { [sequelize.Sequelize.Op.ne]: id }
      },
      order: [['position', 'ASC']],
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    for (const n of others) {
      if (n.position! >= position) {
        n.position = n.position! + 1;
        await n.save({ transaction: t });
      }
    }

    note.position = position;
    await note.save({ transaction: t });

    await t.commit();
    return note;
  } catch (e) {
    await t.rollback();
    throw e;
  }
};

async function compactPositions(options: any = {}) {
  const t = options.transaction || undefined;
  const notes = await Note.findAll({
    where: { position: { [sequelize.Sequelize.Op.ne]: null } },
    order: [['position', 'ASC']],
    transaction: t
  });
  let i = 1;
  for (const n of notes) {
    if (n.position !== i) {
      n.position = i;
      await n.save({ transaction: t });
    }
    i++;
  }
}
