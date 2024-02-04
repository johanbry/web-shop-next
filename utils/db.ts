import mongoose from "mongoose";

const connectToDB = async () => {
  try {
    const connection = await mongoose.connect(
      process.env.MONGODB_CONNECTION_STRING!,
      {
        dbName: "webshop",
      }
    );
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
  }
};

export default connectToDB;
