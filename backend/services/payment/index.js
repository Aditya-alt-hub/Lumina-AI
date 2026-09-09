import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import router from "../payment/routes/payment.router.js";

dotenv.config();

const port=process.env.PORT

const app=express();

app.use(express.json());

app.use("/",router);

app.get("/",(req,res)=>
{
    return res.status(200).json({message:"Hello from Payment Service"});
})

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok"
    });
});

app.listen(port,()=>
{
    console.log(`Billing Started ${port}`);
    connectDb();
})

