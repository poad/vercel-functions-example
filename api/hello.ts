import { Hono } from 'hono';
import { handle } from '@hono/node-server/vercel';

const app = new Hono().basePath('/api');

app.get('/hello', (c) => {
  const { message } = c.req.query();
  return c.json({
    message: `こんにちは！ ${message ?? '世界'}`,
  });
});

export default handle(app);
