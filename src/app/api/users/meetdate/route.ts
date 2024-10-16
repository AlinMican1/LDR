import connectToDB from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user";
import { DataRedundancy } from "@aws-sdk/client-s3";
export async function POST(request: NextRequest) {
  const { date, email } = await request.json();
  await connectToDB();
  console.log(email);
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    if (!user.lover) {
      return NextResponse.json(
        { message: "You don't have a lover who are you trying to meet" },
        { status: 404 }
      );
    }
    const lover = await User.findById(user.lover);
    user.meetDate = date;
    lover.meetDate = date;
    await user.save();
    await lover.save();
    return NextResponse.json(
      { message: "successfully added date to meet!" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
