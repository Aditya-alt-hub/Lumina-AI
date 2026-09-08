import protect from "../middleware/auth.middleware.js"

export const getCurrentUser=async (req,res)=>
{
    try
    {
        return res.status(200).json(req.user);
    }
    catch(error)
    {
        return res.status(500).json(`getCurrentUser error ${error}`);
    }
}

export default getCurrentUser;