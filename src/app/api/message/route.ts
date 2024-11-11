import connectToDB from "@/lib/database";
import { pusherServer } from "@/lib/pusher";
import Message from "@/models/message";
import MessageRoom from "@/models/messageRoom";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { email, message, roomId } = await request.json();
  if (!email || !message || !roomId) {
    return NextResponse.json(
      { message: "no email or message given" },
      { status: 400 }
    );
  }
  try {
    await connectToDB();

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "User does not exist" },
        { status: 400 }
      );
    }

    // Handle lover data if present
    let loverData = null;
    if (user.lover) {
      loverData = await User.findById(user.lover).select("_id");
      if (!loverData) {
        return NextResponse.json({ error: "Lover not found" }, { status: 404 });
      }
    }

    // Retrieve the message room by roomId
    const messageRoom = await MessageRoom.findById(roomId);
    if (!messageRoom) {
      return NextResponse.json(
        { message: "Chat room does not exist" },
        { status: 404 }
      );
    }

    // Create a new message
    const newMessage = new Message({
      sender: user._id,
      messageText: message,
    });
    await newMessage.save();

    // Add the new message to the room's message list
    messageRoom.messages.push(newMessage._id);
    await messageRoom.save();

    // Trigger the new message event via Pusher
    await pusherServer.trigger(roomId, "new-message", {
      messageText: message,
      sender: {
        username: user.username,
        _id: user._id,
      },
    });

    return NextResponse.json(
      { message: "Message sent successfully", messageId: newMessage._id },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}
