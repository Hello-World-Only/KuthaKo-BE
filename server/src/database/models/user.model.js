// server/src/database/models/user.model.js

import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },

  password: { type: String },

  avatar: { type: String, default: null },

  status: { type: String, default: "Hey there! I am using ChatApp." },

  contacts: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

  lastSeen: { type: Date, default: Date.now },

  isOnline: { type: Boolean, default: false },

  createdAt: { type: Date, default: Date.now },
});

// Pre-save hook to hash password if present
userSchema.pre("save", async function (next) {
  if (this.password && this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
