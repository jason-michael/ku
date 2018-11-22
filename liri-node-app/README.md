# LIRI node application
LIRI (Language Interpretation and Recognition Interface) is a command line node app that takes in parameters and gives you back data.

# Index
- [Commands](#commands)
- [Concert This](#concert-this)
- [Do What It Says](#do-what-it-says)
- [Exit LIRI](#exit-liri)
- [Issues](#issues)
- [Movie This](#movie-this)
- [Spotify Song](#spotify-song)
- [Starting LIRI](#starting-liri)


# Starting LIRI

Run `node liri` inside the directory containing `liri.js`. LIRI will then prompt the user to choose a command.

![liri-start](/images/liri-start.gif?raw=true)


    Users must add their own Spotify ID/secret, OMBD api key, and BandsInTown ID to .env to use this app.

[Back to top](#index)

# Commands

LIRI currently accepts 4 commands:

- `spotify-song` returns song info from a song name using the node-spotify-api.
- `concert-this` returns concert info for a given artist/band from the BandsInTown API.
- `movie-this` returns movie info from OMDB for a given title.
- `do-what-it-says` interprets the text from a `.txt` file and tries to convert it to a command/query and run it.
    - This is currently very limited on acutal interpretation, commands and queries must match a certain format.

[Back to top](#index)

# Logging
Each command name and search term are logged to a `.txt` file on command execution.

[Back to top](#index)


# spotify-song

`spotify-song` can handle 2 types of arguments: blank and search term.

### Blank 
The search term will default to "The Sign" if left blank.
![spotify-song-default](/images/spotify-song-default.gif?raw=true)

### Search term
All arguments provided will create the search term. Quotation is not required.
![spotify-song-search](/images/spotify-song-search.gif?raw=true)

## Error Handling
Searches that return null will show a "No results for \<search-term>" message and restart LIRI.
![spotify-song-noresult](/images/spotify-song-noresult.gif?raw=true)

[Back to top](#index)

# concert-this

`concert-this` can handle 2 types of arguments: blank and search term.

### Blank 
The search term will default to "Metallica" if left blank.
![concert-this-default](/images/concert-this-default.gif?raw=true)

### Search term
All arguments provided will create the search term. Quotation is not required.
![concert-this-search](/images/concert-this-search.gif?raw=true)

## Error Handling
Searches that return null will show a "bad search" message and restart LIRI.
![concert-this-noresult](/images/concert-this-noresult.gif?raw=true)

[Back to top](#index)

# movie-this

`movie-this` can handle 2 types of arguments: blank and search term.

### Blank 
The search term will default to "Mr Nobody" if left blank.
![movie-this-default](/images/movie-this-default.gif?raw=true)

### Search term
All arguments provided will create the search term. Quotation is not required.

*Feature: ratings text is colored based on their rating.*
![movie-this-search](/images/movie-this-search.gif?raw=true)

## Error Handling
In progress. See [issues](#issues)

[Back to top](#index)

# do-what-it-says

`do-what-it-says` will read text from a `.txt` file and try to interpret it into a LIRI command. This is currently very limited on acutal interpretation as commands and queries must match a certain format to work.

![dwis-1](/images/dwis-1.gif?raw=true)

*This shows the source being changed and LIRI running the updated command and query.*
![dwis-2](/images/dwis-2.gif?raw=true)

[Back to top](#index)


# Exit LIRI
Select `Exit` from the prompt or use `ctrl+c/cmd+c` to exit LIRI.
![exit](/images/exit.gif?raw=true)

# Issues
- `movie-this` error handling
    - Working on a non-hacky solution to validate results from OMDB. This has been difficult due to the format of the results.
