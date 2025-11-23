// src/upload/multer.config.js

import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure uploads folder exists
const uploadDir = "src/uploads";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Allowed extensions
const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname).toLowerCase();
        const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, `avatar-${unique}${ext}`);
    },
});

// File filter
const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();

    if (!allowedExtensions.includes(ext)) {
        return cb(new Error("Only image files allowed"), false);
    }
    cb(null, true);
};

export const uploadAvatar = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
}).single("avatar");
