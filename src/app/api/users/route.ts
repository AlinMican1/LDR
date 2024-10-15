import connectToDB from "../../../../lib/database";
import User from "../../../../models/user";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { username, age } = await request.json();
  await connectToDB();
  await User.create({ name, age });
  return NextResponse.json({ message: "User Created" }, { status: 201 });
}
