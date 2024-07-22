import mongoose, { Schema } from "mongoose"

const reviewSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "Users",
  },
  rating: {
    type: Number,
    default: 0,
  },
  review: String,
  replies: [Object]
})

const linkSchema = new Schema({
  title: String,
  url: String,
})

const commentSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "Users",
  },  
  question: String,
  replies: [Object]
})

const courseDataSchema = new Schema({
  video_url: String,
  video_thumbnail: Object,
  title: String,
  video_section: String,
  description: String,
  video_length: Number,
  video_player: String,
  links: [linkSchema],
  suggestion: String,
  questions: [commentSchema],
})

const courseSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  estimated_price: {
    type: Number,
  },
  thumbnail: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    }
  },
  tags: {
    type: [String],
    required: true,
  },
  level: {
    type: String,
    required: true,
  },
  demo_url: {
    type: String,
    required: true,
  },
  benefits: [{ title: String }],
  pre_requisites: [{ title: String }],
  reviews: [reviewSchema],
  course_data: [courseDataSchema],
  ratings: {
    type: Number,
    default: 0,
  },
  total_purchase: {
    type: Number,
    default: 0,
  }
},{
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
  versionKey: false,
})

export default mongoose.model("Courses", courseSchema, "courses")