import { generatePdf } from "../utils/generatePdf.js";
import { getfromS3 } from "../utils/getFromS3.js";
import { getModel } from "../utils/llmModels.js"
import { s3Upload } from "../utils/s3Upload.js";
import { deductCredits } from "../utils/deductCredits.js";
import { checkAgentLimit } from "../config/agentLimit.js";

export const pdfAgent=async (state)=>
{
    try
    {
        await checkAgentLimit(state.userId,"pdf");

        const llm=await getModel("pdf")

        const prompt=`You are a professional PDF document generation agent.

Transform the user's request into a complete, structured, professional document.

Requirements:
- Return only in valid JSON
- Understand the user's intent before generating content.
- Use clear H1, H2 and H3 headings.
- Use concise paragraphs, bullet lists, numbered lists and tables where appropriate.
- Include a title and logical document structure.
- Adapt the structure to the document type: report, resume, invoice, study material, research paper, proposal, guide, etc.
- Never fabricate facts, statistics, citations, references or URLs.
- Preserve important information supplied by the user.
- Avoid unnecessary repetition and overly long paragraphs.
- Make the content suitable for printing and professional sharing.
- Do not add unnecessary emojis or decorative elements.
- If the user requests charts, diagrams or images, specify appropriate placement and captions.
- If information is missing, make reasonable neutral assumptions or clearly identify the missing information.
- Return only the final document content.

Structure:


{
    "title":"",
    "subtitle":"",
    "sections":[
    {
        "heading":"",
        "points":[]
    }
    ]
}

Topic:
${state.prompt}
`;

        const res=await llm.invoke(prompt)
        const data=JSON.parse(res.content);

        await deductCredits(state.userId,"pdf");

        const pdfBuffer=await generatePdf(data);

        const filename=`pdf-${Date.now()}.pdf`
        await s3Upload(filename,pdfBuffer,"application/pdf")

        const downloadUrl=await getfromS3(filename,30 * 1000)

        return {
            ...state,
            aiResponse:`PDF Generated
            **${data.title}**
            [Download PDF](${downloadUrl})

            Link expires in few minutes
            `
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
            aiResponse:"Failed to generate pdf"
        }
    }
}