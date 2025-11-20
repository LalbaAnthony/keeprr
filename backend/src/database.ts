import { Sequelize } from 'sequelize';
import path from 'path';

const dbPath = process.env.SQLITE_PATH || path.resolve(process.cwd(), 'data', 'database.sqlite');

export const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbPath,
    logging: false,
});

export default sequelize;