import {TicketUpdatedListener} from '../ticket-updated-listener';
import {natsWrapper} from '../../../nats-wrapper';
import {TicketUpdatedEvent} from '@retix/common';
import {Message} from 'node-nats-streaming';
import mongoose from 'mongoose';
import {Ticket} from '../../../models/ticket';
 
const setup = async() =>{
    const listener = new TicketUpdatedListener(natsWrapper.client);
    const ticket = Ticket.build({
        id:new mongoose.Types.ObjectId().toHexString(),
        title:'test',
        price:10
    })
    await ticket.save();
    const data:TicketUpdatedEvent['data'] = {
        id:ticket.id,
        version:ticket.version + 1,
        title:'test',
        price:20,
        userId:new mongoose.Types.ObjectId().toHexString()
    }
    //@ts-ignore
    const msg:Message = {
        ack:jest.fn()
    }
    return {listener,data,msg,ticket}
}


it("finds,updates and saves a ticket",async()=>{
    const {listener,data,msg,ticket} = await setup();
    await listener.onMessage(data,msg);
    const updatedTicket = await Ticket.findById(ticket.id);
    expect(updatedTicket!.title).toEqual(data.title);
    expect(updatedTicket!.price).toEqual(data.price);
    expect(updatedTicket!.version).toEqual(data.version);
})

it("acks the message",async()=>{
    const {listener,data,msg,ticket} = await setup();
    await listener.onMessage(data,msg);
    expect(msg.ack).toHaveBeenCalled();
})

it("Does not call ack if the ticket is not found",async()=>{
    const {listener,data,msg} = await setup();
    data.version = 10;
    await listener.onMessage(data,msg);
    expect(msg.ack).not.toHaveBeenCalled();
}) 