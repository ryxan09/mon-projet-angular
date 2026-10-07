const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { createApp } = require('./app');
const { normalizeSupabaseUrl } = require('./supabase-url');
const { isValidTask, isValidTaskId } = require('./task-validation');

function createMemorySupabase() {
  const tasks = [];
  let nextId = 1;

  return {
    from() {
      let operation = 'select';
      let values;
      let id;

      const query = {
        select() { return this; },
        order() { return this; },
        insert(row) { operation = 'insert'; values = row; return this; },
        update(row) { operation = 'update'; values = row; return this; },
        delete() { operation = 'delete'; return this; },
        eq(_column, value) { id = value; return this; },
        single() { return this; },
        maybeSingle() { return this; },
        then(resolve, reject) {
          const result = Promise.resolve().then(() => {
            if (operation === 'insert') {
              const task = { id: nextId++, ...values };
              tasks.push(task);
              return { data: task, error: null };
            }
            if (operation === 'update') {
              const task = tasks.find(item => item.id === id);
              if (task) Object.assign(task, values);
              return { data: task || null, error: null };
            }
            if (operation === 'delete') {
              const index = tasks.findIndex(item => item.id === id);
              const [task] = index < 0 ? [] : tasks.splice(index, 1);
              return { data: task ? { id: task.id } : null, error: null };
            }
            return { data: [...tasks], error: null };
          });
          return result.then(resolve, reject);
        },
      };

      return query;
    },
  };
}

describe('task validation', () => {
  it('accepts task fields and known statuses', () => {
    assert.equal(isValidTask({ title: 'Plan', description: '', status: 'TODO' }), true);
    assert.equal(isValidTask({ title: 'Ship', description: 'Done', status: 'DONE' }), true);
  });

  it('rejects missing fields, blank titles, and invalid statuses', () => {
    assert.equal(isValidTask(null), false);
    assert.equal(isValidTask({ title: ' ', description: '', status: 'TODO' }), false);
    assert.equal(isValidTask({ title: 'Plan', description: '', status: 'BLOCKED' }), false);
    assert.equal(isValidTask({ title: 'Plan', status: 'TODO' }), false);
  });

  it('accepts only positive safe integer IDs', () => {
    assert.equal(isValidTaskId(1), true);
    assert.equal(isValidTaskId(0), false);
    assert.equal(isValidTaskId(1.5), false);
    assert.equal(isValidTaskId(Number.MAX_SAFE_INTEGER + 1), false);
  });
});

describe('Supabase URL normalization', () => {
  it('accepts a project URL or a copied REST endpoint URL', () => {
    assert.equal(
      normalizeSupabaseUrl('https://project-ref.supabase.co/rest/v1/'),
      'https://project-ref.supabase.co',
    );
    assert.equal(
      normalizeSupabaseUrl('https://project-ref.supabase.co/'),
      'https://project-ref.supabase.co',
    );
  });
});

describe('task API', () => {
  it('supports task CRUD responses and rejects invalid input', async () => {
    const server = createApp(createMemorySupabase()).listen(0, '127.0.0.1');
    await new Promise(resolve => server.once('listening', resolve));
    const address = server.address();
    const apiUrl = `http://127.0.0.1:${address.port}`;

    try {
      const invalid = await fetch(`${apiUrl}/tasks`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ title: '', description: '', status: 'TODO' }),
      });
      assert.equal(invalid.status, 400);

      const createdResponse = await fetch(`${apiUrl}/tasks`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ title: 'Plan', description: '', status: 'TODO' }),
      });
      assert.equal(createdResponse.status, 201);
      const createdTask = await createdResponse.json();
      assert.equal(createdTask.id, 1);

      const fetched = await fetch(`${apiUrl}/tasks`);
      assert.deepEqual(await fetched.json(), [createdTask]);

      const updated = await fetch(`${apiUrl}/tasks/1`, {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ title: 'Ship', description: '', status: 'DONE' }),
      });
      assert.equal((await updated.json()).title, 'Ship');

      const deleted = await fetch(`${apiUrl}/tasks/1`, { method: 'DELETE' });
      assert.equal(deleted.status, 204);
      assert.deepEqual(await (await fetch(`${apiUrl}/tasks`)).json(), []);
      assert.equal((await fetch(`${apiUrl}/tasks/1`, { method: 'DELETE' })).status, 404);
    } finally {
      await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
    }
  });
});
