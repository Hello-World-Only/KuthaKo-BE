// server/src/modules/auth/auth.routes.js

import { Router } from "express";
import { AuthController } from "./auth.controller.js";

const router = Router();

router.post("/request-otp", AuthController.requestOTP);
router.post("/verify-otp", AuthController.verifyOTP);

export default router;
