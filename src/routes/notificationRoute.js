import express from 'express'
import { getNotifications, updateNotification } from '../controllers/notificationController'
import { authenticateToken, authorizeRole } from '../middlewares/authHandler'
import { validateSchema } from '../middlewares/validationMiddleware'
import { updateNotificationSchema } from '../validation/notificationJoiSchemaValidation'
const router = express.Router()

router.get('/notifications', 
  [
    authenticateToken,
    authorizeRole('admin')
  ],
  getNotifications
)

router.patch('/notifications/:notification_id',
  [
    authenticateToken,
    authorizeRole('admin'),
    validateSchema(updateNotificationSchema),
  ],
  updateNotification
)

export default router