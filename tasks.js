// tasks.js: pure logic. No document, no localStorage.
// Every function takes the current array and returns a NEW array.

export const MAX_TITLE_LENGTH = 100;

// Trim the input and cap its length. An empty result means "reject it".
export const cleanTitle = (raw) =>
  String(raw ?? '').trim().slice(0, MAX_TITLE_LENGTH);

// Ids are strings because element.dataset.id is always a string.
// The random part stops two tasks added in the same millisecond from sharing an id.
const makeId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const addTask = (tasks, title) =>
  [...tasks, { id: makeId(), title, done: false }];

export const toggleTask = (tasks, id) =>
  tasks.map(t => (t.id === id ? { ...t, done: !t.done } : t));

export const deleteTask = (tasks, id) =>
  tasks.filter(t => t.id !== id);

export const countDone = (tasks) =>
  tasks.reduce((count, t) => (t.done ? count + 1 : count), 0);

// Used when loading: throw away anything that is not shaped like a task.
export const isValidTask = (t) =>
  Boolean(t) &&
  typeof t.id === 'string' &&
  typeof t.title === 'string' &&
  typeof t.done === 'boolean';
