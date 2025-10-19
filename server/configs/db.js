import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (process.env.SKIP_DB === "1") {
      console.log("SKIP_DB is set, skipping MongoDB connection (prototype mode)");
      return;
    }
    mongoose.connection.on("connected", () => console.log("Database connected"));
    await mongoose.connect(`${process.env.MONGO_URI}/greenmart`);
  } catch (error) {
    console.error(error.message);
  }
};

export default connectDB;