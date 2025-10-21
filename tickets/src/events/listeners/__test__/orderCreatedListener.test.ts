import { OrderCreatedListener } from '../order-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import mongoose from 'mongoose';
import { OrderCreatedEvent } from '@retix/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';
import { OrderStatus } from '@retix/common';

const setup = async () => {
    const listener = new OrderCreatedListener(natsWrapper.client);
    const ticket = Ticket.build({
        title: 'concert',
        price: 99,
        userId: '123'
    });
    await ticket.save();
    const data: OrderCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        ticket: {
            id: ticket.id,
            price: ticket.price
        },
        expiresAt: new Date().toISOString(),
        status: OrderStatus.Created,
        userId: '123'
    };
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };
    return { listener, data, msg };
}

it("sets the userID of the ticket",async()=>{
    const {listener,data,msg} = await setup();
    await listener.onMessage(data,msg);
    const ticketFound = await Ticket.findById(data.ticket.id);
    expect(ticketFound!.userId).toEqual(data.userId);
})

it("acks the message",async()=>{
    const {listener,data,msg} = await setup();
    await listener.onMessage(data,msg);
    expect(msg.ack).toHaveBeenCalled();
})

it("published a ticket updated event",async()=>{
    const {listener,data,msg} = await setup();
    await listener.onMessage(data,msg);
    expect(natsWrapper.client.publish).toHaveBeenCalled();
    const ticketUpdatedEvent = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
   expect(data.id).toEqual(ticketUpdatedEvent.orderId);
})