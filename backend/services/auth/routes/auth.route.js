import express from "express";
import { login } from "../controllers/auth.controller.js";
import { logOut } from "../controllers/auth.controller.js";
import { deductCredits, updateUserPayment } from "../controllers/userPayment.js";

const router=express.Router();

router.post("/login",login)

router.get("/logout",logOut)

router.post("/update-plan",updateUserPayment)

router.post("/deduct-credits",deductCredits)

export default router;