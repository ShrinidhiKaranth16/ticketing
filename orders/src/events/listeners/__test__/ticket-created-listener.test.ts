import mongoose from 'mongoose';
import {natsWrapper} from '../../../nats-wrapper';
import {TicketCreatedEvent} from '@retix/common';
import {Message} from 'node-nats-streaming';
import {TicketCreatedListener} from "../ticket-created-listeners";
import {Ticket} from '../../../models/ticket';
const setup = async()=>{
    const listener = new TicketCreatedListener(natsWrapper.client);
    const data:TicketCreatedEvent['data'] = {
        id:new mongoose.Types.ObjectId().toHexString(),
        version:0,
        title:'test',
        price:10,
        userId:new mongoose.Types.ObjectId().toHexString()
    }
    //@ts-ignore
    const msg:Message = {
        ack:jest.fn()
    }
    return {listener,data,msg}
}


it("creates and saves a ticket",async()=>{
    const {listener,data,msg} = await setup();
    await listener.onMessage(data,msg);
    const ticket = await Ticket.findOne({title:data.title});
    expect(ticket).toBeDefined();
    expect(ticket!.price).toEqual(data.price);
})

it("acks the message",async()=>{
    const {listener,data,msg} = await setup();
    await listener.onMessage(data,msg);
    expect(msg.ack).toHaveBeenCalled();
})