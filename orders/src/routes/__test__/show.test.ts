import request from "supertest";
import {app} from "../../app";
import {Ticket} from "../../models/ticket";
import {Order} from "../../models/order";
import {OrderStatus} from "@retix/common";

it("returns the order",async()=>{
    const ticket = Ticket.build({
        title: 'new title',
        price: 10
    })
    await ticket.save();
    const user = global.signin();
    const {body: order} = await request(app).post('/api/orders')
    .set('Cookie',user) 
    .send({
        ticketId: ticket.id
    })
    .expect(201);
    const {body: fetchedOrder} = await request(app).get(`/api/orders/${order.id}`).set('Cookie',user).send();
    expect(fetchedOrder).toEqual(order);
})

it("returns an error if one user tries to fetch another user's order",async()=>{
    const ticket = Ticket.build({
        title: 'new title',
        price: 10
    })
    await ticket.save();
    const user = global.signin();
    const {body: order} = await request(app).post('/api/orders')
    .set('Cookie',user) 
    .send({
        ticketId: ticket.id
    })
    .expect(201);
    await request(app).get(`/api/orders/${order.id}`).set('Cookie',global.signin()).send().expect(401);
})