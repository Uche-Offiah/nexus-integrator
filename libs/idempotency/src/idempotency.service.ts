import { Redis } from "ioredis";

const redis = new Redis();

export const isProcessed = async (eventId: string) => {
    const exists = await redis.get(eventId);
    return !!exists // returns the boolean value of the result
};

export const markProcessed =async (eventId: string) => {
    await redis.set(eventId, "processed", "EX", 3600)
}