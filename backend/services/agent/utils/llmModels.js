
import { ChatGroq } from "@langchain/groq";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOpenRouter } from "@langchain/openrouter";
import dotenv from "dotenv";

dotenv.config();

const groq = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "openai/gpt-oss-120b",
    temperature: 0,
    maxTokens: undefined,
    maxRetries: 2,
   
})

const gemini = new ChatGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_API_KEY,
    model: "gemini-3.6-flash",
    temperature: 0,
    maxRetries: 2,
    // other params...
})



const claude = new ChatOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
//   model: "anthropic/claude-sonnet-4.5",
  model: "deepseek/deepseek-chat",
  temperature: 0,
  maxTokens: 2500,
  // other params...
});


export const getModel=async (agent)=>
{
    switch(agent)
    {
        case "chat":
            return groq;
        case "search":
            return groq;
        
        case "coding":
            return claude;
        
        case "intent":
            return groq;
        
        case "image":
            return gemini;
        case "imageRag":
            return gemini;

        default:
            return groq;
    }
}