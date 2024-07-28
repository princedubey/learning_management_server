import mongoose from "mongoose";

const notificationModelSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  title: {
    type: String,
    required: true,
    enum: ["message", "comment", "review", "order_placed"]
  },
  message: {
    type: String,
    required: true
  },
  is_read: {
    type: Boolean,
    default: false
  },
},{
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  },
  versionKey: false
})

export default mongoose.model("Notification", notificationModelSchema, "notifications")