import mongoose from "mongoose";
import logger from "../utils/logger";

const connectDB = async () => {
  // No try/catch needed here, the promise will be handled by the caller
  const conn = await mongoose.connect(process.env.MONGO_URI!);
  logger.info(`🔌 MongoDB Connected: ${conn.connection.host}`);
};

export default connectDB;
