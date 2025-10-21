import { Request, Response } from 'express';
import { getDbStatus, pingDB } from '../utils/db';

export async function healthHandler(_req: Request, res: Response) {
  const dbOk = await pingDB();

  const status = {
    status: dbOk ? 'ok' : 'degraded',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    services: {
      database: {
        status: dbOk ? 'up' : 'down',
        state: getDbStatus(),
      },
    },
  };

  const code = dbOk ? 200 : 503;
  return res.status(code).json(status);
}
