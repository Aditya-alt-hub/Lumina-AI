import {StateGraph} from "@langchain/langgraph";
import {agentState} from "./state.js";
import {routerAgent} from "./router.js";
import {chatAgent} from "../agents/chat.agent.js";
import {searchAgent} from "../agents/search.agent.js";
import {codingAgent} from "../agents/coding.agent.js";
import {pdfAgent} from "../agents/pdf.agent.js";
import {pptAgent} from "../agents/ppt.agent.js";
import {imageGenAgent} from "../agents/imageGen.agent.js";
import { pdfRag } from "../agents/pdfRAG.agent.js";
import { imageRag } from "../agents/imageAnalaysis.agent.js";


const workflow=new StateGraph(agentState);

workflow.addNode("router",routerAgent);
workflow.addNode("chat",chatAgent);
workflow.addNode("search",searchAgent);
workflow.addNode("coding",codingAgent);
workflow.addNode("pdf",pdfAgent);
workflow.addNode("ppt",pptAgent);
workflow.addNode("imagegen",imageGenAgent);
workflow.addNode("pdfRag",pdfRag);
workflow.addNode("imageRag",imageRag);

//connected all nodes by edges for complete workflow
//workflow.addEdge("from","to");

workflow.addEdge("__start__","router");
workflow.addConditionalEdges("router",(state)=>
{
    switch(state.agent)
    {
        case "chat":
            return "chat";
        case "search":
            return "search";
        case "coding":
            return "coding";
        case "pdf":
            return "pdf";
        case "ppt":
            return "ppt";
        case "imagegen":
            return "imagegen";
        case "pdfRag":
            return "pdfRag";
        case "imageRag":
            return "imageRag";
        default:
            return "chat";
    }
},{
    chat:"chat",
    search:"search",
    coding:"coding",
    pdf:"pdf",
    ppt:"ppt",
    imagegen:"imagegen",
    pdfRag:"pdfRag",
    imageRag:"imageRag"
})


workflow.addEdge("search","chat");
workflow.addEdge("chat","__end__");
workflow.addEdge("coding","__end__");
workflow.addEdge("pdf","__end__");
workflow.addEdge("ppt","__end__");
workflow.addEdge("imagegen","__end__");
workflow.addEdge("pdfRag","__end__");
workflow.addEdge("imageRag","__end__");

export const graph=workflow.compile();