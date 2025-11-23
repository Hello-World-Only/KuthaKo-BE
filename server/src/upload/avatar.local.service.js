// src/upload/avatar.local.service.js

/**
 * Local Avatar Upload Service
 * ---------------------------
 * This receives the multer `file` and returns a public URL
 * pointing to: /uploads/<filename>
 */

export const saveLocalAvatar = (file) => {
    if (!file) {
        throw new Error("No file provided");
    }

    // Return the PUBLIC URL
    // Example: /uploads/avatar-123456789.png
    const publicUrl = `/uploads/${file.filename}`;

    return publicUrl;
};
