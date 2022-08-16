import dotenv from "dotenv";

dotenv.config();

const config = {
  development: {
    username: process.env.DB_ID,
    // username: 'root',
    password: process.env.DB_PW,
    // password: 'test',
    database: process.env.DB,
    // database: 'machoman',
    host: process.env.DB_EP,
    dialect: "mysql",
    logging: false,
  },
  test: {
    username: "root",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  production: {
    username: process.env.DB_ID,
    password: process.env.DB_PW,
    database: process.env.DB,
    host: "database-1.clteqk4g9xus.ap-northeast-2.rds.amazonaws.com",
    dialect: "mysql",
    logging: false,
  },
};

export default config;