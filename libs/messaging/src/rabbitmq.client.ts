import {connect, Channel, Connection } from "amqplib";

let channel: Channel;

const rabbitmq_con_string = process.env.RABBITMQ_URL || "amqp://admin:admin@localhost:5672"
console.log("rabbitmq_con_string: ", rabbitmq_con_string)

export const connectRabbitMQ = async () => {
    const connection = await connect(rabbitmq_con_string);

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