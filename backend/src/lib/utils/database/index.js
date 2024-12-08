import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import initModels from '../../../models/init-models.js'

dotenv.config();

const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } = process.env;
export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
   dialect: "mysql",
   host: "localhost",
});

export const models = initModels(sequelize);
