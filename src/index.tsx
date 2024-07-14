import { render } from 'solid-js/web';
import 'flowbite';

import { TodoList } from './todo-list';

const doc = document.getElementById('root');
if (doc) {
  render(() => <TodoList />, doc);
}
