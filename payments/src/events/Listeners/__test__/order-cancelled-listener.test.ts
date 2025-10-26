import { OrderCancelledListener } from '../orderCancelledListener';
import { OrderCancelledEvent } from '@retix/common';
import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { OrderStatus } from '@retix/common';
import { Order } from '../../../models/order';
import { natsWrapper } from '../../../nats-wrapper';

const setup = async()=>{
    const listener = new OrderCancelledListener(natsWrapper.client);
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        price: 10,
        userId: 'asdasd',
        status: OrderStatus.Created
    });
    await order.save();
    const data: OrderCancelledEvent['data'] = {
        id: order.id,
        version: 1,
        ticket: {
            id: "asdasd"
        }
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
    expect(order!.status).toEqual(OrderStatus.Cancelled);
})

it("updates the order status to cancelled", async()=>{
    const {listener, data, msg} = await setup();
    await listener.onMessage(data, msg);
    const order = await Order.findById(data.id);
    expect(order!.status).toEqual(OrderStatus.Cancelled);
})

it("acks the message", async()=>{
    const {listener, data, msg} = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
})