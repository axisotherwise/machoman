import Sequelize from "sequelize";

import { sequelize } from "./sequelize.js";

export default class Post extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      title: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      content: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      image: {
        type: Sequelize.STRING(150),
        allowNull: true,
      },
    }, {
      sequelize,
      timestamps: true,
      paranoid: false,
      underscored: false,
      modelName: "Post",
      tableName: "post",
      charset: "utf8",
      collate: "utf8_general_ci",
    });
  }
  static associate(db) {
    db.Post.hasMany(db.Comment);
    db.Post.belongsTo(db.User);
  }
}