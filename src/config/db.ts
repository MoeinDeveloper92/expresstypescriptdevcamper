import mongoose from 'mongoose';

class MongoDBClient {
  connectDB = async () => {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI as string);
      console.log(
        `MONGODB Connected:${conn.connection.host}`.bgGreen.underline.bold
      );
    } catch (error) {
      console.error('Something went wrong druing connection'.red, error);
    }
  };
}

const mongoClient = new MongoDBClient();

Object.freeze(mongoClient);

export { mongoClient };
