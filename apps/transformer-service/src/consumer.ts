import { connectRabbitMQ, consume } from "@libs/messaging";

const start =async () => {
    
    await connectRabbitMQ();

    await consume("transform.queue", "user.created", async (event) => {
        console.log("Received event:", event);

        const transnformed = {
            ...event,
            payload: {
                ...event.paayload,
                normalized: true,
            },
        };

        console.log("Transformed event:", transnformed)
    });
};

start();