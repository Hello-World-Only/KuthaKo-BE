// src/modules/connections/connections.routes.js


import express from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { getConnections } from "./connections.controller.js";
import { removeConnection } from "./connections.controller.js";

const router = express.Router();

router.get("/", authMiddleware, getConnections);
router.delete("/remove", authMiddleware, removeConnection);

export default router;
