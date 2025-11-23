// server/src/modules/user/user.controller.js

import validator from "validator";
import User from "../../database/models/user.model.js";

// ====================================== //
// CREATE USER
// ====================================== //
export const createUser = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      avatar,
      status,
      contacts,
      lastSeen,
      isOnline,
    } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const user = new User({
      name,
      email,
      password: password || undefined,
      avatar: avatar || undefined,
      status: status || undefined,
      contacts: contacts || [],
      lastSeen: lastSeen || undefined,
      isOnline: isOnline || false,
    });

    await user.save();
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

// ====================================== //
// GET ALL USERS
// ====================================== //
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    const total = await User.countDocuments();

    res.status(200).json({
      success: true,
      total: total,
      data: users,
    });
  } catch (err) {
    next(err);
  }
};

// ====================================== //
// GET SINGLE USER
// ====================================== //
export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong: In getUserById",
      error: error.message,
    });
  }
};

// ====================================== //
// UPDATE USER
// ====================================== //
export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // If email is being updated → validate format
    if (updateData.email) {
      if (!validator.isEmail(updateData.email)) {
        return res.status(400).json({ message: "Invalid email address" });
      }

      // Check duplicate email (except own account)
      const existingUser = await User.findOne({ email: updateData.email });

      if (existingUser && existingUser._id.toString() !== id) {
        return res.status(409).json({ message: "Email already in use" });
      }
    }

    // Perform update
    const user = await User.findByIdAndUpdate(id, updateData, {
      new: true, // return updated document
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// ====================================== //
// DELETE USER
// ====================================== //
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      deletedUser: user, // optional: shows what got deleted
    });
  } catch (error) {
    next(error);
  }
};

// ====================================== //
// GET LOGGED-IN USER ( /user/me )
// ====================================== //
export const getMe = (req, res) => {
  return res.status(200).json({
    success: true,
    data: req.user, // authMiddleware already loaded user
  });
};

// ====================================== //
// UPDATE LOGGED-IN USER PROFILE ( /user/me )
// ====================================== //
export const updateMe = async (req, res, next) => {
  try {
    const allowedFields = ["name", "avatar", "status"];
    const updates = {};

    // Only keep allowed fields
    for (const key of allowedFields) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    // If no valid field submitted
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields to update",
      });
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      success: true,
      message: "Profile updated",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
