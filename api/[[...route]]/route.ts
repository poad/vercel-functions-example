import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { sql } from '@vercel/postgres';

export const runtime = 'edge';

const app = new Hono().basePath('/api');

app.get('/todo', async (c) => {
  const data = await sql`SELECT * from TODOS`;
  c.json(data.rows.map((row) => ({
    id: row.id, quantity: row.quantity,
  })));
});

app.get('/hello', async (c) => {
  const { message } = c.req.query();
  c.json({
    message: `こんにちは！ ${message ?? '世界'}`
  });
});


export const GET = handle(app);
export const POST = handle(app);

export default handle(app);
