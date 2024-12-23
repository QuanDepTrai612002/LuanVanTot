const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Address = sequelize.define(
  "Address",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    account_id: {
        type: DataTypes.INTEGER,
        allowNull: false, 
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone_number: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    address_line: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    district: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    created_at: {
        type: DataTypes.TIME,
        allowNull: false,
    },
  },
  {
    tableName: "address",
    timestamps: false,
  }
);

module.exports = Address;