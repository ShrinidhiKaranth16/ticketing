import { OrderCancelledListener } from '../order-cancelled-listener';
import { natsWrapper } from '../../../nats-wrapper';
import mongoose from 'mongoose';
import { OrderCancelledEvent } from '@retix/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';
import { OrderStatus } from '@retix/common';

const setup = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client);
    const orderId = new mongoose.Types.ObjectId().toHexString();
    const ticket = Ticket.build({
        title: 'concert',
        price: 99,
        userId: '123'
    });
    ticket.set({orderId});
    await ticket.save();
    const data: OrderCancelledEvent['data'] = {
        id: orderId,
        version: 0,
        ticket: {
            id: ticket.id,
        }
    };
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };
    return { listener, data, msg };
}


it("updates the ticket, publishes an event, and acks the message", async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
    const updatedTicket = await Ticket.findById(data.ticket.id);
    expect(updatedTicket!.orderId).toBeUndefined();
    expect(natsWrapper.client.publish).toHaveBeenCalled();
    expect(msg.ack).toHaveBeenCalled();
});