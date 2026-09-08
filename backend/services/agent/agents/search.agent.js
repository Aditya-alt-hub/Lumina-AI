import { checkAgentLimit } from "../config/agentLimit.js";
import { searchTool } from "../config/tavily.js"
import { deductCredits } from "../utils/deductCredits.js";

export const searchAgent=async (state)=>
{
    try
    {
        await checkAgentLimit(state.userId,"search");

        const results=await searchTool.invoke({
            query:state.prompt
        })
        console.log(results);

        await deductCredits(state.userId,"search");

        const searchResults = results.results.map((item) => ({
            title: item.title,
            url: item.url,
            content: item.content
        }));

        return {
            ...state,
            // searchResults:results.results,
            searchResults,
            images:results.images
        }
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
            searchResults:[],
            images:[]
        }
    }
}