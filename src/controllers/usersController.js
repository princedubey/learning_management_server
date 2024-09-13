import usersModel from "../models/usersModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import crypto from "crypto"
import cloudinary from "cloudinary"
import { generateToken, setTokensInCookies } from "../middlewares/authHandler";
import { sendPasswordResetEmail, sendVerificationEmail } from "../utils/mailer";
import usersMetaDataModel from "../models/usersMetaDataModel";
import usersServiceProvider from "../services/usersServiceProvider";

//register users
export const registerUser = async (req, res, next) => {
  const { name, email, password, avatar } = req.body;

  try {
    const userExists = await usersModel.findOne({ email });
    if (userExists) return res.status(400).json({
      success: false,
      message: "User already exists" 
    })

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new usersModel({ name, email, password: hashedPassword, avatar })
    await newUser.save()

    const verificationCode = await saveUserMetaData(email)
    await sendVerificationEmail(email, verificationCode)

    res.status(201).json({
      success: true,
      user: newUser,
    })
  } catch (error) {
    console.error(error.message);
    next(error)
  }
}

export const verifyEmail = async (req, res, next) => {
  const { email, code } = req.body

  try {
    const user = await usersModel.findOne({ email })
    if (!user) return res.status(404).json({
      success: false,
      message: "User not found" 
    })

    if (user.isVerified) return res.status(404).json({
      success: false,
      message: "User already verified" 
    })

    const userMeta = await usersMetaDataModel.findOne({ user_id: user.id })

    if (userMeta.email_verification.code !== code || new Date() > userMeta.email_verification.expiry_date) {
      return res.status(400).json({ message: "Invalid or expired verification code" })
    }

    user.isVerified = true

    await user.save()

    res.status(200).json({
      success: true,
      message: "Email successfully verified"
    })
  } catch (error) {
    console.error(error.message)
    next(error)
  }
}

export const resendVerificationCode = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await usersModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (user.isVerified) return res.status(404).json({
      success: false,
      message: "User already verified" 
    })

    const verificationCode = await saveUserMetaData(email)

    // Send the verification email
    await sendVerificationEmail(email, verificationCode);

    res.status(200).json({
      success: true,
      message: "Verification code resent successfully"
    });
  } catch (error) {
    console.error(error.message);
    next(error);
  }
}

export const loginUser = async (req, res, next) => {
  const { email, password } = req.body

  try {
    const user = await usersModel.findOne({ email })
    if (!user) return res.status(400).json({
      success: false,
      message: "User not found" 
    })

    if (!user.isVerified) return res.status(400).json({
      success: false,
      message: "User not verified" 
    })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(400).json({
      success: false,
      message: "Invalid email or password" 
    })

    //generate access token
    const accessToken = generateToken(user);
    const refreshToken = generateToken(user, 'refresh');

    await usersMetaDataModel.findOneAndUpdate(
      { user_id: user._id },
      {
        access_token: accessToken,
        refresh_token: refreshToken
      },
      { upsert: true, new: true }
    );

    setTokensInCookies(res, accessToken, refreshToken);

    res.status(200).json({
      success: true,
      message: "User Login Successfully",
      data: {
        userId: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        access_token: accessToken,
      },
    });
  } catch (error) {
    console.error(error.message);
    next(error)
  }
}

export const refreshToken = async (req, res, next) => {
  const refreshToken = req.cookies.refresh_token;

  if (!refreshToken) {
    return res.status(403).json({
      success: false,
      message: "Access denied. No refresh token provided."
    });
  }

  try {
    const userId = jwt.verify(refreshToken, process.env.JWT_SECRET).id;
    const userMeta = await usersMetaDataModel.findOne({ user_id: userId });

    if (!userMeta || userMeta.refresh_token !== refreshToken) {
      return res.status(403).json({
        success: false,
        message: "Invalid refresh token."
      });
    }

    const user = await usersModel.findById(userId);
    if (!user) return res.status(400).json({
      success: false,
      message: "User not found" 
    });

    const newAccessToken = generateToken(user);
    const newRefreshToken = generateToken(user, 'refresh');

    await usersMetaDataModel.findOneAndUpdate(
      { user_id: user._id },
      {
        access_token: newAccessToken,
        refresh_token: newRefreshToken
      },
      { upsert: true, new: true }
    );

    setTokensInCookies(res, newAccessToken, newRefreshToken);

    res.status(200).json({
      success: true,
      access_token: newAccessToken,
      refresh_token: newRefreshToken
    });
  } catch (error) {
    console.error(error.message);
    next(error);
  }
}

