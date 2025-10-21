import { Publisher , OrderCreatedEvent , Subjects } from "@retix/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{
    subject: Subjects.OrderCreated = Subjects.OrderCreated;

}
