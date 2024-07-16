import { Context, Hono } from 'hono';
import { handle } from 'hono/vercel';
import { zValidator } from '@hono/zod-validator';
import { logger } from 'hono/logger';
import { z } from 'zod';

import { sql } from '@vercel/postgres';

export const config = {
  runtime: 'edge',
};

interface Item { id: string, content: string }

async function todoList(c: Context<object, '/', object>) {
  const { rows } = await sql<Item>`SELECT * FROM todos ORDER BY createdAt`;
  const items = rows.map((row: Item) => {
    return {
      id: row.id,
      content: row.content,
    };
  });
  return c.json({ items });
}

async function createTodo(c: Context<object, '/', {
  in: {
    json: {
      content: string;
    };
  };
  out: {
    json: {
      content: string;
    };
  };
}>) {
  const { content } = c.req.valid('json');
  const result = await sql< Item>`INSERT INTO todos (content) VALUES (${content})`;
  const items = result.rows.map((row: Item) => {
    return {
      id: row.id,
      content: row.content,
    };
  });
  return c.json({ items });
}

async function deleteTodo(c: Context<object, '/', {
  in: {
    json: {
      id: string;
    };
  };
  out: {
    json: {
      id: string;
    };
  };
}>) {
  const { id } = c.req.valid('json');
  const { rows } = await sql< Item>`DELETE FROM todos where id = ${id}`;
  if (rows.length > 1) {
    return c.json({ message: 'Too Many match by ID' }, 400);
  }
  const item = {
    id: rows[0].id,
    content: rows[0].content,
  };
  return c.json({ item });
}

const todoApp = new Hono()
  .get('/', logger(), async (c) => todoList(c))
  .put('/', logger(), zValidator('json', z.object({ content: z.string() })), async (c) => createTodo(c))
  .delete('/', logger(), zValidator('json', z.object({ id: z.string() })), async (c) => deleteTodo(c));


async function echoMessage(c: Context<object, '/', {
  in: {
    json: {
      message: string;
    };
  };
  out: {
    json: {
      message: string;
    };
  };
}>) {
  const { message } = c.req.valid('json');

  return c.json({
    message: `こんにちは！ ${message ?? '世界'}`,
  });

}

const messageApp = new Hono().post('/',
  logger(),
  zValidator('json', z.object({ message: z.string() })),
  echoMessage
);

const app = new Hono().basePath('/api');

const routes = app
  .route('/hello', messageApp)
  .route('/todo', todoApp);

export type AppType = typeof routes;

export default handle(app);
