import api from "../../utils/axios.js";

export const updateConversation=async (payload)=>
{
    try
    {
        const {data}=await api.post("/api/chat/updateConversation",payload);
        return data;
    }
    catch(error)
    {
        console.log(error);
        return null;
    }
}