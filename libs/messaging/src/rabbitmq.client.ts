import amqp from "amqplib";

let channel: amqp.Channel;

export const connectRabbitMQ = async () => {
    const connection = await amqp.connect("amqp://admin:admin@localhost:5672");

    channel = await connection.createChannel();

    await channel.assertExchange("integration.events", "topic", {
        durable: true,
    });

    // Adding retry exchange and queue using delay queue pattern
    await channel.assertExchange("integration.retry", "topic", {durable: true});
    await channel.assertQueue("retry.queue",{
        durable: true,
        arguments: {
            "x-message-ttl": 5000, // 5 sec delay
            "x-dead-letter-exchange": "integration.events",
        },
    });
    await channel.bindQueue("retry.queue", "integration.retry", "#");

    // Adding DLQ Exchange and queue binding
    await channel.assertExchange("integration.dlq", "topic", {
        durable: true,
    });

    await channel.assertQueue("dlq.queue", {durable: true, });
    await channel.bindQueue("dlq.queue", "integration.dlq", "#");

    return channel;
};

export const getChannel = () => {
    if (!channel) {
        throw new Error("RabbitMQ not connected");
    }
    return channel;
};