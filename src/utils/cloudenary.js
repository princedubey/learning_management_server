import {v2 as cloudenary} from 'cloudinary'
require('dotenv').config()

// Initialize Cloudinary
cloudenary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY
})

export default cloudinaryConfig;