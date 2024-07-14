import {
  ErrorBoundary,
  For,
  JSX,
  Show,
  Suspense,
  createResource,
  createSignal,
} from 'solid-js';
import { ErrorAlert } from './components/ui/ErrorAlert';

type Todo = { id: number; text: string; completed: boolean };

export function TodoList(): JSX.Element {
  const [data] = createResource<{ message: string }>(() =>
    fetch('/api/hello').then((resp) => resp.json())
  );
  let input!: HTMLInputElement;
  let todoId = 0;
  const [todos, setTodos] = createSignal<Todo[]>([]);
  const addTodo = (text: string) => {
    setTodos([...todos(), { id: ++todoId, text, completed: false }]);
  };
  const toggleTodo = (id: number) => {
    setTodos(
      todos().map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  return (
    <>
      <div>
        <input placeholder="new todo here" ref={input} />
        <button
          onClick={() => {
            if (!input.value.trim()) return;
            addTodo(input.value);
            input.value = '';
          }}
        >
          Add Todo
        </button>
      </div>
      <p>
        <ErrorBoundary fallback={<div>error...</div>}>
          <Suspense fallback={<div>loading...</div>}>
            <Show when={!data.loading && data()}>
              <span>{data()?.message}</span>
            </Show>
            <Show when={!data.loading && data.error}>
              <ErrorAlert>{data.error}</ErrorAlert>
            </Show>
          </Suspense>
        </ErrorBoundary>
      </p>

      <For each={todos()}>
        {(todo) => {
          const { id, text } = todo;
          return (
            <div>
              <input
                type="checkbox"
                checked={todo.completed}
                onchange={[toggleTodo, id]}
              />
              <span
                style={{
                  'text-decoration': todo.completed ? 'line-through' : 'none',
                }}
              >
                {text}
              </span>
            </div>
          );
        }}
      </For>
    </>
  );
};
