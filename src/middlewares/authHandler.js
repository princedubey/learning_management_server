import jwt from "jsonwebtoken"
import usersMetaDataModel from "../models/usersMetaDataModel"
import usersModel from "../models/usersModel"
require('dotenv').config()

export const generateToken = (user, type = 'access') => {
  const expiresIn = type === 'access' ? '1h' : '3d'
  
  const token = jwt.sign( {_id: user._id} , process.env.JWT_SECRET, { expiresIn })
  return token;
}

export const authenticateToken = (req, res, next) => {
  let token = req.headers.authorization
  token = req.cookies.access_token

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

    user = await usersModel.findById(user._id)

    req.user = user
    next()
  })
}

export const setTokensInCookies = (res, accessToken, refreshToken) => {
  const oneHour = 60 * 60 * 1000; // 1 hour
  const sevenDays = 7 * 24 * 60 * 60 * 1000; // 7 days

  const isProd = process.env.NODE_ENV === 'production'; // use 'production' instead of 'PROD'

  res.cookie('access_token', accessToken, {
    httpOnly: true,
    secure: isProd,
    maxAge: oneHour, 
    sameSite: 'Strict', // Consider 'Lax' if you need cross-site usage
  });

  res.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    secure: isProd,
    maxAge: sevenDays,
    sameSite: 'Strict', // Consider 'Lax' if you need cross-site usage
  });

  res.cookie('is_auth', true, {
    httpOnly: false, // Client needs access to this cookie
    secure: isProd,
    maxAge: sevenDays,
    sameSite: 'Strict', // Adjust based on your requirements
  });
};

export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await usersModel.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: "User not found" });

    if (!user.isVerified) return res.status(400).json({ success: false, message: "User not verified" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: "Invalid email or password" });

    // Generate access and refresh tokens
    const accessToken = generateToken(user); 
    const refreshToken = generateToken(user, 'refresh'); 

    // Update or insert token metadata
    await usersMetaDataModel.findOneAndUpdate(
      { user_id: user._id },
      { access_token: accessToken, refresh_token: refreshToken },
      { upsert: true, new: true }
    );

    // Set cookies
    setTokensInCookies(res, accessToken, refreshToken);

    // Send success response
    res.status(200).json({
      success: true,
      message: "User Login Successfully",
      data: {
        userId: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        access_token: accessToken, // Optionally remove this if you prefer using only cookies
      },
    });
  } catch (error) {
    console.error(error.stack); // Logging the error stack for debugging
    next(error);
  }
};


export const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next({
        status: 403,
        message: "Access denied. You don't have access"
      })
    }
    next()
  }
}