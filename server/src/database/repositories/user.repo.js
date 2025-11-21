// server/src/database/repositories/user.repo.js

import User from "../models/user.model.js";

export const userRepository = {

    // --------------------------
    // FIND OPERATIONS
    // --------------------------

    findById: async (id) => {
        return await User.findById(id);
    },

    findByEmail: async (email) => {
        return await User.findOne({ email });
    },

    findByPhone: async (phone) => {
        return await User.findOne({ phone });
    },

    // Unified finder (email or phone)
    findByIdentifier: async (method, identifier) => {
        if (method === "email") {
            return await User.findOne({ email: identifier });
        }
        return await User.findOne({ phone: identifier });
    },

    // --------------------------
    // CREATE
    // --------------------------
    createUser: async (data) => {
        return await User.create(data);
    },

    // --------------------------
    // FIND OR CREATE
    // --------------------------
    findOrCreateUser: async (method, identifier) => {

        // 1. Try to find
        let user = await userRepository.findByIdentifier(method, identifier);

        // 2. Create if missing
        if (!user) {
            user = await userRepository.createUser({
                email: method === "email" ? identifier : null,
                phone: method === "phone" ? identifier : null,
            });
        }

        return user;
    }
};
