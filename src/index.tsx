import { TodoList } from './todo-list.jsx';

import 'flowbite';
import { render } from '@solidjs/web';

const doc = document.getElementById('root');
if (doc) {
  render(() => <TodoList />, doc);
}
