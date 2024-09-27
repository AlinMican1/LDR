import mongoose from "mongoose";

const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL as string);
    console.log("Connected");
  } catch (error) {
    console.log(error);
  }
};

export default connectToDB;
