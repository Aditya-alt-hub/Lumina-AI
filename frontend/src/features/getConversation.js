import api from "../../utils/axios.js";

export const getConversation=async ()=>
{
    try
    {
        const {data}=await api.get("/api/chat/getConversation");
        return data;
    }
    catch(error)
    {
        console.log(error);
        return [];
    }
}