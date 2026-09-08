import fs from "fs";
import {getModel} from "../utils/llmModels.js";
import {PDFParse} from "pdf-parse";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { vectorStore } from "../config/vectorDB.js";
import { HumanMessage } from "@langchain/core/messages";
import { SystemMessage } from "@langchain/core/messages";
import { deductCredits } from "../utils/deductCredits.js";
import { checkAgentLimit } from "../config/agentLimit.js";

export const pdfRag=async (state)=>
{
    try
    {   
        await checkAgentLimit(state.userId,"pdfRag");
        // bring the pdf file from temp storage
        const buffer=fs.readFileSync(state.file.path);
        //convert node js bufeer to pdf
        const pdf=new PDFParse({
            data:buffer,
        });

        const result=await pdf.getText();

        const text= result.text;

        //now break the text into chunks and send to llm for processing
        const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 500 })
        // const texts = splitter.splitText(document)
        const docs=await splitter.createDocuments([text]);
        const collectionName=`pdf-${Date.now()}`;
        const store=await vectorStore(docs,collectionName);
        const relevantDocs=await store.similaritySearch(state.prompt,5);

        const context=relevantDocs.map(doc=>doc.pageContent).join("\n\n");

        const llm=await getModel("pdfRag");

        const messages=[
            new SystemMessage(`
                You are a Professional LuminaAI PDF Assistant.

                Rules:
                - Answer Only from the uploaded PDF DOcument.
                - Never Make up information or hallucinate.
                - If the answer is not in the document, reply:
                "I am sorry, I could not find the answer in the document. Please provide more information or ask a different question."
                - Use Markdown when helpful.
                - If the user asks for a summary, provide a concise summary of the document.
                - If the user asks for a table of contents, provide a structured table of contents based on the document's headings and sections.
                - If the user asks for specific information, extract and present it accurately from the document.
                - If the user asks for an analysis or interpretation, provide insights based on the content of the document.
                - If the user asks for a comparison with another document, request them to upload the other document and then perform the comparison.
                `),

            new HumanMessage(`
                Context:${context}
                Question:${state.prompt}
                `

            )   
        ]

        const response=await llm.invoke(messages);

         await deductCredits(state.userId,"pdfRag");

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
            aiResponse:"Failed to analyze the PDF document. Please ensure the file is a valid PDF and try again."
        }
    }
    finally{
        fs.unlinkSync(state.file.path);
    }
}