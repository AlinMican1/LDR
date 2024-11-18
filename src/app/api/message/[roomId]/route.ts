import connectToDB from "@/lib/database";
import MessageRoom from "@/models/messageRoom";
import Message from "@/models/message";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user";

export async function GET(
  request: NextRequest,
  { params }: { params: { roomId: string } }
) {
  const { roomId } = params;
  if (!roomId) {
    return NextResponse.json(
      { message: "Room does not exist" },
      { status: 404 }
    );
  }

  try {
    await connectToDB();
    // const messageRoomData = await MessageRoom.findById(roomId);
    // console.log(messageRoomData.messages);
    const messages = await Message.find();
    if (messages) {
      const messageRoomData = await MessageRoom.findById(roomId).populate({
        path: "messages", // Populate messages in the room
        populate: {
          path: "sender", // Populate the sender of each message
          select: "username avatarURL _id", // You can choose the fields for the sender
        },
      });

      if (!messageRoomData) {
        return NextResponse.json(
          { message: "Room Does not exist" },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          message: messageRoomData.messages,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          message: "No messages yet",
        },
        { status: 200 }
      );
    }
  } catch (err: any) {
    console.error("Error:", err);
    return NextResponse.json({ message: "Internal Error " }, { status: 500 });
  }
}

// This function is to update the user last visit in the chatroom, if there is a new msg leave a notification symbol
export async function PUT(
  request: NextRequest,
  { params }: { params: { roomId: string } }
) {
  const { roomId } = params;
  const { userId } = await request.json();
  if (!roomId || !userId) {
    return NextResponse.json(
      { message: "Room or user does not exist" },
      { status: 404 }
    );
  }
  console.log("hi", roomId);
  try {
    await connectToDB();
    const chatRoom = await MessageRoom.findById(roomId).select("users");
    if (!chatRoom) {
      return NextResponse.json(
        { message: "Chat room not found" },
        { status: 404 }
      );
    }
    const userIdAsObjectId = new mongoose.Types.ObjectId(userId);

    if (
      !chatRoom.users.some(
        (user: { equals: (arg0: mongoose.Types.ObjectId) => any }) =>
          user.equals(userIdAsObjectId)
      )
    ) {
      return NextResponse.json(
        { message: "User is not part of this chat room" },
        { status: 400 }
      );
    }

    const updateLastRead = await User.findById(userId);
    updateLastRead.messageLastRead = new Date();
    await updateLastRead.save();

    return NextResponse.json(
      { message: "Message read timestamp updated for user" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}
