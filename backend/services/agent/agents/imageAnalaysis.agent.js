import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { getModel } from "../utils/llmModels.js"
import { deductCredits } from "../utils/deductCredits.js";
import fs from "fs/promises";
import { checkAgentLimit } from "../config/agentLimit.js";
export const imageRag=async (state)=>
{
    try
    {
        await checkAgentLimit(state.userId,"imageRag");
        const llm=await getModel("imageRag");

        const imageBuffer=await fs.readFile(state.file.path);
        const base64Image=imageBuffer.toString("base64");

        const messages=[
            new SystemMessage(
                `You are LuminaAI Image Analyzer Agent.
                  
                Rules:
                - Analyze only the uploaded image.
                - Answer the user's question accurately.
                - If text exists in the image, extract it.
                - If Charts or tables exist, explain them.
                - If something is unclear , say So.
                - Use Markdown when helpful.
                - Do Not Hallucinate.
                `
            ),
            new HumanMessage(
                {
                    content:[
                        {
                        type:"text",
                        text:state.prompt || "analyze the image"
                        },
                        {
                            type:"image_url",
                            image_url:{
                                url:`data:${state.file.mimetype};base64,${base64Image}`,
                            }
                        }
                    ]
                }
            )
        ]

        const response=await llm.invoke(messages);

        await deductCredits(state.userId,"imageRag");

        return {
            ...state,
            aiResponse:response.content
        }
    }
    catch(error)
    {
        console.log(error);

         if(error.status==429)
        {
             return {
            ...state,
            aiResponse:error?.data?.message
        }
        }
         return {
            ...state,
            aiResponse:"failed to analyze the image"
        }
    }
    finally
    {
      await fs.unlink(state.file.path)
    }
    
}