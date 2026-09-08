import api from "../../utils/axios.js";

export const verifyPayment=async (payload)=>
{
    try
    {
        const {data}=await api.post("/api/payment/verify",payload);
        console.log(data);
        return data;
    }
    catch(error)
    {
        console.log(error);
        return [];
    }
}