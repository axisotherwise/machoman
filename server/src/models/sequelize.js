import dotenv from "dotenv";

import { Sequelize } from "sequelize";

import config from "../config/config.js";

dotenv.config();

const env = process.NODE_ENV ? "production" : "development";
const { database, username, password } = config[env];
const sequelize = new Sequelize(database, username, password, config[env]);

export { sequelize };
export default sequelize;