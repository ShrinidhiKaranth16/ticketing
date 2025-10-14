import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import { app } from '../app';

declare global {
    var signin: () => Promise<string[]>;
}

let mongo: MongoMemoryServer;

beforeAll(async () => {
  jest.setTimeout(60000); // setup can take longer

  process.env.JWT_KEY = 'asdf';

  mongo = await MongoMemoryServer.create({
    instance: { port: 27017 }, // optional, use a free port
  });

  const mongoUri = await mongo.getUri();
  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 5000, // avoids hanging if server isn't ready
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
  jest.setTimeout(60000); // teardown can take longer

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