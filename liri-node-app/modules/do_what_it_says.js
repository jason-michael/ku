const fs = require('fs');
const chalk = require('chalk');
const movie_this = require('./movie_this');
const concert_this = require('./concert_this');
const spotify_song = require('./spotify_song');
const path = './random.txt';

function executeFile(callback) {
    console.clear();

    fs.readFile(path, "utf8", (error, data) => {
        if (!error) {
            let _data = data.split(',');
            let action = _data.shift();
            let query = (_data.shift()).replace(/"/g, '');

            runCommand(action, query, callback);

        } else {
            console.log(error);
            callback();
        }
    });
}

function runCommand(action, query, callback) {
    console.log(chalk.bold.green(`Running ${chalk.inverse(action)} on ${chalk.bold.inverse(query)}...`));

    switch (action) {
        case 'spotify-song':
            spotify_song.findSong(query, callback);
            break;
        case 'concert-this':
            concert_this.findBand(query, callback);
            break;
        case 'movie-this':
            movie_this.findMovie(query, callback);
            break;
        case 'exit':
            console.log('Goodbye :(');
            setTimeout(() => {
                console.clear();
            }, 1000);
            break;
        default:
            console.log('I don\'t recognize that command...');
            break;
    }
}

module.exports = { executeFile };