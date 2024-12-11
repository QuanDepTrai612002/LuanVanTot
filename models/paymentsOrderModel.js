const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PaymentOrder = sequelize.define(
    'PaymentOrder',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        bill_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        payment_method: {
            type: DataTypes.ENUM('cash', 'transfer'), // cash = tiền mặt, transfer = chuyển khoản
            allowNull: false,
        },
        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        note: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        payment_date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        tableName: 'payments',
        timestamps: false,
    }
);

module.exports = PaymentOrder;
