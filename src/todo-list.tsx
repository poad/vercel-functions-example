import type { AppType } from '../api/index.js';
import { ErrorAlert } from './components/ui/ErrorAlert/index.js';
import { FadeLoader } from './components/ui/FadeLoader/index.js';
import { TrashBinIcon } from './components/ui/Icons/index.js';

import type { JSX } from '@solidjs/web';
import { hc } from 'hono/client';
import {
  Errored,
  For,
  Loading,
  createMemo,
  createSignal,
  refresh,
} from 'solid-js';

function Message() {
  const client = hc<AppType>('/');
  const data = createMemo(
    async () =>
      await client.api.hello
        .$post({ json: { message: 'Hono' } })
        .then(async (res) => res.json()),
  );
  const message = createMemo(() => {
    const result = data();
    return 'message' in result ? result.message : result.error.message;
  });
  return (
    <Loading fallback={<div>loading...</div>}>
      <Errored
        fallback={(error) => (
          <ErrorAlert>{(error() as { message: string }).message}</ErrorAlert>
        )}
      >
        <span>{message()}</span>
      </Errored>
    </Loading>
  );
}

export function TodoList(): JSX.Element {
  const client = hc<AppType>('/');
  const data = createMemo<{
    items: { id: string; content: string }[];
  }>(() => client.api.todo.$get().then((res) => res.json()));

  async function deleteTodo(id: string) {
    if (!id) return;
    await client.api.todo.$delete({ json: { id } });
    await refresh(data);
  }

  const [value, setValue] = createSignal('');
  async function addTodo(content: string) {
    await client.api.todo.$put({ json: { content } });
    setValue('');
    await refresh(data);
  }

  return (
    <>
      <div>
        <input
          placeholder="new todo here"
          value={value()}
          onInput={(event) => setValue(event.currentTarget.value)}
        />
        <button
          onClick={() => {
            const content = value().trim();
            if (!content) return;
            void addTodo(content);
          }}
        >
          Add Todo
        </button>
      </div>
      <p>
        <Message />
      </p>

      <Errored
        fallback={(error) => (
          <ErrorAlert>{(error() as { message: string }).message}</ErrorAlert>
        )}
      >
        <Loading
          fallback={
            <div>
              <FadeLoader />
            </div>
          }
        >
          <ul>
            <For each={data().items}>
              {(item) => (
                <li>
                  {item.content}{' '}
                  <button
                    onClick={async () => {
                      await deleteTodo(item.id);
                    }}
                  >
                    <TrashBinIcon />
                  </button>
                </li>
              )}
            </For>
          </ul>
        </Loading>
      </Errored>
    </>
  );
}
