import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import { app } from '../app';

jest.setTimeout(60000); // ✅ Move this to the top

declare global {
    var signin: () => Promise<string[]>;
}

let mongo: MongoMemoryServer;

beforeAll(async () => {

  process.env.JWT_KEY = 'asdf';

  mongo = await MongoMemoryServer.create({
   binary: { version: '5.0.15' },
    instance: {
      dbName: 'test' // Optional: add database name
    }
  });

  const mongoUri = await mongo.getUri(); // Remove await since getUri() returns string, not Promise

  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 30000, // Increased timeout
    socketTimeoutMS: 45000, // Add socket timeout
  });
});

beforeEach(async () => {
  if(mongoose.connection.db){
    const collections = await mongoose.connection.db.collections();
    for (const collection of collections) {
      await collection.deleteMany({});
    }
  }
});

afterAll(async () => {

  // Disconnect mongoose
  await mongoose.disconnect();

  // Stop mongo-memory-server and kill child processes
  if (mongo) {
    await mongo.stop();
  }
});

global.signin = async () => {
    const authResponse = await request(app)
        .post("/api/users/signup")
        .send({
            email: "test@test.com",
            password: "password",
        })
        .expect(201);
    const cookie = authResponse.get("Set-Cookie");
    if(!cookie){
        throw new Error("Cookie not found");
    }
    return cookie;
}