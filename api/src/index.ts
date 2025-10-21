import dotenv from 'dotenv';
import http from 'http';
import mongoose from 'mongoose';
import app from './app';
import { connectDB } from './utils/db';

dotenv.config();

const PORT = parseInt(process.env.PORT || '4000', 10);
const MONGODB_URI = process.env.MONGODB_URI || '';

async function start() {
  try {
    await connectDB(MONGODB_URI);
    const server = http.createServer(app);

    server.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`API server listening on http://localhost:${PORT}`);
    });

    const shutdown = async () => {
      // eslint-disable-next-line no-console
      console.log('Shutting down server...');
      server.close(async () => {
        await mongoose.connection.close();
        process.exit(0);
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

start();
