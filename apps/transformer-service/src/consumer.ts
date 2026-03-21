import { connectRabbitMQ, consume } from "@libs/messaging";
import { logger } from "@libs/logger"
import { isProcessed, markProcessed} from "@libs/idempotency";

const start =async () => {
    
    await connectRabbitMQ();

    await consume("transform.queue", "user.created", async (event) => {
        console.log("Received event:", event);

        // checks for duplicates before transformation
        if (await isProcessed(event.eventId)){
            console.log("Duplicate event skipped");
            return;
        }

        const transnformed = {
            ...event,
            payload: {
                ...event.paayload,
                normalized: true,
            },
        };

        logger.info({
            message: "Processing event",
            correlationId: event.correlationId
        });

        console.log("Processed:", transnformed);

        await markProcessed(event.eventId);
    });
};

start();