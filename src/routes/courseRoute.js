import express from 'express'
const router = express.Router()

import { addQuestionsToCourse, addReplyToReview, addReviewToCourse, createCourse, createCourseAdmin, deleteCourseAdmin, getAllCourses, getAllCoursesAdmin, getSingleCourse, getUserCourseById, giveReplyToQuestion, updateCourse, updateCourseAdmin } from '../controllers/courseController'
import { authenticateToken, authorizeRole } from '../middlewares/authHandler';
import { validateSchema } from '../middlewares/validationMiddleware';
import { addQuestionSchema, addReplySchema, addReviewReplySchema, addReviewSchema, createCourseSchema, updateCourseSchema } from '../validation/courseJoiSchemaValidation';


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
    validateSchema(addQuestionSchema),
  ],
  addQuestionsToCourse
)

router.put('/course/add-answer',
  [
    authenticateToken,
    validateSchema(addReplySchema),
  ],
  giveReplyToQuestion
)

router.put('/course/:course_id/review',
  [
    authenticateToken,
    validateSchema(addReviewSchema),
  ],
  addReviewToCourse
)

// Admin routes
router.put('/course/:course_id/review-reply',
  [
    authenticateToken,
    authorizeRole('admin'),
    validateSchema(addReviewReplySchema),
  ],
  addReplyToReview
)

router.get('/all-courses',
  [
    authenticateToken,
    authorizeRole('admin'),
  ],
  getAllCoursesAdmin
)

router.post('/course',
  [
    authenticateToken,
    authorizeRole('admin'),
    validateSchema(createCourseSchema)
  ],
  createCourseAdmin
)

router.patch('/course/:course_id',
  [
    authenticateToken,
    authorizeRole('admin'),
    validateSchema(updateCourseSchema)
  ],
  updateCourseAdmin
)

router.delete('/courses/:course_id',
  [
    authenticateToken,
    authorizeRole('admin'),
  ],
  deleteCourseAdmin
)

export default router;