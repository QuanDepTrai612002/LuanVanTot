const BillDetails = require('../models/billDetailsModel');
const sequelize = require('../config/database');

const getAllBill = async (req, res) => {
    try {
        const cart = await BillDetails.findAll();
        res.json(cart);
    } catch (error) {
        console.error('Error fetching all orders:', error);
        res.status(500).json({ error: 'Error fetching all orders' });
    }
};

module.exports = {
    getAllBill
};