import { Publisher, Subjects, TicketUpdatedEvent } from "@retix/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
