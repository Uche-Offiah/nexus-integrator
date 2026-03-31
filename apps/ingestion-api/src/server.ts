import express from "express";
import {v4 as uuidv4} from "uuid";
import { connectRabbitMQ, publishEvent  } from "../../../libs/messaging";
//import {publishEvent} from "../../../libs/messaging/src/publisher";

const app = express();
app.use(express.json());

app.post("/events",async (req, res) => {
    console.log("Received request"); 
    const correlationId = (req.headers["x-correlation-id"] as string) || uuidv4();

    const user = (req as any).user;

    const event = {
        eventId: req.body.eventId || uuidv4(),
        eventType: req.body.eventType,
        source: "ingestion-api",
        timestamp: new Date().toISOString(),
        correlationId,
        payload: req.body.payload,
        user,
    };
    
    console.log("Before publish");
    await publishEvent ("user.created", event);

    console.log("After publish");
    res.json({
        status: "published",
        correlationId,
    });
});

// app.listen(3000,async () => {
//     await connectRabbitMQ();
//     console.log("Ingestion API runnig on port 3000")
// });

const start = async () => {
    await connectRabbitMQ();
    console.log("RabbitMQ connected");
  
    app.listen(3000, () => {
      console.log("Ingestion API running on port 3000");
    });
};
  
start();