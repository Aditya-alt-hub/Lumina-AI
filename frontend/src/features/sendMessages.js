import React from 'react'
import api from "../../utils/axios.js"

async function sendMessages(payload) {
  
    try
    {
    const {data}=await api.post("/api/agent/chat",payload);
    return data;
    }
    catch(error)
    {
        console.log(error);
        
    }
}

export default sendMessages

// import api from "../../utils/axios.js";

// async function sendMessages(payload) {
//   try {
//     const { data } = await api.post("/api/agent/chat", payload);

//     console.log("API RESPONSE:", data);

//     return data;
//   } catch (error) {
//     console.error(
//       "SEND MESSAGE ERROR:",
//       error.response?.data || error.message
//     );

//     throw error;
//   }
// }

// export default sendMessages;
