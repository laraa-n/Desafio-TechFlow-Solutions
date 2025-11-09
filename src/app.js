const express = require('express');
const banco = require('./banco');
const app = express();

app.use(express.json());

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send('API da TechFlow Solutions rodando!');
});

app.get('/tasks', (req, res) => {
  try {
    const allTasks = banco.getAllTasks();

    res.status(200).json(allTasks);

  } catch (error) {
    res.status(500).json({ error: 'Erro interno ao buscar as tarefas.' });
  }
});

app.post('/tasks', (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'O campo "title" é obrigatório.' });
    }

    const newTask = banco.createTask(title, description);

    res.status(201).json(newTask);

  } catch (error) {
    res.status(500).json({ error: 'Erro interno ao criar a tarefa.' });
  }

});

app.put('/tasks/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    const updates = req.body;

    const updatedTask = banco.updateTask(id, updates);

    if (updatedTask) {
      res.status(200).json(updatedTask);
    } else {
      res.status(404).json({ error: 'Tarefa não encontrada.' });
    }

  } catch (error) {
    res.status(500).json({ error: 'Erro interno ao atualizar a tarefa.' });
  }
});

app.delete('/tasks/:id', (req, res) => {
  try {
    const { id } = req.params;

    const deletedTask = banco.deleteTask(id);

    if (deletedTask) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Tarefa não encontrada.' });
    }

  } catch (error) {
    res.status(500).json({ error: 'Erro interno ao deletar a tarefa.' });
  }
});

module.exports = app;