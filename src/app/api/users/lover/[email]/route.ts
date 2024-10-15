import connectToDB from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user";

export async function GET(
  request: NextRequest,
  { params }: { params: { email: string } }
) {
  const { email } = params;
  await connectToDB();

  // Find the user by email
  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  // Get the lover ID from the user
  const loverId = user.lover;
  if (!loverId) {
    return NextResponse.json(
      { message: "Lover does not exist yet!" },
      { status: 200 }
    );
  }

  // Find the lover by ID
  const lover = await User.findById(loverId);
  if (!lover) {
    return NextResponse.json({ message: "Lover not found" }, { status: 404 });
  }

  // Return the lover's avatar URL
  return NextResponse.json({ lover: lover }, { status: 200 });
}
