// src/routes/profile.routes.js
import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { getPrivateProfile, updateMyProfile, deleteMyProfile } from "../controllers/profile.controller.js";

const router = Router();

router.get("/private", authMiddleware, getPrivateProfile); // opcional
router.patch("/private", authMiddleware, updateMyProfile);
router.delete("/private", authMiddleware, deleteMyProfile);

export default router;
