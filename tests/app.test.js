const request = require('supertest');
const app = require('../src/app');

describe('API de Tarefas - Testes de Validação', () => {

  it('Deve criar uma nova tarefa com sucesso [POST /tasks]', async () => {
    const response = await request(app)
      .post('/tasks')
      .send({
        title: 'Tarefa de Teste',
        description: 'Descrição do teste',
        priority: 'Alta'
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toBe('Tarefa de Teste');
    expect(response.body.priority).toBe('Alta');
  });

  it('Deve retornar erro 400 se o "title" estiver faltando [POST /tasks]', async () => {
    const response = await request(app)
      .post('/tasks')
      .send({
        description: 'Tentativa de criar sem título'
      });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('O campo "title" é obrigatório.');
  });

  it('Deve listar todas as tarefas [GET /tasks]', async () => {
    const response = await request(app).get('/tasks');

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

});
