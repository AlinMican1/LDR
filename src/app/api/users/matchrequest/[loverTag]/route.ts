import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/lib/database";
import User from "@/models/user";
import { send } from "process";

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
    const user = await User.findOne({ loverTag })
      .populate("request.from", "username avatarURL")
      .populate("request.to", "username avatarURL");
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

export async function DELETE(
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
    if (!user.request.to && !user.request.from) {
      return NextResponse.json(
        { error: "No Request available" },
        { status: 404 }
      );
    }
    let lover;
    if (!user.request.from) {
      lover = await User.findById({ _id: user.request.to });
    } else if (!user.request.to) {
      lover = await User.findById({ _id: user.request.from });
    }

    user.request.from = null;
    user.request.to = null;
    user.request.status = "pending";

    lover.request.to = null;
    lover.request.from = null;
    lover.request.status = "pending";

    await user.save();
    await lover.save();

    return NextResponse.json(
      { message: "Request deletion successful!" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
