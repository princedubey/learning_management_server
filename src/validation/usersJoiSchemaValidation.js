import Joi from 'joi'

// Schema for user registration
export const registerUserSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  avatar: Joi.string().uri().optional()
})

// Schema for email verification
export const verifyEmailSchema = Joi.object({
  email: Joi.string().email().required(),
  code: Joi.string().length(4).required()
})

// Schema for resending verification code
export const resendVerificationCodeSchema = Joi.object({
  email: Joi.string().email().required()
})

// Schema for user login
export const loginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
})

// Schema for requesting password reset
export const requestPasswordResetSchema = Joi.object({
  email: Joi.string().email().required()
})

// Schema for resetting password
export const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().min(6).required()
})

export const updateUserSchema = Joi.object({
  name: Joi.string().optional(),
  email: Joi.string().email().optional(),
  avatar: Joi.string().uri().optional(),
  current_password: Joi.string().optional().min(6),
  new_password: Joi.string().optional().min(6)
});

export const updatePasswordSchema = Joi.object({
  current_password: Joi.string().required().min(6),
  new_password: Joi.string().required().min(6)
});