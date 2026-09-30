// render.js: the only file that draws on the page.
import { countDone } from './tasks.js';

const list = document.querySelector('#task-list');
const emptyMessage = document.querySelector('#empty-message');
const summary = document.querySelector('#summary');
const progress = document.querySelector('#progress');
const input = document.querySelector('#task-input');
const feedback = document.querySelector('#feedback');

// data -> one <li>
function taskToListItem(task) {
  const li = document.createElement('li');
  li.className = task.done ? 'task task--done' : 'task';
  li.dataset.id = task.id;

  const label = document.createElement('label');
  label.className = 'task__label';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'task__check';
  checkbox.checked = task.done;

  const text = document.createElement('span');
  text.className = 'task__text';
  text.textContent = task.title; // textContent, never innerHTML, for user text

  label.append(checkbox, text);

  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.className = 'task__delete';
  deleteButton.textContent = 'Delete';
  deleteButton.setAttribute('aria-label', `Delete task: ${task.title}`);

  li.append(label, deleteButton);
  return li;
}

// One function owns the drawing. Every other function edits the array and calls this.
export function renderTasks(tasks) {
  // Keyboard users: remember which checkbox had focus so we can give it back.
  const active = document.activeElement;
  const focusedId = active && active.matches('.task__check')
    ? active.closest('li').dataset.id
    : null;

  list.innerHTML = ''; // clear first, or every render appends duplicates
  tasks.map(taskToListItem).forEach(li => list.append(li));

  if (focusedId) {
    const again = list.querySelector(`[data-id="${CSS.escape(focusedId)}"] .task__check`);
    if (again) again.focus();
  }

  const done = countDone(tasks);
  emptyMessage.hidden = tasks.length > 0;
  progress.hidden = tasks.length === 0;
  progress.max = Math.max(tasks.length, 1);
  progress.value = done;
  summary.textContent = tasks.length === 0
    ? 'No tasks'
    : `${done} of ${tasks.length} done`;
}

// Empty string clears the message.
export function showFeedback(message) {
  feedback.textContent = message;
  input.classList.toggle('add-form__input--invalid', message !== '');
  input.setAttribute('aria-invalid', message !== '' ? 'true' : 'false');
}
