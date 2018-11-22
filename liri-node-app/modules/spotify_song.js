require('dotenv').config();
const keys = require('../modules/keys');
const util = require('./utility');
const chalk = require('chalk');
const Spotify = require('node-spotify-api');
const spotify = new Spotify(keys.spotify);
let track;
let tracks;

function findSong(songName, callback) {
    const _songName = ((songName) ? songName : 'the sign');
    spotify.search({
        type: 'track,artist',
        query: _songName,
        limit: 3
    }, function (error, songInfo) {

        if (error) {
            callback();
            return console.log(error);
        }

        /* Needed for when less than 3 tracks are returned. */
        const results = ((songInfo.tracks.items.length < 3) ?
            songInfo.tracks.items.length : 3);

        if (results > 0) {

            tracks = [];
            for (let i = 0; i < results; i++) {
                addTrackToArray(songInfo.tracks.items[i]);
            }

            printSongs(_songName);

        } else {

            console.log(`No results for "${chalk.bold.green(songName)}"`);
            
        }

        callback();
    });

    util.appendCommandLog('spotify-song', _songName);
}

function addTrackToArray(dataSource) {
    track = {
        artist: dataSource.album.artists[0].name,
        song: dataSource.name,
        album: dataSource.album.name,

        // Use an alternative path for preview_url if the first doesn't exist.
        preview: ((dataSource.preview_url) ?
            dataSource.preview_url :
            dataSource.album.artists[0].external_urls.spotify),
    }

    tracks.push(track);
}

function printSongs(songName) {
    console.log(`\n\n\rHere are the top results for "${chalk.bold.green(songName)}":\n\n`);

    tracks.forEach((track) => {

        console.log(`
            \rArtist:    ${chalk.bold.green(track.artist)}
            \rSong:      ${track.song}
            \rAlbum:     ${track.album}
            \rPreview:   ${chalk.blue(track.preview)}
            \r-----
        `);
        
    });
}

module.exports = { findSong };