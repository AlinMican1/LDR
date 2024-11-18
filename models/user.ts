import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide username"],
  },
  email: {
    type: String,
    required: [true, "Please provide email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  avatarURL: {
    type: String,
    default:
      "https://alin-ldr-startup.s3.eu-north-1.amazonaws.com/avatars/noUser.JPG",
  },
  loverTag: {
    type: String,
    unique: true,
    required: true,
  },
  meetDate: {
    type: String,
    default: null,
  },
  request: {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
      default: null,
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
      default: null,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  lover: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  messageRooms: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MessageRoom",
    },
  ],
  messageLastRead: {
    type: Date,
    default: null,
  },
  forgotPasswordToken: String,
  forgotPasswordTokenExpiry: Date,
  verifyToken: String,
  verifyTokenExpiry: Date,
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
