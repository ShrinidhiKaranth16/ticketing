import { Listener, OrderCancelledEvent } from "@retix/common";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";
import { Subjects } from "@retix/common";
import { Message } from "node-nats-streaming";

export class OrderCancelledListener extends Listener<OrderCancelledEvent>{
    subject:Subjects.OrderCancelled = Subjects.OrderCancelled;
    queueGroupName = queueGroupName;
   async onMessage(data:OrderCancelledEvent['data'],msg:Message){
        const ticket = await Ticket.findById(data.ticket.id);
        if(!ticket){
            throw new Error('Ticket not found');
        }
        ticket.set({
            orderId:undefined
        })
        await ticket.save(); 
        new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId,
            version: ticket.version,
            orderId: undefined
        })
        msg.ack();
   }
}