const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const BillMain = sequelize.define("BillMain", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    account_id: {
        type: DataTypes.INTEGER,
        allowNull: false, // Không được để trống
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false, // Không được để trống
        defaultValue: DataTypes.NOW,
    },
    price: {
        type: DataTypes.DECIMAL(10, 2), // Đảm bảo kiểu số thực
        allowNull: false,
    },
    number_table: {
        type: DataTypes.INTEGER,
        allowNull: false, // Không được để trống
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false, // Không được để trống
        defaultValue: "Đã tạo",
    },
}, {
    tableName: "bill",
    timestamps: false,
});
module.exports = BillMain;
