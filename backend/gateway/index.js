import express from "express";
import dotenv from "dotenv";
import proxy from "express-http-proxy";
import cors from "cors";
import cookieParser from "cookie-parser";
import protect from "./middleware/auth.middleware.js";
import { getCurrentUser } from "./controllers/user.controller.js";
import { proxywithHeader } from "./utils/proxywithHeader.js";
import morgan from "morgan";

dotenv.config();

const port=process.env.PORT || 8000;

const app=express();

app.use(express.json());

app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true
}));

app.use(morgan("dev"));

app.use(cookieParser());

app.use("/api/auth",proxy(process.env.AUTH_SERVICE))

app.use("/api/chat",protect,proxywithHeader(process.env.CHAT_SERVICE))

app.use("/api/agent",protect,proxywithHeader(process.env.AGENT_SERVICE))

app.use("/api/payment",protect,proxywithHeader(process.env.PAYMENT_SERVICE))

app.get("/api/me",protect,getCurrentUser)

app.get("/",(req,res)=>
{
    return res.status(200).json({message:"Hello from gateway"});
})

app.listen(port,"0.0.0.0",()=>
{
    console.log(`gateway started ${port}`);
});