const express = require('express')
const { userAnalytics, courseAnalytics, orderAnalytics } = require('../controllers/analyticsController')
const { authorizeRole, authenticateToken } = require('../middlewares/authHandler')
const router = express.Router()

router.get('/users-analysis',
  [
    authenticateToken,
    authorizeRole('admin')
  ],
  userAnalytics
)

router.get('/courses-analysis',
  [
    authenticateToken,
    authorizeRole('admin')
  ],
  courseAnalytics
)

router.get('/orders-analysis',
  [
    authenticateToken,
    authorizeRole('admin')
  ],
  orderAnalytics
)


export default router;