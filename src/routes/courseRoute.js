import express from 'express'
const router = express.Router()

import { addQuestionsToCourse, addReplyToReview, addReviewToCourse, createCourse, getAllCourses, getSingleCourse, getUserCourseById, giveReplyToQuestion, updateCourse } from '../controllers/courseController'
import { authenticateToken, authorizeRole } from '../middlewares/authHandler';
import { validateSchema } from '../middlewares/validationMiddleware';
import { createCourseSchema, updateCourseSchema } from '../validation/courseJoiSchemaValidation';

router.post('/course',
  [
    authenticateToken,
    authorizeRole('admin'),
    validateSchema(createCourseSchema)
  ],
  createCourse
)

router.patch('/course/:course_id',
  [
    authenticateToken,
    authorizeRole('admin'),
    validateSchema(updateCourseSchema)
  ],
  updateCourse
)

router.get('/course/:course_id',
  getSingleCourse
)

router.get('/courses',
  getAllCourses
)

router.get('/users/course/:course_id',
  [
    authenticateToken,
  ],
  getUserCourseById
)

router.put('/course/add-question',
  [
    authenticateToken,
  ],
  addQuestionsToCourse
)

router.put('/course/add-answer',
  [
    authenticateToken,
  ],
  giveReplyToQuestion
)

router.put('/course/:course_id/review',
  [
    authenticateToken,
  ],
  addReviewToCourse
)

router.put('/course/:course_id/review-reply',
  [
    authenticateToken,
    authorizeRole('admin'),
  ],
  addReplyToReview
)

export default router;