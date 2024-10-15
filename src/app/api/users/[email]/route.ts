import connectToDB from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user";

export async function GET(
  request: NextRequest,
  { params }: { params: { email: string } }
) {
  const { email } = params;
  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }
  try {
    await connectToDB();

    const user = await User.findOne({ email })
      .populate("request.from", "username avatarURL")
      .populate("request.to", "username avatarURL");
    if (!user) {
      return NextResponse.json({ message: "User not found!" }, { status: 404 });
    }
    let loverData = null;
    if (user.lover) {
      const lover = await User.findById(user.lover);
      if (!lover) {
        return NextResponse.json({ error: "Lover not found" }, { status: 404 });
      } else {
        loverData = lover;
      }
    }

    return NextResponse.json(
      { user: user, lover: loverData || null },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ message: { error } }, { status: 500 });
  }
}
