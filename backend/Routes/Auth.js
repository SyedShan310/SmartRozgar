import express from "express";
import signup from "../Controllers/auth/Signup.js";
import login from "../Controllers/auth/Login.js";
import changePassword from "../Controllers/auth/Password.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.patch("/password", authenticate, changePassword);
export default router;