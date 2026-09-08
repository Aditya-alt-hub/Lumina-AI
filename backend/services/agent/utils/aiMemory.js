import redis from "../../../shared/redis/redis.js"
import { getMessages } from "./getMessages.js";
export const getMemory = async (conversationId) => {
    const key = `messages-${conversationId}`
    const cachedMessages = await redis.get(key);
    if (cachedMessages) {
        return JSON.parse(cachedMessages);
    }
    const messages = await getMessages(conversationId);
    await redis.set(key, JSON.stringify(messages), "EX", 24 * 60 * 60);

    return messages;
}

export const addMessageToRedis = async (conversationId,role,content) => {

    const key=`messages-${conversationId}`
    const rawMessages=await redis.get(key);
    const messages=rawMessages?JSON.parse(rawMessages):[];
    messages.push({role,content});
    //when messages reach to limit we will delete previous message
    if(messages.length>20)
    {
        messages.shift()
    }
    //add new messages
    await redis.set(key,JSON.stringify(messages));
}