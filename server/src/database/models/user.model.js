// server/src/database/models/user.model.js

import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  // Name is NOT required at OTP signup
  name: { type: String, trim: true, default: null },

  email: {
    type: String,
    unique: true,
    sparse: true,      // allows multiple null values
    lowercase: true,
    trim: true,
    default: null
  },

  phone: {
    type: String,
    unique: true,
    sparse: true,      // allows multiple null values
    trim: true,
    default: null
  },

  password: { type: String, default: null },

  avatar: { type: String, default: null },

  status: { type: String, default: "Hey there! I am using ChatApp." },

  contacts: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

  lastSeen: { type: Date, default: Date.now },

  isOnline: { type: Boolean, default: false },

  createdAt: { type: Date, default: Date.now },
});

// Hash password if present
userSchema.pre("save", async function (next) {
  if (this.password && this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

const User = mongoose.model("User", userSchema);

export default User;
