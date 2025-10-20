import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import {Order , OrderStatus} from '../../models/order';
import {Ticket} from '../../models/ticket';

it("fetches orders for a particular user",async()=>{
// create 3 tickets
const ticketOne = Ticket.build({
    title: 'new title',
    price: 10
})
await ticketOne.save();
const ticketTwo = Ticket.build({
    title: 'new title',
    price: 10
})
await ticketTwo.save();
const ticketThree = Ticket.build({
    title: 'new title',
    price: 10
})
await ticketThree.save();

// create one order as user 1
const user1  = global.signin();
const user2 = global.signin();
await request(app).post('/api/orders').set('Cookie',user1).send({
    ticketId: ticketOne.id
})
await request(app).post('/api/orders').set('Cookie',user2).send({
    ticketId: ticketTwo.id
})
await request(app).post('/api/orders').set('Cookie',user2).send({
    ticketId: ticketThree.id
})

const response = await request(app).get('/api/orders').set('Cookie',user2).expect(200);
expect(response.body.length).toEqual(2);
expect(response.body[0].ticket.title).toEqual(ticketTwo.title);
expect(response.body[1].ticket.title).toEqual(ticketThree.title);

})
