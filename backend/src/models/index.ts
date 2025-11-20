import { sequelize } from '../config/database'
import { initLogModel, Log } from './log.model'
import { initUserModel, User } from './user.model'
import { initPostModel, Post } from './post.model'
import { AuthRefreshToken, initAuthRefreshTokenModel } from './authRefreshToken.model'
import { AuthPasswordResetToken, initAuthPasswordResetTokenModel } from './authPasswordResetToken.model'

initLogModel(sequelize)
initPostModel(sequelize)
initUserModel(sequelize)
initAuthRefreshTokenModel(sequelize)
initAuthPasswordResetTokenModel(sequelize)

export { Log, Post, User, AuthRefreshToken, AuthPasswordResetToken }
