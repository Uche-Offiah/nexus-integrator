import { getChannel } from "./rabbitmq.client";

export const consume = async(   
    queue: string,
    routingKey: string,  
    handler: (msg: any) => Promise<void>) => {

    const channel = getChannel();

    await  channel.assertQueue(queue, { durable: true});

    await channel.bindQueue(queue, "integration.events", routingKey);

    const MAX_RETRIES = 3;

    channel.consume(queue, async (msg) => {
        if (!msg) return;

        console.log("consume channel invoked", msg);

        const content = JSON.parse(msg.content.toString());

        try {
            await handler(content);
            channel.ack(msg);
        }catch (err){
            const retries = msg.Properties.headers?.["x-retry"] || 0;
            if (retries < MAX_RETRIES)
            {
                console.log(`Retrying... attempt ${retries + 1}`)

                channel.publish(
                    "integration.events",
                    routingKey,
                    Buffer.from(JSON.stringify(content)),
                    {
                        headers: {"x-retry": retries + 1}
                    }
                );
                channel.ack(msg);
            }else {
                console.log("Sending to DLQ");

                channel.publish(
                    "integration.dlq",
                    routingKey,
                    Buffer.from(JSON.stringify(content))
                );
                channel.ack(msg);
            }
            console.error("Processing failed", err);

            // requeue = false prevents infinite loops
            channel.nack(msg, false, false);
        }
    });
};