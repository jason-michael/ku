const chalk = require('chalk');
const inquirer = require('inquirer');
const movie_this = require('./modules/movie_this');
const concert_this = require('./modules/concert_this');
const spotify_song = require('./modules/spotify_song');
const do_what_it_says = require('./modules/do_what_it_says');
let liriIterations = 0;

function promptLIRI() {

    printLiriTitle();

    let message = (liriIterations === 0) ? 'What would you like to do?' : 'What would you like to do now?';
    inquirer.prompt([{
        type: 'list',
        name: 'choice',
        choices: ['spotify-song', 'concert-this', 'movie-this', 'do-what-it-says', 'exit'],
        message: message
    }]).then((inqResult) => {

        console.log(inqResult.choice);

        switch (inqResult.choice) {
            case 'spotify-song':
                getUserInput('Enter a song to search for:', spotify_song.findSong);
                break;
            case 'concert-this':
                getUserInput('Enter a band to search for:', concert_this.findBand);
                break;
            case 'movie-this':
                getUserInput('Enter a move title to search for:', movie_this.findMovie);
                break;
            case 'do-what-it-says':
                do_what_it_says.executeFile(promptLIRI);
                break;
            case 'exit':
                console.log('Goodbye :(');
                setTimeout(() => {
                    console.clear();
                }, 1000);
                break;
            default:
                break;
        }

        liriIterations++;
    });
}

function getUserInput(message, callback) {
    inquirer.prompt([{
        type: 'input',
        name: 'userInput',
        message: message
    }]).then((inqRes) => {
        console.clear();
        printLiriTitle();
        callback(inqRes.userInput, promptLIRI);
    });
}

function printLiriTitle() {
    console.log(chalk.bold.green('\n-----------------<  LIRI  >------------------'));
}

promptLIRI();