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
      (sender.request && sender.request.to) ||
      (receiver.request && receiver.request.to) ||
      (sender.request && sender.request.from)
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

    return NextResponse.json(
      { message: "Friend request sent successfully!" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    // Connect to the database
    await connectToDB();

    // Attempt to parse the request body
    const body = await request.json().catch(() => null);
    console.log(body);
    if (!body || !body.loverTag) {
      return NextResponse.json(
        { message: "Invalid or missing loverTag in request body" },
        { status: 400 }
      );
    }

    const { loverTag } = body;

    // Check if the user with the given loverTag exists in the database
    const requestExists = await User.findOne({ loverTag });

    // Handle different cases
    if (requestExists && requestExists.request && requestExists.request.to) {
      return NextResponse.json({ message: "To given" }, { status: 200 });
    } else {
      return NextResponse.json({ message: "From given" }, { status: 200 });
    }
  } catch (error) {
    console.error("Error occurred:", error);
    return NextResponse.json(
      { message: "Server error occurred" },
      { status: 500 }
    );
  }
}
