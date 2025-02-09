const cloudinary = require("cloudinary").v2;

const configCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_APIKEY,
    api_secret: process.env.CLOUD_API_SECRET,
  });
};

module.exports = configCloudinary;
