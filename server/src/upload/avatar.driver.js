// src/upload/avatar.driver.js

import { saveLocalAvatar } from "./avatar.local.service.js";
import { saveCloudAvatar } from "./avatar.cloud.service.js";

/**
 * Auto selects avatar upload driver based on ENV
 * AVATAR_DRIVER=local  or  cloudinary
 */

export const uploadAvatarDriver = async (file) => {
    const driver = process.env.AVATAR_DRIVER || "local";

    if (!file) {
        throw new Error("No file provided");
    }

    if (driver === "cloudinary") {
        return await saveCloudAvatar(file);
    }

    // Default: local upload
    return saveLocalAvatar(file);
};
