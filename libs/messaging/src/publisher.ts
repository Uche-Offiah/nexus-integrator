import { getChannel } from "./rabbitmq.client";

export const publishEvent = async (routingKey: string, message: any) => {
    const channel = getChannel();

    channel.publish(
        "integration.events",
        routingKey,
        Buffer.from(JSON.stringify(message)),
        {persistent: true}
    );
};