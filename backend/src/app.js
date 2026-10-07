const cors = require('cors');
const express = require('express');
const { isValidTask, isValidTaskId } = require('./task-validation');

function createApp(supabase) {
  const app = express();

  app.use(cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:4200',
  }));
  app.use(express.json());

  app.get('/tasks', async (_req, res) => {
    const { data, error } = await supabase
      .from('tasks')
      .select('id, title, description, status')
      .order('id', { ascending: true });

    if (error) throw error;
    res.json(data);
  });

  app.post('/tasks', async (req, res) => {
    if (!isValidTask(req.body)) {
      return res.status(400).json({ error: 'A title, description, and valid status are required.' });
    }

    const task = {
      title: req.body.title.trim(),
      description: req.body.description,
      status: req.body.status,
    };
    const { data, error } = await supabase
      .from('tasks')
      .insert(task)
      .select('id, title, description, status')
      .single();

    if (error) throw error;
    res.status(201).json(data);
  });

  app.put('/tasks/:id', async (req, res) => {
    const id = Number(req.params.id);
    if (!isValidTaskId(id)) {
      return res.status(400).json({ error: 'Task ID must be a positive integer.' });
    }
    if (!isValidTask(req.body)) {
      return res.status(400).json({ error: 'A title, description, and valid status are required.' });
    }

    const task = {
      title: req.body.title.trim(),
      description: req.body.description,
      status: req.body.status,
    };
    const { data, error } = await supabase
      .from('tasks')
      .update(task)
      .eq('id', id)
      .select('id, title, description, status')
      .maybeSingle();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Task not found.' });
    res.json(data);
  });

  app.delete('/tasks/:id', async (req, res) => {
    const id = Number(req.params.id);
    if (!isValidTaskId(id)) {
      return res.status(400).json({ error: 'Task ID must be a positive integer.' });
    }

    const { data, error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)
      .select('id')
      .maybeSingle();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Task not found.' });
    res.status(204).end();
  });

  app.use((error, _req, res, _next) => {
    console.error('Task API error:', error);
    const status = Number.isInteger(error.status) && error.status >= 400 && error.status < 500
      ? error.status
      : 500;
    res.status(status).json({
      error: status === 500 ? 'An unexpected server error occurred.' : 'Invalid request.',
    });
  });

  return app;
}

module.exports = { createApp };
