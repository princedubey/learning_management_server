import mongoose from "mongoose";

const ordersModelSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Courses",
    required: true,
  },
  payment_info: {
    type: Object,
  },
  status: {
    type: String,
    enum: ["inprogress", "confirmed", "cancelled"],
    default: "processing",
  },
}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
  versionKey: false,
})

export default mongoose.model("Orders", ordersModelSchema, "orders")