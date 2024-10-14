import connectToDB from "@/lib/database";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";

export async function POST(request: NextRequest) {
  // Establish connection
  await connectToDB();
  try {
    const reqBody = await request.json();
    const { username, email, password } = reqBody;

    const user = await User.findOne({
      $or: [{ email }],
    });

    // Check if a user with the email or username already exists
    if (user) {
      const errors: { email?: string } = {};
      if (user.email === email) {
        errors.email = "Email already exists";
      }

      return NextResponse.json({ errors }, { status: 400 });
    }

    // Hashing password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    //Add lover Tag
    let loverTag = username + "#";
    let uniqueTag = false;
    while (uniqueTag === false) {
      const randomNumber =
        Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
      let currentLoverTag = loverTag + randomNumber;
      console.log(currentLoverTag, "inside Loop");
      try {
        const loverTagExist = await User.findOne({ loverTag: currentLoverTag });
        if (!loverTagExist) {
          uniqueTag = true;
          loverTag = currentLoverTag;
        } else {
          currentLoverTag = loverTag;
        }
      } catch (error: any) {}
    }

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      loverTag,
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
