import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import {Order , OrderStatus} from '../../models/order';
import {Ticket} from '../../models/ticket';

it("return an error if the ticket does not exist",async()=>{
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app).post('/api/orders')
    .set('Cookie',global.signin()) 
    .send({
        ticketId: id
    })
    .expect(404)
})

it("return an error if the ticket is already reserved",async()=>{
    const ticket = Ticket.build({
        title: 'new title',
        price: 10
    })
    await ticket.save();
    const order = Order.build({
        ticket,
        userId: '123',
        status: OrderStatus.Created,
        expiresAt: new Date()
    })
    await order.save();

    await request(app).post('/api/orders')
    .set('Cookie',global.signin()) 
    .send({
        ticketId: ticket.id
    })
    .expect(400)
})

it("reserve a ticket",async()=>{
    const ticket = Ticket.build({
        title: 'new title',
        price: 10
    })
    await ticket.save();
    await request(app).post('/api/orders')
    .set('Cookie',global.signin()) 
    .send({
        ticketId: ticket.id
    })
    .expect(201)
})