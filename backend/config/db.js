import mongoose from "mongoose";

const connectB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/sugvoyage");
    console.log("Connected to mongodb");
  } catch (error) {
    console.error("Mongo connection failed", error);
    process.exit(1);
  }
};

export default connectB;
