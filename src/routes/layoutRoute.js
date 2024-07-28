const express = require('express')
const router = express.Router()

const { createLayout, getLayout, editLayout } = require('../controllers/layoutController')
const { authorizeRole, authenticateToken } = require('../middlewares/authHandler')
import { validateSchema } from '../middlewares/validationMiddleware'
import { layoutSchema } from '../validation/layoutJoiSchemaValidation'

router.post('/layout',
  [
    authenticateToken,
    authorizeRole('admin'),
    validateSchema(layoutSchema),
    
  ],
  createLayout
)

router.get('/layout',
  [
    authenticateToken,
    authorizeRole('admin')
  ],
  getLayout
)

router.patch('/layout/:layout_id',
  [
    authenticateToken,
    authorizeRole('admin'),
    validateSchema(layoutSchema),
  ],
  editLayout
)

export default router;