import express from 'express';
const router = express.Router();

import userRoute from './usersRoute';
import courseRoute from './courseRoute';

// Use the userRoute for any routes defined in userRoute
router.use('/users', userRoute);
router.use(courseRoute);

export default router;
