import Redis from "ioredis";

const redis = new Redis();
const PREFIX = "event:";

export const isProcessed = async (eventId: string) => {
    const Key = `${PREFIX}${eventId}`;
    const exists = await redis.get(Key);
    return !!exists // returns the boolean value of the result
};

export const markProcessed =async (eventId: string) => {
    const key = `${PREFIX}${eventId}`;

    //Set for a day using the redis key if it doesn't exist already
    await redis.set(key, "processed", "EX", 86400, "NX")
};