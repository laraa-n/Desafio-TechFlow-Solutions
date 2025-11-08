const express = require('express');
const banco = require('./banco');
const app = express();

const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('API rodando!');
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

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});