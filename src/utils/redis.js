import Redis from "ioredis";
require('dotenv').config()

const redisClient = () => {
  if(!process.env.REDIS_URL) {
    throw new Error('Redis connection failed!')
  }

  console.log('Redis connected')
  return process.env.REDIS_URL
}

const redis = new Redis(redisClient())

export default redis