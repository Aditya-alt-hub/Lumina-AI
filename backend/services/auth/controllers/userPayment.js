import {getAuth} from "firebase-admin/auth";
import {app} from "../config/firebase.js";
import User from "../models/user.model.js";
import redis from "../../../shared/redis/redis.js";

export const updateUserPayment=async (req,res)=>
{
    try
    {
        const {plan,credits,userId}=req.body;
        const user=await User.findById(userId)

        if(!user)
        {
            return res.status(404).json({message:"User Not Found"})
        }
        user.plan=plan
        user.credits+=credits
        user.totalCredits+=credits
        user.planExpiresAt=new Date(Date.now()+30*24*60*60*1000)

        await user.save();

        //  const sessionId=req.cookies?.session
        const sessionId=await redis.get(`user-session-${user?._id}`)
            await redis.set(`session-${sessionId}`,JSON.stringify(
            {
                userId:user._id,
                name:user.name,
                email:user.email,
                avatar:user.avatar,
                plan:user.plan,
                credits:user.credits,
                totalCredits:user.totalCredits,
                planExpiresAt:user.planExpiresAt

            }

         ),"EX",7*24*60*60)

         return res.status(200).json({success:true})
    }
    catch(error)
    {
        return res.status(500).json({message:`Updated payment user error ${error}`})
    }
}

export const deductCredits= async (req,res)=>
{
    try
    {
        const {userId,agent}=req.body;

    const COST={

        chat:1,

        search:2,

        coding:2,

        pdf:2,

        ppt:2,

        imagegen:2
    };

    const user=await User.findById(userId);

    if(!user)
    {
        return res.status(400).json({message:"User Not Found"});
    }

    const RequiredCredits=COST[agent] || 1;
    if(user.credits<RequiredCredits)
    {
        return res.status(400).json({message:"Not Enough Credits"})
    }
    user.credits-=RequiredCredits;

    await user.save();

    //session update

    const sessionId=await redis.get(`user-session-${user?._id}`)
            await redis.set(`session-${sessionId}`,JSON.stringify(
            {
                userId:user._id,
                name:user.name,
                email:user.email,
                avatar:user.avatar,
                plan:user.plan,
                credits:user.credits,
                totalCredits:user.totalCredits,
                planExpiresAt:user.planExpiresAt

            }

         ),"EX",7*24*60*60)

         return res.status(200).json({success:true,credits:user.credits})
    }
    catch(error)
    {
        return res.status(500).json({message:`credit deduction error ${error}`})
    }
}