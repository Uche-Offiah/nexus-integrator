import { getChannel } from "./rabbitmq.client";

export const consume = async(routingKey: string, queue: string, handler: (msg: any) => Promise<void>) => {

    const channel = getChannel();

    await  channel.assertQueue(queue, { durable: true});

    await channel.bindQueue(queue, "intergration.events", routingKey);

    channel.consume(queue, async (msg) => {
        if (!msg) return;

        const content = JSON.parse(msg.connect.toString());

        try {
            await handler(content);
            channel.ack(msg);
        }catch (err){
            console.error("Processing failed", err);

            // requeue = false prevents infinite loops
            channel.nack(msg, false, false);
        }
    })
}