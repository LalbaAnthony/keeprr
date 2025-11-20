import { sequelize } from '../src/config/database'

export default async () => {
    await sequelize.authenticate();
    await sequelize.drop();
    await sequelize.sync({ force: true });
};