import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/lib/database";
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

    // Fetch the user data from the 'users' collection based on the email
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return the user data, including the avatarURL
    return NextResponse.json(
      {
        email: user.email,
        name: user.username, // Adjust this based on your schema
        avatarURL: user.avatarURL, // Return avatarURL
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
