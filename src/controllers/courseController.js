import coursesModel from "../models/coursesModel";
import cloudinary from "cloudinary"
import courseServiceProvider from "../services/courseServiceProvider";
import redis from '../utils/redis'
import usersModel from "../models/usersModel";
import { sendQuestionReplyNotificationEmail } from "../utils/mailer";
import notificationsModel from "../models/notificationsModel";

export const createCourseAdmin = async (req, res, next) => {
  try {
    const data = req.body

    if(data.thumbnail) {
      const myCloud = await cloudinary.v2.uploader.upload(data.thumbnail, { folder: 'course' })

      data.thumbnail = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      }
    }

    const newCourse = await courseServiceProvider.createCourse(data)

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: newCourse,
    })
    
  } catch (error) {
    console.error(error.message);
    next(error)
  }
}

//update course
export const updateCourseAdmin = async (req, res, next) => {
  try {
    const data = req.body
    const courseId = req.params.course_id

    const existingCourse = await courseServiceProvider.getCourseById(courseId)

    if(data.thumbnail) {

      if (existingCourse.thumbnail.public_id) {
        await cloudinary.v2.uploader.destroy(existingCourse.thumbnail.public_id)
      }
      const myCloud = await cloudinary.v2.uploader.upload(data.thumbnail, { folder: 'course' })
      data.thumbnail = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      }
    }

    const updatedCourse = await courseServiceProvider.updateCourse(courseId, data)

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    })
  } catch (error) {
    console.error(error.message);
    next(error)
  }
}

//get single course
export const getSingleCourse = async (req, res, next) => {
  try {
    const courseId = req.params.course_id

    const isCacheExists = await redis.get(courseId)

    if(isCacheExists) {
      const cachedCourse = JSON.parse(isCacheExists)
      return res.status(200).json({
        success: true,
        message: "Course fetched successfully",
        data: cachedCourse,
      })
    }

    const select = "-course_data.video_url -course_data.suggestion -course_data.questions -course_data.links"
    const course = await courseServiceProvider.getCourseById(courseId ,select)

    await redis.set(courseId, JSON.stringify(course), 'EX', 604800) // 7 days expiration

    res.status(200).json({
      success: true,
      message: "Course fetched successfully",
      data: course,
    })
  } catch (error) {
    console.error(error.message);
    next(error)
  }
}

//get all courses
export const getAllCourses = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const sort = req.query.sort || "-createdAt"

    const isCacheExists = await redis.get("allCourses")

    if(isCacheExists) {
      const cachedCourse = JSON.parse(isCacheExists)
      return res.status(200).json({
        success: true,
        message: "Courses fetched successfully",
        data: cachedCourse,
      })
    }
    const select = "-course_data.video_url -course_data.suggestion -course_data.questions -course_data.links"
    const courses = await courseServiceProvider.getAllCourses({select: select})

    // catch the all courses data in redis
    await redis.set("allCourses", JSON.stringify(courses))

    res.status(200).json({
      success: true,
      message: "Courses fetched successfully",
      data: courses,
    })
  } catch (error) {
    console.error(error.message);
    next(error)
  }
}


// get course by id
export const getUserCourseById = async (req, res, next) => {
  try {
    const courseId = req.params.course_id
    const userId = req.user._id

    const user = await usersModel.findById(userId)

    const courseExists = user.courses.find(course => (course._id).toString() === courseId)

    if (!courseExists) {
      return res.status(404).json({
        success: false,
        message: "You are not eligible for access this course!"
      })
    }

    const course = await courseServiceProvider.getCourseById(courseId)

    const content = course?.course_data

    res.status(200).json({
      success: true,
      message: "Course fetched successfully",
      data: content,
    })
  } catch (error) {
    console.error(error.message);
    next(error)
  }
}

