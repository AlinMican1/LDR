import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String },
  age: { type: Number },
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
