import connectToDB from "@/lib/database";
import MessageRoom from "@/models/messageRoom";
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

    const messageRoomData = await MessageRoom.findById(roomId).populate({
      path: "messages",
      populate: {
        path: "sender",
        select: "username avatarURL _id", // Populate sender's info
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
  } catch (err: any) {
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}
