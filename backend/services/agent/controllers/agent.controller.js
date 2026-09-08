import axios from "axios";
import {graph} from "../graph/graph.js";
import { addMessageToRedis } from "../utils/aiMemory.js";
import redis from "../../../shared/redis/redis.js";

export const agent=async (req,res,next)=>
{
    try
    {
        const {prompt,conversationId,agent}=req.body;

        const file=req.file;

        console.log("file",file);

        const userId=req.headers["x-user-id"];

        // await redis.del(`messages-${conversationId}`)

        // await addMessageToRedis(conversationId,"user",prompt)

        await axios.post(`${process.env.CHAT_SERVICE}/save-message`,{conversationId,role:"user",content:prompt});

        //call graph
        const result=await graph.invoke(
            {
                prompt,conversationId,agent,userId,file
            }
        )

        const response=result.aiResponse
        await addMessageToRedis(conversationId,"user",prompt)

        await addMessageToRedis(conversationId,"assistant",response)
        await axios.post(`${process.env.CHAT_SERVICE}/save-message`,{conversationId,role:"assistant",content:result?.aiResponse,images:result?.images,artifacts:result.artifacts});

        return res.status(200).json({
            answer:result?.aiResponse,
            images:result?.images,
            artifacts:result?.artifacts
        });

    }
    catch (error) {
    // return res.status(500).json({
    //     message: `agent error: ${error}`
    // });
    next(error);
}
}

