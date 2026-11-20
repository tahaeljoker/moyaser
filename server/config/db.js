import mongoose from 'mongoose';

let cachedConnection = null;

export async function connectDB() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error('MONGO_URI is not defined in environment variables');
  }

  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  try {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
    };

    const conn = await mongoose.connect(uri, opts);
    cachedConnection = conn;
    console.log(`[Database] MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[Database Error] Connection failed: ${error.message}`);
    throw error;
  }
}

export default connectDB;
