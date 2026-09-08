import { getModel } from "../utils/llmModels.js";
import axios from "axios";
import {s3Upload} from "../utils/s3Upload.js";
import { getfromS3 } from "../utils/getFromS3.js";
import { deductCredits } from "../utils/deductCredits.js";
import { checkAgentLimit } from "../config/agentLimit.js";

export const imageGenAgent=async (state)=>
{
    try
    {

     await checkAgentLimit(state.userId,"imagegen");

     const llm=await getModel("image")
     const res=await llm.invoke(`
        You are an elite AI image prompt engineer.

        Convert the user request into a highly detailed image generation prompt.

        Requirements:

        - Cinematic lighting
        - Professional composition
        - Ultra realistic
        - High detail
        - Beautiful color palette
        - Sharp focus
        - 8K quality
        - Photorealistic
        - Depth of field
        - Professional photography
        - Stunning visuals

        Return only the image generation prompt.

        User Request:
        ${state.prompt}
    `)

    const prompt=res.content.trim()
    const imageUrl=`https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`

    const imageRes=await axios.get(imageUrl,{responseType:"arraybuffer"})

    console.log(imageRes);

    await deductCredits(state.userId,"imagegen");

    const buffer=Buffer.from(imageRes.data)

    const filename=`image-${Date.now()}.jpg`

    await s3Upload(filename,buffer,"image/jpeg")

    const downloadUrl=await getfromS3(filename,30 * 1000)

    //   console.log("Generated Prompt:", prompt);
    //     console.log("Generated Image URL:", imageUrl);

        

        // return {
        //     ...state,
        //     aiResponse:`
        //     # Image Generated Successfully

        //     ![Generated Image](${downloadUrl})

        //      [Download Image](${downloadUrl})

        //      Link expires in 10 minutes/
        //     `,

        //     images: [downloadUrl]
            
            
        // };

        return {
    ...state,

    aiResponse: `# Image Generated Successfully

![Generated Image](${downloadUrl})

[Download Image](${downloadUrl})

Link expires in 10 minutes.`,
};

//         return {
//     ...state,

//     aiResponse: `# Image Generated Successfully

// Your image has been generated successfully.`,

//     images: [downloadUrl]
// };
    }
    catch(error)
    {

         if(error.status==429)
        {
             return {
            ...state,
            aiResponse:error?.data?.message
        }
        }
        
        return {
            ...state,
            aiResponse:`Failed to generate Image ${error}`
            // images:[]
            
        };
    }
  
}