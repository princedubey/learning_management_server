import express from "express"
const router = express.Router()

import { getUserProfile, loginUser, logoutUser, refreshToken, registerUser, requestPasswordReset, resendVerificationCode, resetPassword, verifyEmail } from "../controllers/usersController"
import { authenticateToken } from "../middlewares/authHandler"
import { 
  registerUserSchema, 
  verifyEmailSchema, 
  resendVerificationCodeSchema, 
  loginUserSchema, 
  requestPasswordResetSchema, 
  resetPasswordSchema 
} from "../validation/usersJoiSchemaValidation";

import { validateSchema } from "../middlewares/validationMiddleware";

router.post('/signup',
  [
    validateSchema(registerUserSchema)
  ],
  registerUser
)

router.post('/login',
  [
    validateSchema(loginUserSchema)
  ],
  loginUser
)

router.post('/email-verification',
  [
    validateSchema(verifyEmailSchema)
  ],
  verifyEmail
)

router.post('/resend-email-verification',
  [
    validateSchema(resendVerificationCodeSchema)
  ],
  resendVerificationCode
)

router.get('/refresh-token',
  refreshToken
)

router.post('/request-forget-password',
  [
    validateSchema(requestPasswordResetSchema)
  ],
  requestPasswordReset
)

router.post('/forget-password',
  [
    validateSchema(resetPasswordSchema)
  ],
  resetPassword
)

router.get('/logout',
  [
    authenticateToken
  ],
  logoutUser
)

router.get('/profile/:user_id',
  [
    authenticateToken
  ],
  getUserProfile
)



export default router;