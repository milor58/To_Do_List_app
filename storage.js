// storage.js: save and load, with try / catch.
import { isValidTask } from './tasks.js';

const KEY = 'tasks';

// Returns true if the save worked, false if the browser refused.
export function save(tasks) {
  try {
    localStorage.setItem(KEY, JSON.stringify(tasks));
    return true;
  } catch (err) {
    console.warn('Could not save tasks', err);
    return false;
  }
}

// First visit: getItem returns null, JSON.parse(null) is null, so we return [].
// Corrupted data: JSON.parse throws, so we catch it and start fresh.
export function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    return Array.isArray(saved) ? saved.filter(isValidTask) : [];
  } catch (err) {
    console.warn('Bad saved data, starting fresh', err);
    return [];
  }
}
