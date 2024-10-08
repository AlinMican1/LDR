import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/lib/database";
import User from "@/models/user";

export async function GET(
  request: NextRequest,
  { params }: { params: { loverTag: string } }
) {
  const { loverTag } = params;
  if (!loverTag) {
    return NextResponse.json(
      { error: "loverTag is required" },
      { status: 400 }
    );
  }
  try {
    await connectToDB();
    const user = await User.findOne({ loverTag });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(
      {
        loverTag: user.loverTag,
        request: user.request,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
