import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import jwt from 'jsonwebtoken';

// increase global timeout BEFORE any hooks
jest.setTimeout(60000);

declare global {
  var signin: () => string[];
}

jest.mock('../nats-wrapper');

let mongo: MongoMemoryServer;

beforeAll(async () => {
  process.env.JWT_KEY = 'asdf';
  
  // Force MongoDB version 4.4+ to fix wire version compatibility
  process.env.MONGOMS_VERSION = '4.4.29';

  mongo = await MongoMemoryServer.create({
    binary: {
      version: '7.0.5' // Specify compatible MongoDB version
    },
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
  jest.clearAllMocks();
  // Check if connection and db exist
  if (mongoose.connection.readyState === 1 && mongoose.connection.db) {
    const collections = await mongoose.connection.db.collections();
    
    for (const collection of collections) {
      await collection.deleteMany({});
    }
  }
});

afterAll(async () => {
  // Close mongoose connection first
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }

  // Then stop memory server
  if (mongo) {
    await mongo.stop();
  }
});

global.signin = () => {
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com',
  };

  const token = jwt.sign(payload, process.env.JWT_KEY!);
  const session = { jwt: token };
  const sessionJSON = JSON.stringify(session);
  const base64 = Buffer.from(sessionJSON).toString('base64');

  return [`session=${base64}`];
};