import { TodoList } from './todo-list';

import { render } from '@solidjs/testing-library';
import { describe, expect, test } from 'vitest';

describe('<TodoList />', () => {
  test('it will render an text input and a button', () => {
    const { getByPlaceholderText, getByText, unmount } = render(() => (
      <TodoList />
    ));
    expect(getByPlaceholderText('new todo here')).toBeInTheDocument();
    expect(getByText('Add Todo')).toBeInTheDocument();
    unmount();
  });
});
