import jwt from "jsonwebtoken"
import usersMetaDataModel from "../models/usersMetaDataModel"
require('dotenv').config()

// Function to generate JWT token
export const generateToken = (user, type = 'access') => {
  const expiresIn = type === 'access' ? '1h' : '3d'
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn })
  return token;
}

// Middleware to authenticate JWT token
export const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization
  if (!token) return res.status(403).json({
    success: false,
    message: "Access denied. No token provided."
  })
  
  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) return res.status(403).json({
      success: false,
      message: "Access denied. Invalid token." 
    })

    const userMeta = await usersMetaDataModel.findOne({ user_id: user._id });

    if (!userMeta || userMeta.access_token !== token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid or expired access token' 
      });
    }

    req.user = user
    next()
  })
}

// Middleware to handle expired JWT tokens
export const setTokensInCookies = (res, accessToken, refreshToken) => {
  const oneHour = 60 * 60 * 1000;
  const sevenDays = 7 * 24 * 60 * 60 * 1000;

  res.cookie('access_token', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'PROD',
    maxAge: oneHour,
    sameSite: 'Strict'
  });

  res.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'PROD',
    maxAge: sevenDays,
    sameSite: 'Strict'
  });
};