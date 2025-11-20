import { sequelize } from '../src/config/database'

export default async () => {
    await sequelize.close();
};
