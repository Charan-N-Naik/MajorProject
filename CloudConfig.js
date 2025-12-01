
const cloudinary = require('cloudinary').v2;

const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECREAT
});


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'wanderlust_DEV',// heare defineing the we want foldername as wonderlsut in cloudenary cloud and suppring the folder 
    allowed_formats: ['jpg', 'jpeg', 'png'], // supports promises as well
  },
});


module.exports={storage,cloudinary}