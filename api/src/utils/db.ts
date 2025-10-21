import mongoose from 'mongoose';

export async function connectDB(uri: string): Promise<typeof mongoose> {
  if (!uri) {
    throw new Error('MONGODB_URI is not defined');
  }

  const dbName = process.env.MONGODB_DB_NAME;

  return mongoose.connect(uri, {
    dbName: dbName || undefined,
  });
}

export async function pingDB(): Promise<boolean> {
  try {
    if (mongoose.connection.readyState !== 1) {
      return false;
    }
    // The underlying driver ping
    const admin = mongoose.connection.db?.admin();
    // admin could be undefined if not connected yet
    if (!admin) {
      return false;
    }
    const result = await admin.ping();
    return (result as any)?.ok === 1;
  } catch (err) {
    return false;
  }
}

export function getDbStatus(): 'disconnected' | 'connected' | 'connecting' | 'disconnecting' {
  switch (mongoose.connection.readyState) {
    case 0:
      return 'disconnected';
    case 1:
      return 'connected';
    case 2:
      return 'connecting';
    case 3:
      return 'disconnecting';
    default:
      return 'disconnected';
  }
}
