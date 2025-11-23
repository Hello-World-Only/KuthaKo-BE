// src/upload/avatar.cloud.service.js

import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary using ENV vars
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload avatar to Cloudinary
 * @param {Object} file - multer file object
 * @returns {Promise<string>} Cloudinary URL
 */
export const saveCloudAvatar = async (file) => {
    if (!file) throw new Error("No file provided");

    try {
        // Upload the file buffer (multer stores file on disk → we use file.path)
        const result = await cloudinary.uploader.upload(file.path, {
            folder: "avatars",        // Cloudinary folder
            resource_type: "image",
        });

        return result.secure_url; // URL to store in DB
    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        throw new Error("Avatar upload failed");
    }
};
