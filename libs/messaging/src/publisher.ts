import { getChannel } from "@libs/messaging";

export const publishEvent = async (routingKey: string, message: any) => {
    console.log("Publishing event...");

    const channel = getChannel();

    console.log("Channel obtained");

    channel.publish(
        "integration.events",
        routingKey,
        Buffer.from(JSON.stringify(message)),
        {persistent: true}
    );
    console.log("Event published");
};