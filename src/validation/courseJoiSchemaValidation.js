import Joi from 'joi';

// Define nested schemas
const reviewSchema = Joi.object({
  user_id: Joi.string().required(),
  rating: Joi.number().min(0).max(5).default(0),
  comment: Joi.string().optional()
});

const linkSchema = Joi.object({
  title: Joi.string().required(),
  url: Joi.string().uri().required()
});

const commentSchema = Joi.object({
  user_id: Joi.string().required(),
  comment: Joi.string().required(),
  comment_replies: Joi.array().items(Joi.object({
    user_id: Joi.string().required(),
    comment: Joi.string().required()
  })).optional()
});

const courseDataSchema = Joi.object({
  video_url: Joi.string().uri().required(),
  video_thumbnail: Joi.object({
    public_id: Joi.string().required(),
    url: Joi.string().uri().required()
  }).required(),
  title: Joi.string().required(),
  video_section: Joi.string().required(),
  description: Joi.string().required(),
  video_length: Joi.number().min(0).required(),
  video_player: Joi.string().required(),
  links: Joi.array().items(linkSchema).optional(),
  suggestion: Joi.string().optional(),
  questions: Joi.array().items(commentSchema).optional()
});

// Main course schema
export const createCourseSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required(),
  estimated_price: Joi.number().optional(),
  thumbnail: Joi.string().uri().optional(),
  tags: Joi.array().items(Joi.string().required()).required(),
  level: Joi.string().required(),
  demo_url: Joi.string().uri().required(),
  benefits: Joi.array().items(Joi.object({
    title: Joi.string().required()
  })).optional(),
  pre_requisites: Joi.array().items(Joi.object({
    title: Joi.string().required()
  })).optional(),
  reviews: Joi.array().items(reviewSchema).optional(),
  course_data: Joi.array().items(courseDataSchema).optional(),
  ratings: Joi.number().min(0).max(5).default(0).optional(),
  total_purchase: Joi.number().min(0).default(0).optional()
})

export const updateCourseSchema = Joi.object({
  name: Joi.string().optional(),
  description: Joi.string().optional(),
  price: Joi.number().optional(),
  estimated_price: Joi.number().optional(),
  thumbnail: Joi.string().uri().optional(),
  tags: Joi.array().items(Joi.string().optional()).optional(),
  level: Joi.string().optional(),
  demo_url: Joi.string().uri().optional(),
  benefits: Joi.array().items(Joi.object({
    title: Joi.string().optional()
  })).optional(),
  pre_requisites: Joi.array().items(Joi.object({
    title: Joi.string().optional()
  })).optional(),
  reviews: Joi.array().items(reviewSchema).optional(),
  course_data: Joi.array().items(courseDataSchema).optional(),
  ratings: Joi.number().min(0).max(5).optional(),
  total_purchase: Joi.number().min(0).optional()
});