import request from 'supertest';
import { app } from "../../app";
import mongoose from 'mongoose';
import { Ticket } from "../../models/ticket";
import {natsWrapper} from '../../nats-wrapper';

it('returns a 404 if the ticket is not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app).put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({
        title: 'new title',
        price: 10
    }).expect(404)
})

it("returns a 401 if the user is not authenticated", async () => {
   const id  = new mongoose.Types.ObjectId().toHexString();
   await request(app).put(`/api/tickets/${id}`)
   .send({
       title: 'new title',
       price: 10
   }).expect(401)
})

it("returs 401 if user does not own the ticket", async () => {
    const ticket = await request(app).post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
        title: 'new title',
        price: 10
    })
    const ticketId = ticket.body.id;
    await request(app).put(`/api/tickets/${ticketId}`)
    .set('Cookie', global.signin())
    .send({
        title: 'new title',
        price: 10
    }).expect(401)
})

it("returns a 400 if the user provides an invalid title or price", async () => {
    const cookie = global.signin()
    const ticket = await request(app).post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
        title: 'new title',
        price: 10
    })
    const ticketId = ticket.body.id;
    await request(app).put(`/api/tickets/${ticketId}`)
    .set('Cookie', cookie)
    .send({
        price: -10
    }).expect(400)

    await request(app).put(`/api/tickets/${ticketId}`)
    .set('Cookie', cookie)
    .send({
        title: '',
        price: 10
    }).expect(400)
})

it("updates the ticket provided valid inputs", async () => {
    const cookie = global.signin()
    const ticket = await request(app).post('/api/tickets')
    .set('Cookie', cookie)
    .send({
        title: '    new title',
        price: 10
    })
    const ticketId = ticket.body.id;
    await request(app).put(`/api/tickets/${ticketId}`)
    .set('Cookie', cookie)
    .send({
        title: 'updated title',
        price: 100
    }).expect(200)

    const updatedTicket = await request(app).get(`/api/tickets/${ticketId}`)
    .set('Cookie', cookie)
    .send()
    expect(updatedTicket.body.title).toEqual('updated title')
    expect(updatedTicket.body.price).toEqual(100)
})

it("publishes an event", async () => {
    const cookie = global.signin()
    const ticket = await request(app).post('/api/tickets')
    .set('Cookie', cookie)
    .send({
        title: '    new title',
        price: 10
    })
    const ticketId = ticket.body.id;
    await request(app).put(`/api/tickets/${ticketId}`)
    .set('Cookie', cookie)
    .send({
        title: 'updated title',
        price: 100
    }).expect(200)

    expect(natsWrapper.client.publish).toHaveBeenCalled()
})

it("throws an error if the ticket is reserved", async () => {
    const cookie = global.signin()
    const ticket = await request(app).post('/api/tickets')
    .set('Cookie', cookie)
    .send({
        title: '    new title',
        price: 10
    })
    const undefinedTicket = await Ticket.findById(ticket.body.id)
    undefinedTicket!.set({orderId:new mongoose.Types.ObjectId().toHexString()})
    await undefinedTicket!.save()
    await request(app).put(`/api/tickets/${ticket.body.id}`)
    .set('Cookie', cookie)
    .send({
        title: 'updated title',
        price: 100
    }).expect(400)
})
