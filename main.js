// main.js: wires the listeners and imports the rest.
import * as T from './tasks.js';
import { save, load } from './storage.js';
import { renderTasks, showFeedback } from './render.js';

const form = document.querySelector('#task-form');
const input = document.querySelector('#task-input');
const list = document.querySelector('#task-list');

let tasks = load();

// Every change goes through here: new array in, save, redraw.
function update(next) {
  tasks = next;
  if (!save(tasks)) {
    showFeedback('Could not save. Your tasks will be lost when you close this tab.');
  }
  renderTasks(tasks);
}

function handleAdd(e) {
  e.preventDefault(); // a submit would reload the page and wipe the state
  const title = T.cleanTitle(input.value);

  if (title === '') {
    input.value = '';
    showFeedback('Type a task before adding it.');
    input.focus();
    return;
  }

  showFeedback('');
  update(T.addTask(tasks, title));
  input.value = '';
  input.focus();
}

// Event delegation: one listener per event on the <ul>, which is never replaced.
function handleToggle(e) {
  const checkbox = e.target.closest('.task__check');
  if (!checkbox) return;
  update(T.toggleTask(tasks, checkbox.closest('li').dataset.id));
}

function handleDelete(e) {
  const button = e.target.closest('.task__delete');
  if (!button) return;
  // The list redraws after the first click, so a fast double-click would land on
  // the next task's Delete button. Ignore the second click of a double-click.
  if (e.detail > 1) return;
  update(T.deleteTask(tasks, button.closest('li').dataset.id));
}

form.addEventListener('submit', handleAdd);
input.addEventListener('input', () => showFeedback(''));
list.addEventListener('change', handleToggle);
list.addEventListener('click', handleDelete);

renderTasks(tasks);
