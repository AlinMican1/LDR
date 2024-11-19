import mongoose from "mongoose";

const MessageRoomSchema = new mongoose.Schema({
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  ],
});

const MessageRoom =
  mongoose.models.MessageRoom ||
  mongoose.model("MessageRoom", MessageRoomSchema);

export default MessageRoom;
