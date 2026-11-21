import mongoose from 'mongoose';

let cachedPromise = null;

export async function connectDB() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error('MONGO_URI is not defined in environment variables');
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!cachedPromise) {
    const opts = {
      bufferCommands: true,
      maxPoolSize: 10,
    };
    cachedPromise = mongoose.connect(uri, opts).then((conn) => {
      console.log(`[Database] MongoDB connected: ${conn.connection.host}`);
      return conn;
    }).catch((err) => {
      cachedPromise = null;
      throw err;
    });
  }

  return cachedPromise;
}

export default connectDB;
