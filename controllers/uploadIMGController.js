const cloudinary = require('../config/cloudinary');

const uploadImages = async (req, res) => {
    try {
        const images = req.files.map((file) => file.path);

        const uploadImages = [];

        for (let image of images) {
            const result = await cloudinary.uploader.upload(image);
            console.log(result);
            uploadImages.push({
                url: result.secure_url,
                publicId: result.public_id,
            });
        }
        return res.status(200).json({
            message: "Thành công",
            datas: uploadImages,
        });
    } catch (error) {
        return res.status(400).json({
            name: error.name,
            message: error.message,
        });
    }
};

module.exports = { uploadImages };