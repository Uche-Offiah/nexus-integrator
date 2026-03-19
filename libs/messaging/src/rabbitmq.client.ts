import amqp from "amqplib";

let channel: amqp.Channel;

export const connectRabbitMQ = async () => {
    const connection = await amqp.connect("amqp://admin:admin@localhost:5672");

    channel = await connection.createChannel();

    await channel.assertExchange("integration.events", "topic", {
        durable: true,
    });

    return channel;
};

export const getChannel = () => {
    if (!channel) {
        throw new Error("RabbitMQ not connected");
    }
    return channel;
};