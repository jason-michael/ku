#!/usr/bin/env node

const Word = require('./word');
const WordList = require('./wordlist');
const chalk = require('chalk');
const inquirer = require('inquirer');
const titleText = `\n// Node Hangman: American Muscle\n`;
let wordToGuess;
let guessesLeft = 6;

function promptGuess() {
    inquirer.prompt([{
        name: 'character',
        type: 'input',
        message: 'Guess a letter:'
    }]).then(answer => {
        console.clear();
        console.log(chalk.bold.green(titleText));

        if (!wordToGuess.containsChar(answer.character.toLowerCase())) guessesLeft--;

        if (guessesLeft === 0) {
            console.clear();
            console.log(chalk.bold.green(titleText));
            wordToGuess.revealWord();
            console.log(chalk.bold.red('You ran out of guesses.\n'));
            return promptRestart();
        }

        if (!wordToGuess.isSolved()) {
            console.log(`Guesses left: ${chalk.bold.green(guessesLeft)}\n`);
            promptGuess();
        } else {
            console.log(chalk.bold.green('CORRECT!\n'));
            return promptRestart();
        }
    });
}

function promptRestart() {
    inquirer.prompt([{
        name: 'shouldRestart',
        type: 'confirm',
        message: 'Play again?'
    }]).then(answer => answer.shouldRestart ? startGame() : console.clear());
}

function startGame() {
    console.clear();
    console.log(chalk.bold.green(titleText));
    guessesLeft = 6;
    wordToGuess = new Word(WordList[Math.floor(Math.random() * WordList.length)]);
    console.log(`Guesses left: ${chalk.bold.green(guessesLeft)}\n`);
    promptGuess();
}

startGame();