import Joi from 'joi';
import JoiObjectId from 'joi-objectid';

Joi.objectId = JoiObjectId(Joi);

export const createCourseSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required(),
  estimated_price: Joi.number().optional(),
  thumbnail: Joi.string().uri().optional(),
  tags: Joi.array().items(Joi.string()).required(),
  level: Joi.string().required(),
  demo_url: Joi.string().uri().required(),
  benefits: Joi.array().items(Joi.object({ title: Joi.string().required() })).optional(),
  pre_requisites: Joi.array().items(Joi.object({ title: Joi.string().required() })).optional(),
  course_data: Joi.array().items(Joi.object({
    video_url: Joi.string().uri().optional(),
    video_thumbnail: Joi.object().optional(),
    title: Joi.string().required(),
    video_section: Joi.string().optional(),
    description: Joi.string().optional(),
    video_length: Joi.number().optional(),
    video_player: Joi.string().optional(),
    links: Joi.array().items(Joi.object({ title: Joi.string().required(), url: Joi.string().uri().required() })).optional(),
    suggestion: Joi.string().optional(),
    questions: Joi.array().items(Joi.object({ user_id: Joi.objectId().required(), question: Joi.string().required(), replies: Joi.array().optional() })).optional(),
  })).optional()
});

export const updateCourseSchema = Joi.object({
  name: Joi.string().optional(),
  description: Joi.string().optional(),
  price: Joi.number().optional(),
  estimated_price: Joi.number().optional(),
  thumbnail: Joi.string().uri().optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  level: Joi.string().optional(),
  demo_url: Joi.string().uri().optional(),
  benefits: Joi.array().items(Joi.object({ title: Joi.string().required() })).optional(),
  pre_requisites: Joi.array().items(Joi.object({ title: Joi.string().required() })).optional(),
  course_data: Joi.array().items(Joi.object({
    video_url: Joi.string().uri().optional(),
    video_thumbnail: Joi.object().optional(),
    title: Joi.string().optional(),
    video_section: Joi.string().optional(),
    description: Joi.string().optional(),
    video_length: Joi.number().optional(),
    video_player: Joi.string().optional(),
    links: Joi.array().items(Joi.object({ title: Joi.string().optional(), url: Joi.string().uri().optional() })).optional(),
    suggestion: Joi.string().optional(),
    questions: Joi.array().items(Joi.object({ user_id: Joi.objectId().optional(), question: Joi.string().optional(), replies: Joi.array().optional() })).optional(),
  })).optional()
});

export const addQuestionSchema = Joi.object({
  question: Joi.string().required(),
  course_id: Joi.objectId().required(),
  content_id: Joi.objectId().required()
});

export const addReplySchema = Joi.object({
  answer: Joi.string().required(),
  course_id: Joi.objectId().required(),
  content_id: Joi.objectId().required(),
  question_id: Joi.objectId().required()
});

export const addReviewSchema = Joi.object({
  review: Joi.string().required(),
  rating: Joi.number().min(0).max(5).required()
});

export const addReviewReplySchema = Joi.object({
  review_id: Joi.objectId().required(),
  reply: Joi.string().required()
});
