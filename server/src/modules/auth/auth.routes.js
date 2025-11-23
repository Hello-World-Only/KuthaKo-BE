// server/src/modules/auth/auth.routes.js

import { Router } from "express";
import { AuthController } from "./auth.controller.js";
import { getPhonePrefixes } from "./auth.controller.js";

const router = Router();

router.post("/request-otp", AuthController.requestOTP);
router.post("/verify-otp", AuthController.verifyOTP);

router.get("/phone-prefixes", getPhonePrefixes);


export default router;
