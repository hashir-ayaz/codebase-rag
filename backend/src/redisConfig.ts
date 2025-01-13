import Redis from "ioredis";
import AppError from "./error/AppError.js";

// Create a new Redis client
const redis = new Redis({
  host: process.env.REDIS_HOST, // Redis host from environment variables
  port: Number(process.env.REDIS_PORT), // Redis port from environment variables
  password: process.env.REDIS_PASSWORD, // Redis password from environment variables
});

// Initialize Redis connection
const initRedis = async () => {
  return new Promise<void>((resolve, reject) => {
    // Handle connection event
    redis.on("connect", () => {
      console.log("Connected to Redis!");
      resolve();
    });

    // Handle error event
    redis.on("error", (err) => {
      console.error("Redis connection error:", err);
      reject(new AppError("Failed to connect to Redis.", 500));
    });
  });
};

export { redis, initRedis };
