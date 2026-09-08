import redis from "../../shared/redis/redis.js"
const protect=async (req,res,next)=>
{
    try
    {
        const sessionId=req.cookies?.session;

        console.log("SESSION ID :",sessionId);

        if(!sessionId)
        {
            return res.status(400).json(
                {
                    message:"unauthorised"
                }
            )
        }

        //redis se current user ke data ko liya(get) h 
        const session=await redis.get(`session-${sessionId}`)

        console.log("REDIS SESSION :", session);

        if(!session)
        {
            return res.status(400).json({
                message:"session expired"
            })
        }

        req.user=JSON.parse(session);
        next();
    }
    catch(error)
    {
        return res.status(500).json({
                message:`auth middleware error ${error}`
            })
    }
}


export default protect;