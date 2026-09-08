import api from "../../utils/axios.js";

export const createOrder=async (plan)=>
{
    try
    {
        const {data}=await api.post("/api/payment/createOrder",{plan});
        console.log(data);
        return data;
    }
    catch(error)
    {
        console.log(error);
        return [];
    }
}