import express from "express";
import {v4 as uuidv4} from "uuid";
import { connectRabbitMQ } from "../../../libs/messaging/src/rabbitmq.client";
import {publishEvent} from "../../../libs/messaging/src/publisher";

const app = express();
app.use(express.json);

app.post("/events",async (req, res) => {
    
    const correlationId = (req.headers["x-correlation-id"] as string) || uuidv4();

    const event = {
        eventId: uuidv4(),
        eventType: req.body.eventType,
        source: "ingestion-api",
        timestamp: new Date().toISOString(),
        correlationId,
        payload: req.body.payload,
    };

    await publishEvent ("user.created", event);

    res.json({
        status: "published",
        correlationId,
    });
});

app.listen(3000,async () => {
    await connectRabbitMQ();
    console.log("Ingestion API runnig on port 3000")
});