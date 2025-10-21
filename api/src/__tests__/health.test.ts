import request from 'supertest';
import app from '../app';

jest.mock('../utils/db', () => ({
  ...jest.requireActual('../utils/db'),
  pingDB: jest.fn(),
}));

import { pingDB } from '../utils/db';

describe('GET /health', () => {
  it('returns 200 and ok when DB is healthy', async () => {
    (pingDB as jest.Mock).mockResolvedValueOnce(true);

    const res = await request(app).get('/health');

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.services.database.status).toBe('up');
  });

  it('returns 503 when DB is not healthy', async () => {
    (pingDB as jest.Mock).mockResolvedValueOnce(false);

    const res = await request(app).get('/health');

    expect(res.status).toBe(503);
    expect(res.body.status).toBe('degraded');
    expect(res.body.services.database.status).toBe('down');
  });
});
