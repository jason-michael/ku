function Letter(letter, display = '_', isGuessed = false) {
    this.letter = letter;
    this.display = display;
    this.isGuessed = isGuessed;

    /**
     * Immediatly reveals Letter if it's a space. 
     * This is crucial for handling a 'word' containing multiple words,
     * i.e. 'Jurassic Park'.
     */
    if (this.letter === ' ') this.revealLetter();
}

Letter.prototype.revealLetter = function () {
    this.display = this.letter;
    this.isGuessed = true;
}

Letter.prototype.checkLetter = function (guessedLetter) {
    if (this.letter.toLowerCase() == guessedLetter) this.revealLetter();
    return this.isGuessed;
}

module.exports = Letter;