import redis from "../../../shared/redis/redis.js";
const Limits={
    chat:30,
    coding:10,
    pdf:10,
    ppt:10,
    image:10,
    search:10
}

export const checkAgentLimit=async (userId,agent)=>
{
    const max=Limits[agent] || Limits["chat"]
    const key=`rate:${userId}:${agent}` 

    const requests=await redis.incr(key);

    if(requests==1)
    {
        await redis.expire(key,60)
    }

    //time to leave used to get a leaving time that means kitne time baad key reset hogi
    const ttl=await redis.ttl(key);

    if(requests>max)
    {
        const minutes=Math.floor(ttl/60);
        const seconds=(ttl%60)
        const time=minutes>0?`${minutes}m:${seconds}s`:`${seconds}s`
        
        const error=new Error(`Rate Limit Exceeded for ${agent}.`);
        error.status=429;
        error.data={
            success:false,
            agent,
            limit:max,
            remainingTime:ttl,
            retryAfter:time,
            message:`You have reached the ${agent} limit (${max} requests/minute).Try again in ${time}.`
        }

        throw error

    }

    return {
        remaining:max-requests,
        limit:max
    }
}