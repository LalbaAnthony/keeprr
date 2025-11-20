import dotenv from 'dotenv'
import { Sequelize } from 'sequelize'

dotenv.config()

const env = process.env.NODE_ENV || 'development';

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: env === 'development' && process.env.BACKEND_DATABASE_LOGGING === 'true' ? console.log : false,
});

(async () => {
    await sequelize.authenticate()
})().then(async () => {
    if (env === 'development') await sequelize.sync({ force: true }) 
}).catch(error => {
    console.error('Unable to connect to the database:', error)
})

export { sequelize }
