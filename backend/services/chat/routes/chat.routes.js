import express from "express";
import { createConversation, getConversation, getMessage, saveMessage, updateConversation } from "../controllers/chat.controller.js";


const router=express.Router();

router.get("/createConversation",createConversation);
router.get("/getConversation",getConversation);
router.post("/updateConversation",updateConversation);
router.post("/save-message",saveMessage);
router.get("/get-messages/:conversationId",getMessage);

export default router;