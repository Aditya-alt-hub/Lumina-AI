import api from "../../utils/axios.js"

const getCurrentUser=async ()=>
{
    try
    {
        const {data}=await api.get("/api/me");
        // console.log(data);
        return data;
    }
    catch(error)
    {
        console.log(error);
        return null;
    }
}

export default getCurrentUser

// import api from "../../utils/axios.js"

// const getCurrentUser = async () => {
//     try {
//         const { data } = await api.get("/api/me");
//         return data;
//     } catch (error) {
//         // Don't log expected "not logged in" responses as errors
//         if (error.response?.status !== 400 && error.response?.status !== 401) {
//             console.error("Unexpected error fetching user:", error);
//         }
//         return null;
//     }
// }

// export default getCurrentUser