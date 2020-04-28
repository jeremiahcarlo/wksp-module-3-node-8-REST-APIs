const menu = document.getElementById('menu');
const gameboard = document.getElementById('gameboard');
const letters = document.querySelector('.letters');
const startBtn = document.getElementById('start-game');
const word = document.getElementById('word');
const progress = document.getElementById('game-progress');
const newGameBtn = document.getElementById('new-game');
const arrayLetters = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z'
];

// Number of letters in the alphabet
const NB_LETTERS_ALPHABET = 26;

// Save the progress of the word
let mysteriousWord;
let currentWordId;
let guesses = 5;

const startGame = () => {
  hide(menu);
  show(gameboard);
  progress.innerHTML = `You have ${guesses} guesses remaining!`;
  show(progress);
  newGameBtn.style.visibility = 'visible';
  // Display all letters
  for (let index = 0; index < NB_LETTERS_ALPHABET; index++) {
    let letter = document.createElement('button');
    letter.innerHTML = arrayLetters[index];
    letter.id = arrayLetters[index].toLowerCase();
    letters.appendChild(letter);
  }

  // When all letters are on the screen, start the event listener
  letters.addEventListener('click', handleCheckLetter);
};

const restartGame = () => {
  letters.innerHTML = '';
  guesses = 5;
  newGameBtn.style.visibility = 'hidden';
  hide(gameboard);
  hide(progress);
  show(menu);
};

const getWord = () => {
  fetch('/hangman/word', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })
    .then(res => res.json())
    .then(word => {
      mysteriousWord = Array(word.letterCount).fill('_');
      currentWordId = word.id;
      updateWord(mysteriousWord);
    });
};

const checkLetter = letter => {
  if (letter) {
    fetch(`/hangman/guess/${currentWordId}/${letter}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
        const { status, index } = data; // Deconstructs data into two variables
        const btn = document.getElementById(`${letter}`);
        if (status === 'success') {
          mysteriousWord.forEach(wordLetter => {
            data.index.forEach(
              letterIndex => (mysteriousWord[letterIndex] = letter)
            );
          });

          // Remove the letter
          if (btn) letters.removeChild(btn);
        } else {
          guesses--;
          btn.classList.add('flip');
          btn.setAttribute('disabled', 'true');
        }
        // Display the updated word
        updateProgress(guesses);
        updateWord(mysteriousWord);
        checkWinLost();
      })
      .catch(err => console.log(err));
  }
};

// Handle Functions
const handleStartGame = event => getWord();
const handleCheckLetter = event => checkLetter(event.target.id);

// Utility functions
const hide = element => (element.style.display = 'none');
const show = element => (element.style.display = 'block');
const displayStatus = status => (word.innerHTML = status);
const updateProgress = guesses =>
  (progress.innerText = `You have ${guesses} guesses remaining!`);

const updateWord = array => {
  document.getElementById('word').textContent = '';
  array.forEach(
    element => (document.getElementById('word').innerText += element)
  );
};

const checkWinLost = () => {
  // If word doesnt contain any _ add a new word
  if (!mysteriousWord.includes('_')) {
    setTimeout(() => {
      letters.innerHTML = '';
      word.innerHTML = '';
      handleStartGame();
      startGame();
    }, 1000);
  }
  // If player has not guesses remaining
  if (guesses === 0) {
    letters.removeEventListener('click', handleCheckLetter);
    displayStatus('You Lost!');
    setTimeout(() => {
      restartGame();
    }, 2000);
  }
};

startBtn.addEventListener('click', handleStartGame);