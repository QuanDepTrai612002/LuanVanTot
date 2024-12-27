const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Category = sequelize.define(
  "Category",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
      },
  },
  {
    tableName: "category",
    timestamps: false,
  }
);

module.exports = Category;
