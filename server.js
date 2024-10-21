import fastify from 'fastify';
import { DatabaseMemory } from './database-memory.js';
//import { DatabasePostgres } from './database-postgres.js';

const server = fastify();

const database = new DatabaseMemory();
//const  database = new DatabasePostgres();

// Rota POST - Criação de um novo vídeo
server.post('/videos', async(request, reply) => {
  const { title, description, duration } = request.body;

  await database.create({
    title,
    description,
    duration,
  });

  return reply.status(201).send({ message: 'Vídeo criado com sucesso!' });
});

// Rota GET - Listar todos os vídeos (com filtro de busca opcional)
server.get('/videos', async(request) => {
  const search = request.query.search; 

  console.log(search)

  const videos = await  database.list(search);
  

  return videos;
});

// Rota PUT - Atualizar um vídeo pelo ID
server.put('/videos/:id', (request, reply) => {
  const videoId = request.params.id;
  const { title, description, duration } = request.body;

  database.update(videoId, {
    title,
    description,
    duration,
  });

  return reply.status(204).send();
});

// Rota DELETE - Deletar um vídeo pelo ID
server.delete('/videos/:id', (request, reply) => {
  const videoId = request.params.id;

  database.delete(videoId);

  return reply.status(200).send({ message: 'Vídeo deletado com sucesso!' });
});

// Iniciar o servidor
server.listen({ port: 3333 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Servidor rodando em ${address}`);
});
