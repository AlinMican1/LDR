import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user";
import connectToDB from "@/lib/database";
import MessageRoom from "@/models/messageRoom";

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
    //Check to see if the sender or receiver already have a request.
    if (
      (receiver.request && receiver.request.from) ||
      (sender.request && sender.request.to) ||
      (receiver.request && receiver.request.to) ||
      (sender.request && sender.request.from) ||
      (sender.requestConnection && receiver.requestConnection)
    ) {
      return NextResponse.json(
        { error: "There is already has an active request" },
        { status: 403 } // Forbidden
      );
    }
    if (
      sender.request.status === "accepted" &&
      receiver.request.status === "accepted"
    ) {
      return NextResponse.json(
        { message: " Sorry this person is already taken!" },
        { status: 403 }
      );
    }

    const updatedReceiver = await User.findOneAndUpdate(
      { loverTag: receiverLoverTag },

      {
        $set: {
          request: { from: sender._id, status: "pending" },
        },
      },
      { new: true }
    );
    const updatedSender = await User.findOneAndUpdate(
      { loverTag: senderLoverTag },

      {
        $set: {
          request: { to: receiver._id, status: "pending" },
        },
      },
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

export async function PUT(request: NextRequest) {
  await connectToDB();
  const { senderId } = await request.json();

  try {
    if (!senderId) {
      return NextResponse.json(
        { message: "There is no request by sender yet" },
        { status: 404 }
      );
    }
    const sender = await User.findOne({ _id: senderId });

    if (!sender) {
      return NextResponse.json(
        { message: "sender not found" },
        { status: 404 }
      );
    }

    const receiver = await User.findOne({ _id: sender.request.to });
    if (!receiver) {
      return NextResponse.json(
        { message: "receiver not found" },
        { status: 404 }
      );
    }

    receiver.request.from = null;
    receiver.request.to = null;
    receiver.request.status = "accepted";
    receiver.lover = sender._id;

    sender.request.to = null;
    sender.request.from = null;
    sender.request.status = "accepted";
    sender.lover = receiver._id;

    await sender.save();
    await receiver.save();
    // START OF MESSAGEROOM ADDITION
    let messageRoom = await MessageRoom.findOne({
      users: { $all: [sender._id, receiver._id] }, // Ensure both users are in the room
    });

    if (!messageRoom) {
      // If the room doesn't exist, create it
      messageRoom = new MessageRoom({
        users: [sender._id, receiver._id],
      });
      await messageRoom.save();

      if (!sender.messageRooms) {
        sender.messageRooms = []; // Initialize as an empty array if undefined
      }

      if (!receiver.messageRooms) {
        receiver.messageRooms = []; // Initialize as an empty array if undefined
      }

      sender.messageRooms.push(messageRoom._id);
      receiver.messageRooms.push(messageRoom._id);
      await sender.save();
      await receiver.save();
    }
    return NextResponse.json(
      { message: "Lover request accepted successfully" },
      { status: 200 }
    );

    // END OF MESSAGEROOM ADDITION
  } catch (error: any) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
