import Message from "@/models/message";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { email, message } = await request.json();
  if (!email || !message) {
    return NextResponse.json(
      { message: "no email or message given" },
      { status: 400 }
    );
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "User does not exist" },
        { status: 400 }
      );
    }
    const lover = await User.findById(user.lover);
    if (!lover) {
      return NextResponse.json(
        { message: "lover does not exist" },
        { status: 400 }
      );
    }

    const newMessage = new Message({
      sender: user._id,
      recipient: lover._id,
      messageText: message,
    });

    const sentMessage = await newMessage.save();

    const Pusher = require("pusher");
    const pusher = new Pusher({
      appId: process.env.PUSHER_APP_ID,
      key: process.env.NEXT_PUBLIC_PUSHER_KEY,
      secret: process.env.PUSHER_SECRET,
      cluster: "eu",
      useTLS: true,
    });
    console.log(sentMessage);
    pusher.trigger("chat", "send-chat", {
      messageSent: `${JSON.stringify(sentMessage.messageText)}\n\n`,
    });

    return NextResponse.json({
      message: "Message created successfully",
      success: true,
      sentMessage,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
