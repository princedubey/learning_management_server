import mongoose, { Schema } from "mongoose"

const usersMetaSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true,
    unique: true
  },
  email_verification: {
    code: {
      type: String,
    },
    expiry_date: {
      type: Date,
    }
  },
  reset_password: {
    token: {
      type: String,
    },
    expiry_date: {
      type: Date,
    },
  },
  access_token: {
    type: String,
  },
  refresh_token: {
    type: String,
  }
},{
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  },
  versionKey: false
})

export default mongoose.model("UsersMetaData", usersMetaSchema, "users_meta_data")
