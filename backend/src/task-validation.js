const TASK_STATUSES = new Set(['TODO', 'DOING', 'DONE']);

function isValidTask(task) {
  return task !== null
    && typeof task === 'object'
    && !Array.isArray(task)
    && typeof task.title === 'string'
    && task.title.trim().length > 0
    && typeof task.description === 'string'
    && TASK_STATUSES.has(task.status);
}

function isValidTaskId(id) {
  return Number.isSafeInteger(id) && id > 0;
}

module.exports = { isValidTask, isValidTaskId };
