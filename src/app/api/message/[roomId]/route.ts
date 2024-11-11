import connectToDB from "@/lib/database";
import MessageRoom from "@/models/messageRoom";
import Message from "@/models/message";
import { NextRequest, NextResponse } from "next/server";

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
