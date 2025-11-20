import { Request, Response } from 'express';
import * as noteService from '../services/note.service';

export const list = async (req: Request, res: Response) => {
  try {
    const notes = await noteService.listNotes();
    res.json(notes);
  } catch (e) {
    res.status(500).json({ error: 'could not list notes' });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const note = await noteService.createNote(req.body);
    res.status(201).json(note);
  } catch (e) {
    res.status(500).json({ error: 'could not create note' });
  }
};

export const get = async (req: Request, res: Response) => {
  const note = await noteService.getNote(Number(req.params.id));
  if (!note) return res.status(404).json({ error: 'not found' });
  res.json(note);
};

export const update = async (req: Request, res: Response) => {
  const note = await noteService.updateNote(Number(req.params.id), req.body);
  if (!note) return res.status(404).json({ error: 'not found' });
  res.json(note);
};

export const remove = async (req: Request, res: Response) => {
  const ok = await noteService.deleteNote(Number(req.params.id));
  if (!ok) return res.status(404).json({ error: 'not found' });
  res.status(204).send();
};

export const move = async (req: Request, res: Response) => {
  try {
    const note = await noteService.moveNote(Number(req.params.id), req.body.position ?? null);
    res.json(note);
  } catch (e) {
    res.status(500).json({ error: 'failed to move note' });
  }
};
