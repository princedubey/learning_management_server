import express from "express"
const router = express.Router()

import { getAllUsers, getUserProfile, loginUser, logoutUser, refreshToken, registerUser, requestPasswordReset, resendVerificationCode, resetPassword, updateUserDetails, verifyEmail } from "../controllers/usersController"
import { authenticateToken, authorizeRole } from "../middlewares/authHandler"
import { 
  registerUserSchema, 
  verifyEmailSchema, 
  resendVerificationCodeSchema, 
  loginUserSchema, 
  requestPasswordResetSchema, 
  resetPasswordSchema, 
  updateUserSchema,
  updatePasswordSchema
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

router.post('/logout',
  [
    authenticateToken
  ],
  logoutUser
)

router.get('/profile',
  [
    authenticateToken,
  ],
  getUserProfile
)

router.patch('/profile',
  [
    authenticateToken,
    validateSchema(updateUserSchema),
  ],
  updateUserDetails
)

router.patch('/update-password',
  [
    authenticateToken,
    validateSchema(updatePasswordSchema)
  ],
  updateUserDetails
)

// Admin routes only accessible by admin users
router.get('/all-users', 
  [
    authenticateToken,
    authorizeRole('admin')
  ],
  getAllUsers
)


export default router;