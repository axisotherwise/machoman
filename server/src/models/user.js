import Sequelize from "sequelize";

import { sequelize } from "./sequelize.js";

import Post from "./post.js";
import Comment from "./comment.js";

export default class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      email: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING(150),
        allowNull: true,
      },
      nickname: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      provider: {
        type: Sequelize.STRING(10),
        allowNull: false,
        defaultValue: "local",
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
  };

  static associate(db) {
    db.User.hasMany(db.Post);
    db.User.hasMany(db.Comment);
  };

  static getUserPosts = async (id) => {
    const user = await this.findOne({ where: { id }, include: [{
      model: Post,
      attributes: ["title", "content", "image"],
      include: {
        model: Comment,
        order: ["createdAt", "DESC"],
        attributes: ["comment"],
        include: {
          model: User,
          attributes: ["email", "nickname"],
        }
      }
    },]});
    return user;
  };
}