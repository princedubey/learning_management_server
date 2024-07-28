import express from "express"
import cors from 'cors'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import connectDB from "./src/utils/db"
import errorHandler from "./src/middlewares/errorHandler"
import router from './src/routes/index'
import {v2 as cloudinary} from 'cloudinary'

export const app = express()
require('dotenv').config()

app.use(express.json({limit: '50mb'}))
app.use(cookieParser())
app.use(morgan('dev'))
app.use(cors({
  origin: process.env.ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD']
}))

// Database connection
connectDB()

app.get('/health', (req, res)=> {
  res.status(200).json({
    success: true,
    message: "The server health is good❤️"
  })
})

app.use(`/lms/${process.env.VERSION}`, router)

app.get('*', (req, res)=> {
  res.status(404).json({
    success: false,
    message: "Requested url not found🫥"
  })
})

app.use(errorHandler)

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY
})

app.listen(process.env.PORT, () => {
  console.log(`server is running on http://localhost:${process.env.PORT} 🚀`)
})