import mongoose from "mongoose";
const { Schema } = mongoose;

const avatarSchema = new Schema({
  url: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true
  }
});

const usersSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    index: true,
    unique: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email address"
    ]
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  avatar: avatarSchema,
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  courses: [{
    type: Schema.Types.ObjectId,
    ref: "Courses"
  }]
}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  },
  versionKey: false
});

export default mongoose.model("Users", usersSchema, "users");
