const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const History = sequelize.define(
  "History",
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
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false, 
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    img: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: DataTypes.DECIMAL,
        allowNull: false,
    },
    count: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    total_price: {
        type: DataTypes.DECIMAL,
        allowNull: false,
    },
    order_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },    
    status: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    payment_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
  },
  {
    tableName: "order_history",
    timestamps: false,
  }
);

module.exports = History;