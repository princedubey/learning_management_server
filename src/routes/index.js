import express from 'express';
const router = express.Router();

import userRoute from './usersRoute'
import courseRoute from './courseRoute'
import orderRoute from './orderRoute'
import notificationRoute from './notificationRoute'
import analyticsRoute from './analyticsRoute'
import layoutRote from './layoutRoute'

// Use the userRoute for any routes defined in userRoute
router.use('/users', userRoute);
router.use(courseRoute);
router.use(orderRoute);
router.use(notificationRoute);
router.use(analyticsRoute);
router.use(layoutRote);

export default router;
