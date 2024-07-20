import express from 'express';
const router = express.Router();

import userRoute from './usersRoute';

// Use the userRoute for any routes defined in userRoute
router.use('/users', userRoute);

export default router;
