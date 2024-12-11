const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const BillDetails = sequelize.define(
  "BillDetails",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    account_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    number_table: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    count: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      product_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status:{
        type: DataTypes.STRING,
        allowNull: false,
    },
  },
  {
    tableName: "bill_details",
    timestamps: false,
  }
);

module.exports = BillDetails;
