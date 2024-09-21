import connectToDB from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import User from "@/models/user";
import jwt from "jsonwebtoken";

// export async function POST(request: Request) {
//   const { email, password } = await request.json();
//   await connectToDB();
//   const user = await User.findOne({ email });
//   if (!user) {
//     return NextResponse.json({ error: "User does not exist" }, { status: 400 });
//   }
//   const validPassword = await bcryptjs.compare(password, user.password);
//   if (validPassword) {
//     return NextResponse.json({ message: "Logged in" }, { status: 200 });
//   }
//   return NextResponse.json({ message: "error" }, { status: 500 });
// }

export async function POST(request: NextRequest) {
  await connectToDB();
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;

    //check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: "User does not exist" },
        { status: 400 }
      );
    }

    //check if password is correct
    const validPassword = await bcryptjs.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json({ error: "Invalid password" }, { status: 400 });
    }
    //create token data
    // A JavaScript object (tokenData) is created to store essential user
    // information. In this case, it includes the user's unique identifier (id),
    // username, and email.

    const tokenData = {
      id: user._id,
      username: user.username,
      email: user.email,
    };

    // Create a token with expiration of 1 day
    const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
      expiresIn: "1d",
    });

    // Create a JSON response indicating successful login
    const response = NextResponse.json({
      message: "Login successful",
      success: true,
    });

    // Set the token as an HTTP-only cookie
    response.cookies.set("token", token, {
      httpOnly: true,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
