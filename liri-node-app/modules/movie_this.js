require('dotenv').config();
const keys = require('../modules/keys');
const util = require('./utility');
const chalk = require('chalk');
const request = require('request');
const omdbKey = keys.omdb.key;
let movie;

function findMovie(movieTitle, callback) {
    const _movieTitle = ((movieTitle) ? movieTitle : 'Mr Nobody');

    let url = `http://www.omdbapi.com/?apikey=${omdbKey}&t=${_movieTitle}&type=movie&r=json&plot=short`;
    request(url, (error, response, body) => {

        if (!error && response.statusCode === 200 && util.requestValidated(body)) {

            const result = JSON.parse(body);

            setMovie(result);
            printMovieInfo(_movieTitle, movie);

            callback();

        } else if (!util.requestValidated(body)) {

            console.log('Bad search.');
            return callback();
        } else {

            console.log(error);
            return callback();
        }
    });

    util.appendCommandLog('movie-this', _movieTitle);
}

function setMovie(sourceData) {
    movie = {
        title: sourceData.Title,
        year: sourceData.Year,
        plot: sourceData.Plot,
        actors: sourceData.Actors,
        country: sourceData.Country,
        language: sourceData.Language,
        rating: {
            imdb: sourceData.Ratings[0].Value,
            rottenTomatoes: sourceData.Ratings[1].Value,
        },
    };
}

function printMovieInfo(search, movie) {
    // Set IMDB ratings colors based on the rating
    let imdbRating = parseFloat(movie.rating.imdb.substring(0, 3));
    let imdbColor = ((imdbRating > 5) ? chalk.green : chalk.red);

    // Set Rotten Tomatoes ratings colors based on the rating
    let rotTomRating = parseFloat(movie.rating.rottenTomatoes.replace('%', ''));
    let rotTomColor = ((rotTomRating > 50) ? chalk.green : chalk.red);

    console.log(`\n\n\rHere's what I found for "${chalk.bold.green(search)}":`);

    console.log(`
    Title:     ${chalk.bold.green(movie.title)}
    Year:      ${movie.year}
    Rating:    IMDB: ${imdbColor(movie.rating.imdb)}, RottenTomatoes: ${rotTomColor(movie.rating.rottenTomatoes)}
    Country:   ${movie.country}
    Actors:    ${movie.actors}
    Plot:      ${movie.plot}
    -----\n`);
}

module.exports = { findMovie };