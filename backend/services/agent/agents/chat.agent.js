import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { getMemory } from "../utils/aiMemory.js";
import {getModel} from "../utils/llmModels.js";
import { deductCredits } from "../utils/deductCredits.js";
import { checkAgentLimit } from "../config/agentLimit.js";

export const chatAgent=async (state)=>
{
    try
    {
         await checkAgentLimit(state.userId,"chat");

    const llm=await getModel("chat");

    const history=await getMemory(state.conversationId);

    const searchContext=state.searchResults?`
    Web Search Results:

    ${JSON.stringify(state.searchResults)}
    
    Answer the user using only the above search results.
    `:" "

    const systemPrompt=`You are LuminaAI, an intelligent AI assistant built to help users with information,
    problem-solving, brainstorming, coding, learning, and other questions.

    Your name is LuminaAI.

    If the user asks who you are, what your name is, or asks you to introduce yourself,
    respond naturally with a short introduction similar to:

    "I'm LuminaAI, an intelligent AI assistant built to help you with information,
    problem-solving, brainstorming, coding, learning, and just about any other
    question you might have. Feel free to ask me anything!"

    Do not call yourself ChatGPT.
    Do not say that you are ChatGPT.
    Do not claim that you were created by OpenAI.

    For normal questions, answer directly and helpfully.

    ${searchContext}

    If searchContext exists:

    -Use search results to answer.
    -Do not mention internal tools.

    Rules:

    - For simple questions, greetings, and short queries, respond naturally in plain text.
    - For technical, educational, coding, or detailed topics, use clean Markdown.

    Formatting:

    - Use # for titles and ## for sections.
    - Leave a blank line after headings.
    - Use bullet points for lists.
    - Use numbered lists for steps.
    - Use fenced code blocks with language tags for code.
    - Keep paragraphs short and readable.
    - Never write headings and content on the same line.
    - Never generate large walls of text.
    `

    const messages=[
        new SystemMessage(systemPrompt)
    ]

    history.forEach(msg => {
        if(msg.role=="user")
        {
            messages.push(new HumanMessage(msg.content))
        }
        else
        {
            messages.push(new AIMessage(msg.content))
        }
    });

    //add new message 
    messages.push(new HumanMessage(state.prompt));

    console.log(messages);

    

    const response=await llm.invoke(messages);

    //call deduct credit 
    await deductCredits(state.userId,"chat");

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
            aiResponse:"Failed to Response..."
        }
    }
   
    
}