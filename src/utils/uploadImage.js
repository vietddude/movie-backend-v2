const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// Configuration 
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRECT
});

// Middleware function to upload image and return URL
function uploadImage(req, res, next) {
  const file = req.file; // assume req.file contains the image file
  if (!file) {
    return res.status(400).json({ error: 'No image provided' });
  }

  const folder = req.body.folder || 'movie-cloud'; // Get the folder name from the request body or use 'movie-cloud' as the default folder

  // upload the image file to cloudinary with the specified folder
  cloudinary.uploader.upload(file.path, { folder }, (error, result) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ error: 'Error uploading image to cloudinary' });
    }

    // set the URL of the uploaded image on the request object
    req.image = result.secure_url;
    fs.unlinkSync(file.path);

    // pass control to the next middleware function
    next();
  });
}

module.exports = uploadImage;