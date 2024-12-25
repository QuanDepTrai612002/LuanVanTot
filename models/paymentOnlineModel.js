
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PaymentOnline = sequelize.define(
  'PaymentOnline',
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
    payment_method: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    payment_status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    total_amount: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    payment_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: 'payment',
    timestamps: false, 
  }
);

module.exports = PaymentOnline; 
