const express = require('express');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const app = express();

app.use(express.json());

const moviesRoutes = require('./routes/movies');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Movies API',
      version: '1.0.0',
      description: 'API for managing movies',
    },
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

async function main() {
  await mongoose.connect('mongodb://mongo:27017/mydb');
  app.get('/', (req, res) => {
    res.send('Hello World!');
  });
  app.use('/movies', moviesRoutes);
  app.listen(3000, () => console.log('Server running on port 3000'));
}

main().catch(console.error);