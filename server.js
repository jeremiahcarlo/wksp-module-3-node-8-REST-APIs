'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const PORT = process.env.PORT || 8000;

// Load Routes
const Clients = require('./routes/clients');
const Hangman = require('./routes/hangman');


app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

// Middleware
app.use(morgan('tiny'));
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

// Set Routes Middlewares
app.use('/', Clients);
app.use('/', Hangman);


app.get('/', (req, res) => {
  res.send(
    `<a href="/hangman">Hangman</a>`
  );
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));