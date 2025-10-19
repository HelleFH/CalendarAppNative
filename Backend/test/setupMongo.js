import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer;

export const connectInMemoryMongo = async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

export const disconnectInMemoryMongo = async () => {
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
};
