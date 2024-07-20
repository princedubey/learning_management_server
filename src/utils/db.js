import mongoose from "mongoose"
require('dotenv').config()

const url = process.env.DB_URL || ''

const connectDB = async () => {
  try {
    await mongoose.connect(url).then((data) => {
      console.log(`Database connected with ${data.connection.host}🛜`)
    })
  } catch (error) {
    console.log(error.message)
  }
}

export default connectDB;
