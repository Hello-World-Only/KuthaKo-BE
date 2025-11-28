// server/src/config/db.js

import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // PREVENT MONGOOSE FROM RECREATING INDEXES AUTOMATICALLY
    mongoose.set("autoIndex", false);

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: "kuthako", // optional but recommended
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
