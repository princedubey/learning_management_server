import mongoose from 'mongoose'
const { Schema } = mongoose

const faQSchema = new Schema({ 
  question: {
    type: String,
  },
  answer: {
    type: String,
  }
})

const categorySchema = new Schema({
  title: {
    type: String,
  } 
})

const bannerImageSchema = new Schema({
  public_id: { type: String },
  url: { type: String }
})

const layoutSchema = new Schema({
  type: { type: String },
  faq: [faQSchema],
  categories: [categorySchema],
  banner: {
    image: [bannerImageSchema],
    title: { type: String },
    sub_title: { type: String },
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },
  versionKey: false
})

export default mongoose.model('Layouts', layoutSchema, 'layouts')