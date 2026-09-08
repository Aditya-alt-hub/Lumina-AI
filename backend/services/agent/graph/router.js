
import {getModel} from "../utils/llmModels.js";


//Router agent 



export const routerAgent=async (state)=>
{
    if(state.agent && state.agent!=="auto")
    {
        return {
        ...state,
        agent:state.agent
        }
    }

    if(state.file){
         if(state.file.mimetype==="application/pdf"){
        return {
            ...state,
            agent:"pdfRag"
        }
    }

    if(state.file.mimetype.startsWith("image/")){
        return {
            ...state,
            agent:"imageRag"
        }
    }
    }
    // if(state.file.mimetype==="application/pdf"){
    //     return {
    //         ...state,
    //         agent:"pdfRag"
    //     }
    // }

    // if(state.file.mimetype.startsWith("image/")){
    //     return {
    //         ...state,
    //         agent:"imageRag"
    //     }
    // }


    const llm=await getModel("router")
    const prompt=`You are an agent router. 
    
    Available agents:
    
    -chat
    -search
    -coding
    -pdf
    -ppt
    -imagegen

    Rules:

    chat:
    General conversation,
    explanations,
    learning,
    questions.

    search:
    Current events,
    latest information,
    news,
    research,
    recent developments,
    internet lookup.

    coding:
    Generate code,
    debug code,
    build projects,
    architecture,
    API design,
    code review,

    pdf:
    Questions about generate PDFs,
    or document context.

    ppt:
    Questions about generate PPTs,
    or presentation context.

    imagegen:
    Generate images,
    create images,
    edit images.

    Return Only one word:

    chat
    search
    coding
    pdf
    ppt
    imagegen

    User Query:
    ${state.prompt}
    `

    const response=await llm.invoke(prompt);

    console.log(response);
    

    return {
        ...state,
        agent:response.content.trim().toLowerCase()
    }
}