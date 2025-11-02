import { Publisher, Subjects , PaymentCreatedEvent } from '@retix/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}

