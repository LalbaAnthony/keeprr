import { sequelize } from '../config/database'
import { initLogModel, Log } from './log.model'
import { initUserModel, User } from './user.model'
import { initNoteModel, Note } from './note.model'
import { AuthRefreshToken, initAuthRefreshTokenModel } from './authRefreshToken.model'
import { AuthPasswordResetToken, initAuthPasswordResetTokenModel } from './authPasswordResetToken.model'

initLogModel(sequelize)
initNoteModel(sequelize)
initUserModel(sequelize)
initAuthRefreshTokenModel(sequelize)
initAuthPasswordResetTokenModel(sequelize)

User.hasMany(Note, { foreignKey: 'user_id', as: 'notes', onDelete: 'CASCADE' })
Note.belongsTo(User, { foreignKey: 'user_id', as: 'user' })

export { Log, Note, User, AuthRefreshToken, AuthPasswordResetToken }
