// server/src/modules/user/user.routes.js

import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getMe,
  updateMe,
} from "./user.controller.js";
import { uploadAvatar } from "../../upload/multer.config.js";
import { updateAvatar } from "./user.controller.js";

const router = Router();

// ---------------------------------------
// Public CRUD routes
// ---------------------------------------
router.post("/create-user", createUser);
router.get("/get-all-user", getAllUsers);
router.get("/get-user/:id", getUserById);
router.put("/update-user/:id", updateUser);
router.delete("/delete-user/:id", deleteUser);

// ---------------------------------------
// logged-in user routes
// ---------------------------------------
router.get("/me", authMiddleware, getMe);
router.put("/me", authMiddleware, updateMe);

// ---------------------------------------
// Cloudinary Uploads: routes
// ---------------------------------------
router.put("/me/avatar", authMiddleware, uploadAvatar, updateAvatar);


export default router;
