export interface EventEnvelope<T = any> {
    eventId: string;
    eventType: string;
    source: string;
    timestamp: string;
    correlationId: string;
    payload: T;
}