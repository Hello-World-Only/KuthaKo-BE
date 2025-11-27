// src/modules/connections/connections.routes.js

import { Router } from "express";
import auth from "../../middleware/auth.middleware.js";
import {
    getConnections,
    removeConnection
} from "./connections.controller.js";

const router = Router();

router.get("/", auth, getConnections);
router.delete("/remove", auth, removeConnection);

export default router;
