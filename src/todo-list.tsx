import {
  ErrorBoundary,
  For,
  JSX,
  Show,
  Suspense,
  createResource,
  createSignal,
} from 'solid-js';
import { hc } from 'hono/client';
import { FadeLoader } from './components/ui/FadeLoader';
import { ErrorAlert } from './components/ui/ErrorAlert';
import { TrashBinIcon } from './components/ui/Icons/TrashBin';
import type { AppType } from '../api/';

function Message() {
  const client = hc<AppType>('/');
  const [data] = createResource<{ message: string }>(() =>
    client.api.hello
      .$post({ json: { message: 'Hono' } })
      .then((res) => res.json()),
  );
  return (
    <ErrorBoundary fallback={<ErrorAlert>{data.error}</ErrorAlert>}>
      <Suspense fallback={<div>loading...</div>}>
        <Show when={!data.loading && data()}>
          <span>{data()?.message}</span>
        </Show>
      </Suspense>
    </ErrorBoundary>
  );
}

export function TodoList(): JSX.Element {
  const client = hc<AppType>('/');
  const [data, { refetch }] = createResource<{
    items: { id: string; content: string }[];
  }>(() => client.api.todo.$get().then((res) => res.json()));

  const [text, setText] = createSignal<string>();

  createResource(text, (text?: string) => {
    if (!text) return;
    // eslint-disable-next-line promise/catch-or-return, promise/always-return
    client.api.todo.$put({ json: { content: text } }).then(async () => {
      refetch();
    });
  });

  async function deleteTodo(id: string) {
    if (!id) return;
    // eslint-disable-next-line promise/catch-or-return
    client.api.todo.$delete({ json: { id } }).then(() => refetch());
  }
  const [value, setValue] = createSignal('');
  const addTodo = (text: string) => {
    setText(() => text);
  };

  return (
    <>
      <div>
        <input placeholder="new todo here" value={value()} />
        <button
          onClick={() => {
            if (!value().trim()) return;
            addTodo(value());
            setValue('');
          }}
        >
          Add Todo
        </button>
      </div>
      <p>
        <Message />
      </p>

      <ErrorBoundary fallback={<ErrorAlert>{data.error}</ErrorAlert>}>
        <Suspense
          fallback={
            <div>
              <FadeLoader />
            </div>
          }
        >
          <Show when={!data.loading && data()}>
            <ul>
              <For each={data()?.items}>
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
          </Show>
        </Suspense>
      </ErrorBoundary>
    </>
  );
}
