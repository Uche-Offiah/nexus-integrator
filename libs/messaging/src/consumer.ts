import { getChannel } from "./rabbitmq.client";

export const consume = async(   
    queue: string,
    routingKey: string,  
    handler: (msg: any) => Promise<void>) => {

    const channel = getChannel();

    await  channel.assertQueue(queue, { durable: true});

    await channel.bindQueue(queue, "integration.events", routingKey);

    channel.consume(queue, async (msg) => {
        if (!msg) return;

        console.log("consume channel invoked", msg);

        const content = JSON.parse(msg.content.toString());

        try {
            await handler(content);
            channel.ack(msg);
        }catch (err){
            console.error("Processing failed", err);

            // requeue = false prevents infinite loops
            channel.nack(msg, false, false);
        }
    });
};