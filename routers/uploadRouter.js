const express = require('express');
const { uploadImages } = require('../controllers/uploadIMGController');
const upload = require('../config/multerConfig');

const router = express.Router();

router.post('/upload', upload.array('images', 10), uploadImages);

module.exports = router;