import {natsWrapper} from '../../../nats-wrapper';
import { OrderCreatedListener } from '../orderCreatedListener';
import { OrderCreatedEvent } from '@retix/common';
import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { OrderStatus } from '@retix/common';
import { Order } from '../../../models/order';

const setup = async()=>{
    const listener = new OrderCreatedListener(natsWrapper.client);
    const data: OrderCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        expiresAt: "asdsadas",
        userId: "asdasd",
        ticket: {
            id: new mongoose.Types.ObjectId().toHexString(),
            price: 10
        },
        status: OrderStatus.Created
    };
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };
    return { listener, data, msg };
}

it("replicates the order info", async()=>{
    const {listener, data, msg} = await setup();
    await listener.onMessage(data, msg);
    const order = await Order.findById(data.id);
    expect(order).toBeDefined();
    expect(order!.price).toEqual(data.ticket.price);
})

it("acks the message", async()=>{
    const {listener, data, msg} = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
})