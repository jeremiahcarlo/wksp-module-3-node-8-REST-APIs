const express = require('express');
const router = express.Router();
const Datastore = require('nedb');

// Import words from data folder
const Words = require('../data/words');

// Create Database
const db = new Datastore({ filename: 'Database/users' });

// Load Database
db.loadDatabase();

// GET Word Route
router.get('/hangman/guess/:wordId/:letter', (req, res) => {
  const { wordId, letter } = req.params;
  let currentWord = Words.find(element => element.id === parseInt(wordId));
  if (currentWord.word.includes(letter)) {
    const arrayIndex = [];
    for (let index = 0; index < currentWord.word.length; index++)
      if (currentWord.word[index] === letter) arrayIndex.push(index);
    res.status(200).send({ status: 'success', index: arrayIndex });
  } else res.status(200).send({ status: 'error' });
});

router.get('/hangman/word', (req, res) => {
  const randomNumber = Math.floor(Math.random() * Words.length);
  res.status(200).send({
    id: Words[randomNumber].id,
    letterCount: Words[randomNumber].word.length
  });
});

router.get('/hangman/:wordId', (req, res) => {
  db.findOne(
    { email: req.body.email, password: req.body.password },
    (err, user) => {
      if (user) res.status(200).send(Words[req.params.wordId - 1]);
      else res.status(401).send('Access Denied!'); 
    }
  );
});

module.exports = router;