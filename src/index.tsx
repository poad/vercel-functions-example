import { TodoList } from './todo-list';

import 'flowbite';
import { render } from 'solid-js/web';

const doc = document.getElementById('root');
if (doc) {
  render(() => <TodoList />, doc);
}
