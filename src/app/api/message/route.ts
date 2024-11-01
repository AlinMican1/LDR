import connectToDB from "@/lib/database";
import { pusherServer } from "@/lib/pusher";
import Message from "@/models/message";
import MessageRoom from "@/models/messageRoom";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { email, message, roomId } = await request.json();
  console.log(roomId);
  if (!email || !message || !roomId) {
    return NextResponse.json(
      { message: "no email or message given" },
      { status: 400 }
    );
  }
  try {
    await connectToDB();
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "User does not exist" },
        { status: 400 }
      );
    }
    let loverData = null;
    if (user.lover) {
      const lover = await User.findById(user.lover).select("_id");
      if (!lover) {
        return NextResponse.json({ error: "Lover not found" }, { status: 404 });
      } else {
        loverData = lover;
      }
    }

    let messageRoom = await MessageRoom.findOne({
      users: { $all: [user._id, loverData._id] }, // Ensure both users are in the room
    });

    if (!messageRoom) {
      // If the room doesn't exist, create it
      messageRoom = new MessageRoom({
        users: [user._id, loverData._id],
      });
      await messageRoom.save();

      if (!user.messageRooms) {
        user.messageRooms = []; // Initialize as an empty array if undefined
      }

      if (!loverData.messageRooms) {
        loverData.messageRooms = []; // Initialize as an empty array if undefined
      }

      user.messageRooms.push(messageRoom._id);
      loverData.messageRooms.push(messageRoom._id);
      await user.save();
      await loverData.save();
    }

    const newMessage = new Message({
      sender: user._id,
      messageText: message,
    });

    await newMessage.save();

    messageRoom.messages.push(newMessage._id);
    await messageRoom.save();

    await pusherServer.trigger(roomId, "new-message", {
      messageText: message,
      sender: {
        username: user.username,
      },
    });

    return NextResponse.json(
      { message: "Message sent successfully", messageId: newMessage._id },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
