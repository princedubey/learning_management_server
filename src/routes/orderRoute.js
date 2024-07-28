import express from 'express'
const router = express.Router()

import { createOrder, getAllOrders } from '../controllers/orderController'
import { authenticateToken, authorizeRole } from '../middlewares/authHandler'
import { validateSchema } from '../middlewares/validationMiddleware'
import { createOrderSchema } from '../validation/orderJoiSchemaValidation'

router.post('/create-order',
  [
    authenticateToken,
    validateSchema(createOrderSchema)
  ],
  createOrder
)

router.get('/all-orders',
  [
    authenticateToken,
    authorizeRole('admin'),
  ],
  getAllOrders
)

export default router