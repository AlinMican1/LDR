import connectToDB from "@/lib/database";
import Message from "@/models/message";
import MessageRoom from "@/models/messageRoom";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

// export async function GET(
//   request: NextRequest,
//   { params }: { params: { roomId: string } }
// ) {
//   const { roomId } = params;
//   if (!roomId) {
//     return NextResponse.json(
//       { message: "Email does not exist" },
//       { status: 404 }
//     );
//   }

//   try {
//     await connectToDB();

//     const messageRoomData = await MessageRoom.findById(roomId).populate({
//       path: "messages",
//       populate: {
//         path: "sender",
//         select: "username avatarURL", // Populate sender's info
//       },
//     });
//     if (!messageRoomData) {
//       return NextResponse.json({ message: "Room not found" }, { status: 404 });
//     }

//     return NextResponse.json(
//       {
//         messages: messageRoomData.messages,
//       },
//       { status: 200 }
//     );
//   } catch (error: any) {
//     return NextResponse.json({ message: "Internal Error" }, { status: 500 });
//   }
// }
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
        select: "username avatarURL", // Populate sender's info
      },
    });

    if (!messageRoomData) {
      return NextResponse.json(
        { message: "Room Does not exist" },
        { status: 404 }
      );
    }

    // console.log(messageRoomData.messages);
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
