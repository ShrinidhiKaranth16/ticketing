import { createChargeRouter } from '../new';
import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
import mongoose from 'mongoose';
import { OrderStatus } from '@retix/common';
import { stripe } from '../../stripe';
import { Payment } from '../../models/payment';

jest.mock('../../stripe');

it("returns 404 for order that does not exist",async()=>{
    await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
        token: 'asdasd',
        orderId: new mongoose.Types.ObjectId().toHexString()
    })
    .expect(404);
})

it("returns 401 when the user is not authenticated",async()=>{
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        price: 10,
        userId: 'asdasd',
        status: OrderStatus.Created
    });
    await order.save();
    await request(app)
    .post('/api/payments')
    .send({
        token: 'asdasd',
        orderId: order.id
    })
    .expect(401);
    
})

it("returns 400 when the order is cancelled",async()=>{
    const userId = new mongoose.Types.ObjectId().toHexString();
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        price: 10,
        userId,
        status: OrderStatus.Cancelled
    });
    await order.save();
    await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({
        token: 'asdasd',
        orderId: order.id
    })
    .expect(400);
})

it("returns a 201 with valid inputs",async()=>{
    const userId = new mongoose.Types.ObjectId().toHexString();
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        price: 10,
        userId,
        status: OrderStatus.Created
    });
    await order.save();
    await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({
        token: 'tok_visa',
        orderId: order.id
    })
    .expect(201);
    const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
    expect(chargeOptions.source).toEqual('tok_visa');
    expect(chargeOptions.amount).toEqual(10 * 100);
    expect(chargeOptions.currency).toEqual('usd');

    const payment = await Payment.findOne({
        orderId: order.id,
        stripeId: chargeOptions.id
    });
    expect(payment).toBeDefined();
})

