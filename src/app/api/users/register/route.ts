import connectToDB from "@/lib/database";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";

// Establish connection
connectToDB();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { username, email, password } = reqBody;

    const user = await User.findOne({
      $or: [{ email }, { username }],
    });

    // Check if a user with the email or username already exists
    if (user) {
      const errors: { username?: string; email?: string } = {};

      if (user.email === email && user.username === username) {
        errors.username = "Username and Email already exist";
        errors.email = "Username and Email already exist"; // This line is optional
      } else if (user.email === email) {
        errors.email = "Email already exists";
      } else if (user.username === username) {
        errors.username = "Username already exists";
      }

      return NextResponse.json({ errors }, { status: 400 });
    }

    // Hashing password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Saves the new user to the database.
    const savedUser = await newUser.save();

    return NextResponse.json({
      message: "User created successfully",
      success: true,
      savedUser,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
