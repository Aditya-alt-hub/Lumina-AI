import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDb from "./config/db.js";
import router from "../agent/routes/agent.route.js";


dotenv.config();

const port=process.env.PORT;

const app=express();

app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true
}));

app.use(express.json());

app.use("/",router);

app.use((err,req,res,next)=>{
    console.log(err);

    if(err.status)
    {
        return res.status(err.status).json(err.data)
    }

    return res.status(500).json({message:`agent error ${error}`})
})


app.get("/",(req,res)=>
{ 
    return res.status(200).json({message:"Hello from agent"});
})

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok"
    });
});

app.listen(port,()=>
{
    console.log(`agent started ${port}`);
    connectDb();
}); 