import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import connectToDB from "@/lib/database";
import { NextResponse, NextRequest } from "next/server";
import User from "@/models/user";

const bucketName = process.env.AWS_BUCKET_NAME;
const bucketRegion = process.env.AWS_BUCKET_REGION;
const accessKeyID = process.env.AWS_S3_ACCESS;
const secretAccessKey = process.env.AWS_S3_SECRET_ACCESS;

const s3 = new S3Client({
  region: bucketRegion,
  credentials: {
    accessKeyId: accessKeyID || "",
    secretAccessKey: secretAccessKey || "",
  },
});

export async function POST(request: NextRequest) {
  await connectToDB();
  const formData = await request.formData();
  const files = formData.getAll("file") as File[]; // Get all files
  const userEmail = formData.get("user_email") as string; // Get user's email

  if (!userEmail) {
    return NextResponse.json(
      { error: "User email is required" },
      { status: 400 }
    );
  }

  const response = await Promise.all(
    files.map(async (file) => {
      const Body = (await file.arrayBuffer()) as Buffer;
      const fileExtension = file.type.replace("image/", "");
      const fileName = `avatars/${userEmail}.JPG`; // Create a unique key

      try {
        // Upload file to S3
        await s3.send(
          new PutObjectCommand({
            Bucket: bucketName,
            Key: fileName, // Store file with unique key
            Body,
            ContentType: file.type, // Set the content type
          })
        );

        // Construct the avatar URL
        const avatarURL = `https://${bucketName}.s3.${bucketRegion}.amazonaws.com/${fileName}`;

        // Find the user by their email and update the avatarURL
        await User.findOneAndUpdate(
          { email: userEmail },
          { avatarURL: avatarURL },
          { new: true } // Return the updated user document
        );

        return { success: true, fileName: file.name, avatarURL: avatarURL };
      } catch (error) {
        console.error("S3 Upload Error or DB Update Error:", error);
        return { success: false, error };
      }
    })
  );

  return NextResponse.json(response);
}

export async function GET() {
  await connectToDB();
  const user = await User.findOne({ email: "test@gmail.com" });
  return NextResponse.json({ message: "User found", user });
}
