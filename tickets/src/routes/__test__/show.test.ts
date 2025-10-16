import Request from 'supertest';
import {app} from "../../app";
import {Ticket} from '../../models/ticket';
import mongoose from 'mongoose';
it("returns 404 if the ticket is not found",async()=>{

    const id = new mongoose.Types.ObjectId().toHexString(); 
    await Request(app)
    .get(`/api/tickets/${id}`)
    .send()
    .expect(404)
})

it("returns the ticket if the ticket is found",async()=>{
   const ticketResponse = await Request(app)
   .post('/api/tickets')
   .set('Cookie',global.signin())
   .send({title:"test",price:10})
   .expect(201)


   const response = await Request(app)
   .get(`/api/tickets/${ticketResponse.body.id}`)
   .send()
   .expect(200)

   expect(response.body.title).toEqual("test")
   expect(response.body.price).toEqual(10)
})