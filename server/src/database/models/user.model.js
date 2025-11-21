// server/src/database/models/user.model.js

import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({

  // Not required for OTP login
  name: { type: String, default: null, trim: true },

  email: {
    type: String,
    unique: true,
    sparse: true,        // allows multiple nulls
    lowercase: true,
    trim: true,
    default: null
  },

  phone: {
    type: String,
    unique: true,
    sparse: true,        // allows multiple nulls
    trim: true,
    default: null
  },

  password: { type: String },

  avatar: { type: String, default: null },

  status: { type: String, default: "Hey there! I am using ChatApp." },

  contacts: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

  lastSeen: { type: Date, default: Date.now },

  isOnline: { type: Boolean, default: false },

  createdAt: { type: Date, default: Date.now },
});

// Pre-save hook
userSchema.pre("save", async function (next) {
  if (this.password && this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

const User = mongoose.model("User", userSchema);

export default User;