// Add questions to the course
export const addQuestionsToCourse = async (req, res, next) => {
  try {
    const { question, course_id, content_id } = req.body
    const userId = req.user._id

    const course = await coursesModel.findById(course_id)
    const courseContent = course.course_data.find(content => content._id.equals(content_id))
    
    if (!courseContent) {
      return res.status(404).json({
        success: false,
        message: "Invalid content id"
      })
    }

    const newQuestion = {
      user_id: userId,
      question: question,
      question_replies: []
    }

    courseContent.questions.push(newQuestion)

    await course.save()

    res.status(200).json({
      success: true,
      message: "Questions added successfully",
    })
    
  } catch (error) {
    console.error(error.message);
    next(error)
  }
}

// Give reply to questions
export const giveReplyToQuestion = async (req, res, next) => {
  try {
    const { answer, course_id, content_id, question_id } = req.body
    const userId = req.user._id

    const course = await coursesModel.findById(course_id).populate({
      path: 'course_data.questions.user_id',
    })

    const courseContent = course.course_data.find(content => content._id.equals(content_id))
    const question = courseContent.questions.id(question_id)

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Invalid question id"
      })
    }

    question.replies.push({
      user_id: userId,
      answer: answer,
    })

    await course.save()

    if(userId === question.user_id) {
      await notificationsModel.create({
        user_id: userId,
        title: "comment",
        message: `${req.user.name} has replied to your question on ${courseContent.title}`,
      })
    } else {
      await sendQuestionReplyNotificationEmail(question.user_id.email, question.user_id.name, courseContent.title)
    }

    res.status(200).json({
      success: true,
      message: "Reply added successfully",
    })
    
  } catch (error) {
    console.error(error.message);
    next(error)
  }
}

// Add review in course
export const addReviewToCourse = async (req, res, next) => {
  try {
    const courseId = req.params.course_id
    const { courses, userName } = req.user
    const { review, rating } = req.body

    const courseContent = courses.includes(courseId)
    
    if (!courseContent) {
      return res.status(404).json({
        success: false,
        message: "Invalid content id"
      })
    }

    const existingCourse = await coursesModel.findById(courseId)

    existingCourse.reviews.push({
      user_id: req.user._id,
      review,
      rating,
    })

    // Find average rating for main course
    const totalRating = existingCourse.reviews.reduce((acc, cur) => acc + cur.rating, 0);
    existingCourse.ratings = totalRating / existingCourse.reviews.length;

    await existingCourse.save()

    const NOTIFICATION = {
      user_id: req.user._id,
      title: "review",
      message: `User ${userName} has added a new review for ${existingCourse.name}`,
    }

    await notificationsModel.create(NOTIFICATION)

    res.status(200).json({
      success: true,
      message: "Review added successfully",
    })

  }
  catch (err) {
    console.error(err.message);
    return next(err);
  }
}

// Add reply to review
export const addReplyToReview = async (req, res, next) => {
  try {
    const { review_id, reply } = req.body
    const userId = req.user._id
    const { name } = req.user
    const courseId = req.params.course_id
    
    const course = await coursesModel.findById(courseId)
    const review = course.reviews.find( review => (review._id).toString() === review_id)
    
    console.log(review_id, review)
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Invalid review id"
      })
    }
    
    review.replies.push({
      user_id: userId,
      reply,
    })
    
    await course.save()
    
    const NOTIFICATION = {
      user_id: userId,
      title: "review",
      message: `User ${name} has added a new reply for review on ${course.name}`,
    }

    await notificationsModel.create(NOTIFICATION)
        
    res.status(200).json({
      success: true,
      message: "Reply added successfully",
    })
    
  } catch (err) {
    console.error(err.message);
    return next(err);
  }
}

// Get all courses --- admin
export const getAllCoursesAdmin = async (req, res, next) => {
  try {
    const courses = await courseServiceProvider.getAllCourses({})

    res.status(200).json({
      success: true,
      message: "Courses fetched successfully",
      data: courses,
    })
  } catch (error) {
    console.error(error.message);
    next(error)
  }
}

// Delete course --- admin
export const deleteCourseAdmin = async (req, res, next) => {
  try {
    const courseId = req.params.course_id

    const course = await courseServiceProvider.deleteCourse(courseId)

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      })
    }

    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    })
  } catch (error) {
    console.error(error.message);
    next(error)
  }
}