export const requestPasswordReset = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await usersModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetTokenExpires = new Date(Date.now() + 3600000); // Token expires in 1 hour

    await usersMetaDataModel.findOneAndUpdate(
      { user_id: user._id },
      {
        reset_password: {
          token: resetToken,
          expiry_date: resetTokenExpires,
        }
      },
      { upsert: true, new: true }
    );

    await sendPasswordResetEmail(email, resetToken);

    res.status(200).json({
      success: true,
      message: "Password reset token sent to email",
    });
  } catch (error) {
    console.error(error.message);
    next(error);
  }
}

export const resetPassword = async (req, res, next) => {
  const { token, password: newPassword } = req.body;

  try {
    const userMeta = await usersMetaDataModel.findOne({ "reset_password.token": token });

    if (!userMeta || new Date() > userMeta.reset_password.expiry_date) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }


    const user = await usersModel.findById(userMeta.user_id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    // Clear reset token
    await usersMetaDataModel.findOneAndUpdate(
      { user_id: user._id },
      {
        $set: {
          'reset_password.token': null,
          'reset_password.expiry_date': null,
        }
      }
    );

    res.status(200).json({
      success: true,
      message: "Password successfully reset",
    });
  } catch (error) {
    console.error(error.message);
    next(error);
  }
}

export const logoutUser = async (req, res, next) => {
  try {
    const userId = req.user._id;
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    res.clearCookie('is_auth')

    await usersMetaDataModel.findOneAndUpdate(
      { user_id: userId },
      {
        $set: {
          access_token: null,
          refresh_token: null
        }
      }
    )

    res.status(200).json({
      success: true,
      message: 'Successfully logged out',
    });
  } catch (error) {
    console.error(error.message);
    next(error);
  }
};

export const getUserProfile = async (req, res, next) => {
  try {
    const user = await usersModel.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      success: true,
      message: "User Profile fetched Successfully",
      data: user
    });
  } catch (error) {
    console.error(error.message);
    next(error)
  }
}

export const updateUserDetails = async (req, res, next) => {
  const { name, email, avatar, current_password: currentPassword, new_password: newPassword } = req.body;
  const userId = req.user._id;

  try {
    const user = await usersModel.findById(userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      })
    }

    if (newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: "Current password is incorrect"
        });
      }
    }

    if (name) user.name = name;
    if (email) {
      user.email = email
      user.isVerified = false
    }

    if (avatar) {
      if (user.avatar?.code) {
        await cloudinary.v2.uploader.destroy(user.avatar.code);
      }
      const result = await cloudinary.v2.uploader.upload(avatar, { folder: 'avatars', width: 200, height: 200, crop: 'thumb' });
      user.avatar = {
        url: result.url,
        code: result.public_id,
      }
    }

    if (newPassword) user.password = await bcrypt.hash(newPassword, 10);

    await user.save();
    const updatedUser = await usersModel.findById(userId);

    res.status(200).json({
      success: true,
      message: "User details updated successfully",
      data: updatedUser
    });
  } catch (error) {
    console.error(error.message);
    next(error);
  }
}

const saveUserMetaData = async (email) => {
  const user = await usersModel.findOne({ email })
  const verificationCode = Math.floor(1000 + Math.random() * 9000);
  const verificationCodeExpires = new Date(Date.now() + 120000)
  await usersMetaDataModel.findOneAndUpdate(
    { user_id: user._id },
    {
      user_id: user._id,
      email_verification: {
        code: verificationCode,
        expiry_date: verificationCodeExpires
      }
    },
    { upsert: true, new: true }
  )

  return verificationCode;
}

// Get all users ---- admin
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await usersServiceProvider.getAllUsers({})

    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users
    });
  } catch (error) {
    console.error(error.message);
    next(error);
  }
}