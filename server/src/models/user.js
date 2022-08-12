import Sequelize from "sequelize";

import { sequelize } from "./sequelize.js";

export default class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      email: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      nickname: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
    }, {
      sequelize,
      timestamps: true,
      paranoid: false,
      underscored: false,
      modelName: "User",
      tableName: "user",
      charset: "utf8",
      collate: "utf8_general_ci",
    });
  }
  static associate(db) {
    db.User.hasMany(db.Post);
    db.User.hasMany(db.Comment);
  }
}