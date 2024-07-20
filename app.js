import express from "express"
import cors from 'cors'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import connectDB from "./src/utils/db"
import errorHandler from "./src/middlewares/errorHandler"
import router from './src/routes/index'

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

app.listen(process.env.PORT, () => {
  console.log(`server is running on http://localhost:${process.env.PORT} 🚀`)
})