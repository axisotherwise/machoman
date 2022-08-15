import dotenv from "dotenv";

dotenv.config({ path: "../.env"});

const config = {
  development: {
    username: "root",
    password: "test",
    database: "machoman",
    host: "127.0.0.1",
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
    host: "127.0.0.1",
    dialect: "mysql",
    logging: false,
  },
};

export default config;