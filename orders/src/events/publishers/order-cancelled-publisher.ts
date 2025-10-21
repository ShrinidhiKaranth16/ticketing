import { Publisher , OrderCancelledEvent , Subjects } from "@retix/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;

}
