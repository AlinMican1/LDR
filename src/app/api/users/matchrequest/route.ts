import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user";
import connectToDB from "@/lib/database";
import { stringify } from "querystring";

export async function POST(request: NextRequest) {
  // Establish connection
  await connectToDB();
  const { senderLoverTag, receiverLoverTag } = await request.json();

  try {
    // Find the users by their loverTags
    const sender = await User.findOne({ loverTag: senderLoverTag });
    const receiver = await User.findOne({ loverTag: receiverLoverTag });

    if (!sender || !receiver) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updatedReceiver = await User.findOneAndUpdate(
      { _id: receiver._id },
      { $set: { request: { from: sender._id, status: "pending" } } },
      { new: true }
    );
    console.log(updatedReceiver); // Logs the updated document

    return NextResponse.json(
      { message: "Friend request sent successfully!" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
