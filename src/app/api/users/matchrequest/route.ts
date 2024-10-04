import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user";
import connectToDB from "@/lib/database";
import { stringify } from "querystring";

export async function POST(request: NextRequest) {
  // Establish connection
  await connectToDB();
  const { senderLoverTag, receiverLoverTag } = await request.json();
  console.log(senderLoverTag, receiverLoverTag);
  try {
    // Find the users by their loverTags
    const sender = await User.findOne({ loverTag: senderLoverTag });
    const receiver = await User.findOne({ loverTag: receiverLoverTag });

    if (!sender || !receiver) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    //Check to see if the sender or receiver already have a request.
    if (
      (receiver.request && receiver.request.from) ||
      (sender.request && sender.request.to)
    ) {
      return NextResponse.json(
        { error: "There is already has an active request" },
        { status: 403 } // Forbidden
      );
    }

    const updatedReceiver = await User.findOneAndUpdate(
      { loverTag: receiverLoverTag },
      { $set: { request: { from: sender._id, status: "pending" } } },
      { new: true }
    );
    const updatedSender = await User.findOneAndUpdate(
      { loverTag: senderLoverTag },
      { $set: { request: { to: receiver._id, status: "pending" } } },
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
export async function GET(request: NextRequest) {
  await connectToDB();
  const { loverTag } = await request.json();
  console.log("hi", loverTag);
  const requestExists = await User.findOne({ loverTag });
  try {
    if (requestExists.request && requestExists.request.to) {
      return NextResponse.json({ message: "To given" }, { status: 200 });
    } else {
      return NextResponse.json({ message: "From given" }, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json({ message: "From given" }, { status: 500 });
  }
}
