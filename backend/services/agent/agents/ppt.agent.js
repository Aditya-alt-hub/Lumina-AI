import { generatePPT } from "../utils/generatePPT.js";
import { getfromS3 } from "../utils/getFromS3.js";
import { getModel } from "../utils/llmModels.js"
import { s3Upload } from "../utils/s3Upload.js";
import { deductCredits } from "../utils/deductCredits.js";
import { checkAgentLimit } from "../config/agentLimit.js";

export const pptAgent=async (state)=>
{
    try
    {
        await checkAgentLimit(state.userId,"ppt");

        const llm=await getModel("ppt")

        const prompt=`You are a professional presentation designer and PowerPoint content expert. 
                      Create a complete, professional and visually appealing presentation based on the user's request. 
                      USER REQUEST: ${state.prompt} Your task is to: - Understand the user's topic and requirements. 
                      - Decide the appropriate number of slides. 
                      - Create a logical flow from introduction to conclusion. 
                      - Keep slide content concise and presentation-friendly. 
                      - Use professional and meaningful slide titles. 
                      - Avoid long paragraphs. 
                      - Do not repeat information between slides. 
                      - Make every slide have a clear purpose. 

                      Return ONLY valid JSON. 

                      Use EXACTLY this format: 

                      { "title": "Presentation Title", "subtitle": "Presentation Subtitle", "slides": [ { "title": "Slide Title", "points": [ "Point 1", "Point 2", "Point 3", "Point 4" ],"visual": { "type": "image", "description": "Describe the visual that should appear on this slide" } } ] }

                      PRESENTATION STRUCTURE: 
                      1. TITLE SLIDE 
                      - Create an attractive title. 
                      - Add a meaningful subtitle. 
                      - Do not add unnecessary points. 
                      2. INTRODUCTION 
                      - Explain what the topic is. 
                      - Give important background/context. 
                      - Explain why the topic matters. 
                      3. MAIN CONCEPTS 
                      - Explain the important concepts related to the topic. 
                      - Use simple and clear language. 
                      4. DETAILED EXPLANATION 
                      - Explain the core topic in a logical sequence. 
                      - Break complicated concepts into understandable points. 
                      5. PROCESS / WORKFLOW 
                      - If applicable, explain the process using steps. 
                      - If the topic is technical, explain the architecture or workflow. 
                      6. EXAMPLE / CASE STUDY 
                      - Provide a realistic example when appropriate. 
                      - Clearly connect the example with the topic. 
                      7. COMPARISON 
                      - If applicable, compare relevant technologies, methods, concepts or approaches. 
                      - Clearly explain the differences. 
                      8. APPLICATIONS / BENEFITS 
                      - Explain where the topic is used. 
                      - Highlight important advantages and real-world applications. 
                      9. CHALLENGES / LIMITATIONS 
                      - Explain important limitations, problems or challenges. 
                      10. FUTURE SCOPE 
                      - Explain future possibilities, improvements or developments. 
                      11. CONCLUSION 
                      - Summarize the most important points. 
                      - End with a strong conclusion.
                    IMPORTANT RULES: 
                    - Do not blindly use every section above. 
                    - Only include slides that are relevant to the user's topic. 
                    - Choose the number of slides according to the complexity of the topic. 
                    - Simple topics should normally contain 6-8 slides. 
                    - Medium topics should normally contain 8-12 slides. 
                    - Complex technical topics should normally contain 12-18 slides. 
                    - If the user specifies a slide count, follow it exactly. 
                    - Each slide should contain 3-5 concise points whenever possible. 
                    - Do not write large paragraphs. 
                    - Do not put unnecessary explanations inside points. 
                    - Use professional language. 
                    - Use accurate technical terminology. 
                    - Never invent statistics, research results or facts. 
                    - If numerical data is required but unavailable, do not fabricate it. 
                    - Visual descriptions should be specific and useful. 
                    - Prefer diagrams, flowcharts, architecture diagrams and charts for technical topics. 
                    - Prefer relevant images and illustrations for conceptual topics. 
                    - Every visual must support the content of the slide. 
                    - Maintain a consistent presentation style. 
                    - Make the presentation look professionally designed rather than AI-generated. 
                    - Ensure the slides have a logical storytelling flow. 
                    - Ensure valid JSON syntax. 
                    - Do not return Markdown. 
                    - Do not return code fences. 
                    - Do not return any explanation outside the JSON. 
                    - Return ONLY the JSON object. `;

                    const res=await llm.invoke(prompt);
                    const data=JSON.parse(res.content);

                    await deductCredits(state.userId,"ppt");

                    const ppt=await generatePPT(data);

                    const buffer=await ppt.write({
                        outputType:"nodebuffer"
                    })

                    const filename=`ppt-${Date.now()}.pptx`

                    await s3Upload(filename,buffer,"application/vnd.openxmlformats-officedocument.presentationml.presentation")

                    const downloadUrl=await getfromS3(filename, 30 * 1000)

                    return {
                        ...state,
                        aiResponse: `Presentation Generated

**${data.title}**

[Download PPT](${downloadUrl})

Link Expires in 10 Minutes.`
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
            aiResponse:"Failed to Generate PPT..."
        }
    }
}