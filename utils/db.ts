import mongoose from "mongoose";

const connectToDB = async () => {
  try {
    const connection = await mongoose.connect(
      process.env.MONGODB_CONNECTION_STRING!,
      {
        dbName: "webshop",
      }
    );
    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
  }
};

export default connectToDB;
