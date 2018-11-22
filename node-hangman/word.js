const Letter = require('./letter');

function Word(word) {
    this.word = word;
    this.display = '';
    this.letters = [];

    this.createLetters = function () {
        const chars = word.split('');
        chars.forEach(char => this.letters.push(new Letter(char)));
    }

    this.printWord = function () {
        this.display = '';
        this.letters.forEach(letter => this.display += letter.display + ' ');
        console.log(this.display + '\n');
    }

    this.containsChar = function (guessedChar) {
        let correctGuess = false;
        this.letters.forEach(letter => {
            letter.checkLetter(guessedChar);
            if (guessedChar.toLowerCase() === letter.letter.toLowerCase()) correctGuess = true;
        });
        this.printWord();      
        return correctGuess;
    }

    this.isSolved = function () {
        let revealedLetters = 0;
        this.letters.forEach(letter => letter.isGuessed ? revealedLetters++:null);
        return (revealedLetters === this.letters.length);
    }
    
    this.revealWord = function () {
        this.letters.forEach(letter => letter.revealLetter());
        this.printWord();
    }

    // Init Word
    this.createLetters();
    this.printWord();
}

module.exports = Word;