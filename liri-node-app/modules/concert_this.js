require('dotenv').config();
const keys = require('../modules/keys');
const util = require('./utility');
const chalk = require('chalk');
const moment = require('moment');
const request = require('request');
const bandsintownID = keys.bandsInTown.id;
let concert;
let concerts;

function findBand(bandName, callback) {
    const _bandName = ((bandName) ? bandName : 'metallica');
    const url = `https://rest.bandsintown.com/artists/${_bandName}/events?app_id=${bandsintownID}`;

    request(url, (error, response, body) => {

        if (!error && response.statusCode === 200 && util.requestValidated(body)) {

            const results = JSON.parse(body);

            concerts = [];
            for (var i = 0; i < results.length && i < 3; i++) {
                addConcertToArray(results[i]);
            }

            printConcerts(_bandName);
            callback();

        } else if (!util.requestValidated(body)) {

            console.log('Bad search.');
            return callback();

        } else {

            console.log(error);
            return callback();
        }
    });

    util.appendCommandLog('concert-this', _bandName);
}

function addConcertToArray(dataSource) {
    concert = {
        venue: {
            name: dataSource.venue.name,
            country: dataSource.venue.country,
            region: dataSource.venue.region,
            city: dataSource.venue.city,
        },
        dateTime: moment(dataSource.datetime).format('MMM Do, YYYY @ hh:mm a'),
        artist: dataSource.lineup[0],
        lineup: dataSource.lineup.slice(1, this.length).join(', '),
    }

    // If a region value exists, prepend a comma.
    if (concert.venue.region != '') {
        concert.venue.region = ', ' + concert.venue.region;
    }

    concerts.push(concert);
}

function printConcerts(bandName) {
    if (concerts.length > 0) {

        console.log(`\n\n\rHere are some upcoming concerts for ${chalk.bold.green(concerts[0].artist)}:\n\n`);

        concerts.forEach((concert) => {

            console.log(`
                \rLineup:   ${chalk.bold.green(concert.artist)}, ${concert.lineup}
                \rCountry:  ${chalk.bold.cyan(concert.venue.country)}
                \rCity:     ${chalk.cyan(`- ${concert.venue.city}${concert.venue.region}`)}
                \rWhen:     ${concert.dateTime}
                \rVenue:    ${concert.venue.name}
                \r-----\n`);
        });
        
    } else {

        console.log(`No concerts found for "${chalk.bold.green(bandName)}".`);
        
    }
}

module.exports = { findBand };