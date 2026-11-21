import { TodoList } from './todo-list.jsx';

import { fireEvent, render, waitFor } from '@solidjs/testing-library';
import { afterEach, describe, expect, test, vi } from 'vitest';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('<TodoList />', () => {
  test('it will render an text input and a button', () => {
    const { getByPlaceholderText, getByText, unmount } = render(() => (
      <TodoList />
    ));
    expect(getByPlaceholderText('new todo here')).toBeDefined();
    expect(getByText('Add Todo')).toBeDefined();
    unmount();
  });

  test('it creates a todo and refreshes the list', async () => {
    const items: { id: string; content: string }[] = [];
    const fetchMock = vi.fn(
      async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = input instanceof Request ? input.url : String(input);
        const method = init?.method ?? 'GET';

        if (url.endsWith('/api/hello')) {
          return Response.json({ message: 'こんにちは！ Hono' });
        }

        if (method === 'PUT') {
          const { content } = JSON.parse(String(init?.body)) as {
            content: string;
          };
          items.push({ id: 'todo-1', content });
        }

        return Response.json({ items });
      },
    );
    vi.stubGlobal('fetch', fetchMock);

    const { getByPlaceholderText, getByText, unmount } = render(() => (
      <TodoList />
    ));
    const input = getByPlaceholderText('new todo here') as HTMLInputElement;

    input.value = 'New todo';
    fireEvent.input(input);
    await Promise.resolve();
    fireEvent.click(getByText('Add Todo'));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        '/api/todo',
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify({ content: 'New todo' }),
        }),
      );
      expect(
        fetchMock.mock.calls.filter(
          ([url, options]) =>
            String(url).endsWith('/api/todo') &&
            (options?.method ?? 'GET') === 'GET',
        ),
      ).toHaveLength(2);
      expect(getByText('New todo')).toBeDefined();
    });

    unmount();
  });
});
