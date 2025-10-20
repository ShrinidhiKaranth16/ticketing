import {Publisher, Subjects, TicketCreatedEvent} from "@retix/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
}