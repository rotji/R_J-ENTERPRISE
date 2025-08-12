// Import built-in and third-party libraries
import express from "express"; // Core Express framework
import cors from "cors"; // Enables Cross-Origin Resource Sharing
import dotenv from "dotenv"; // Loads environment variables from .env

// Import your custom modules
import connectDB from "./config/db"; // MongoDB connection logic
import logger from "./utils/logger"; // Winston logger instance

// Load environment variables BEFORE using them
dotenv.config();

// Validate that all required environment variables are set
if (!process.env.JWT_SECRET) {
  logger.error("FATAL ERROR: JWT_SECRET is not defined.");
  process.exit(1); // Exit the process with a failure code
}

// Connect to MongoDB
connectDB();

// Create Express app instance
const app = express();

// Middleware for CORS and JSON
app.use(cors());
app.use(express.json());

// Conditionally use Morgan in development for HTTP logging
if (process.env.NODE_ENV === "development") {
  const morgan = require("morgan");
  app.use(morgan("dev"));
  logger.info("✅ Morgan HTTP request logging enabled (dev mode)");
}

// Import routes
import authRoutes from "./routes/authRoutes";
import poolRoutes from "./routes/poolRoutes";

// Sample route
app.get("/", (req, res) => {
  logger.info("📥 GET / route accessed");
  res.send("R_J ENTERPRISE backend running...");
});

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/pools", poolRoutes);

// Error handler middleware
import { errorHandler } from "./middleware/errorMiddleware";
app.use(errorHandler);

// Define port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});
