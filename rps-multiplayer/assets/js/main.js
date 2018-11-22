/* Global */
let database;
let userPlayer;
let userPlayerNum;
let game = {
    player1: {
        name: null,
        pick: null,
        wins: 0,
        losses: 0
    },
    player2: {
        name: null,
        pick: null,
        wins: 0,
        losses: 0
    },
    draws: 0,
    chatText: ''
}

initGame();

// #region Firebase Listeners

// Get player1 from Firebase.
database.ref('/players/player1/name').on('value', function (snapshot) {
    game.player1.name = snapshot.val();
    updatePlayerInfo(game.player1.name, 'player1');
});

// Get player2 from Firebase.
database.ref('/players/player2/name').on('value', function (snapshot) {
    game.player2.name = snapshot.val();
    updatePlayerInfo(game.player2.name, 'player2');
});

// Show results card if spectator.
database.ref('/players/').on('value', function () {
    if (game.player1.name != null && game.player2.name != null) {
        $('#results-card').show();
        updateResultsText();
    }
});

// Get chat.
database.ref('/chat').on('child_added', function (snapshot) {
    game.chatText += snapshot.val().user + ': ' + snapshot.val().text + '\n';
    $('#chat-area').val(game.chatText);
});

// Get player picks.
database.ref('/picks').on('child_added', function (snapshot) {
    if (snapshot.key === 'player1') game.player1.pick = snapshot.val().pick;
    if (snapshot.key === 'player2') game.player2.pick = snapshot.val().pick;

    if (game.player1.pick != null && game.player2.pick != null) {
        resetPlayerStyles();
        comparePicks(game.player1.pick, game.player2.pick);
        showResults();
    }
});

// Remove the entire database and reload the page (reset game).
database.ref('/reset').on('child_added', function () {
    database.ref().remove();
    document.location.reload();
});
// #endregion Firebase Listeners

// #region Events
// On Rock/Paper/Scissors clicked...
$('.player-btn').on('click', function (e) {
    e.preventDefault();

    resetPlayerStyles();

    userPlayerNum = $(this).attr('data-player');
    let playerPick = $(this).attr('data-pick');
    let userColorClass;

    if ((userPlayerNum === '1') ? userColorClass = 'primary' : userColorClass = 'danger');

    $(this).addClass('btn-' + userColorClass);

    database.ref('picks/' + userPlayer).set({
        pick: playerPick
    });
});

// On Join clicked...
$('#join-game-submit').on('click', function (e) {
    e.preventDefault();

    let nameInput = $('#join-name-input').val().trim();

    // If input is not blank or spaces
    if (nameInput !== '') {

        // If the user has already joined, show an alert
        if (userPlayer === 'player1' || userPlayer === 'player2') {
            alert('You\'ve already joined as ' + userPlayer);
        }

        // Set player to player1 or player2, whichever is empty
        if (game.player1.name == null) {

            setPlayer('player1', nameInput, game.player1.name);

        } else if (game.player1.name != null && game.player2.name == null && userPlayer !== 'player1') {

            setPlayer('player2', nameInput, game.player2.name);

            // Move player 2 card to top
            let player1Card = $('#player1-card');
            let player2Card = $('#player2-card');
            $('#player1-col').append(player2Card);
            $('#player2-col').append(player1Card);

        } else if (game.player1.name != null && game.player2.name != null &&
            userPlayer == null || userPlayer == undefined) {

            alert('Game full. Please try again when a player leaves.');

        }

        /**
         * Game will not flow correctly if the input is not 
         * cleared after player joined.
         */
        $('#join-name-input').val('');
    }
});

// On Chat Submit clicked...
$('#chat-submit').on('click', function (e) {
    e.preventDefault();

    let chatInput = $('#chat-input').val().trim();

    if (chatInput != '') {

        let user;
        if (userPlayer == null || userPlayer == undefined) {
            user = 'Anonymous';
        } else {
            switch (userPlayer) {
                case 'player1':
                    user = game.player1.name;
                    break;
                case 'player2':
                    user = game.player2.name;
                    break;
                default:
                    break;
            }
        }

        let message = {
            user: user,
            text: chatInput
        }

        database.ref('/chat').push(message);
    }

    $('#chat-input').val('');
});

// On Reset Game clicked...
$('#reset-firebase').on('click', function () {
    resetGame();
});

// Remove current player from firebase if they refresh page or close browser
window.onbeforeunload = function () {

    // Prevent removal of database on spectator unload
    if (userPlayer != null || userPlayer != undefined) {

        database.ref('/players/' + userPlayer).remove();

        $('#' + userPlayer + 'name-text').toggleClass('bg-success text-light');

        switch (userPlayer) {
            case 'player1':
                database.ref('/chat').push({
                    user: 'RPS',
                    text: `${userPlayer} has left the game.`
                });
                game.player1.name = null;
                game.player1.pick = null;
                break;
            case 'player2':
                database.ref('/chat').push({
                    user: 'RPS',
                    text: `${userPlayer} has left the game.`
                });
                game.player2.name = null;
                game.player2.pick = null;
                break;
            default:
                break;
        }
    }

    // Reset the game if no player exists.
    if (game.player1.name == null && game.player2.name == null) {
        resetGame();
    }
}
// #endregion Events

// #region Functions

/**
 * Initialize the game.
 */
function initGame() {

    // Hide cards, these will be shown when a player joins the game.
    $('#player1-card').hide();
    $('#player2-card').hide();
    $('#results-card').hide();

    // Firebase Initialization
    var config = {
        apiKey: "AIzaSyCBzWv2VNVrFsm2oeKnBNJ612VR6VlTkB4",
        authDomain: "rps-multiplayer-52b0b.firebaseapp.com",
        databaseURL: "https://rps-multiplayer-52b0b.firebaseio.com",
        projectId: "rps-multiplayer-52b0b",
        storageBucket: "rps-multiplayer-52b0b.appspot.com",
        messagingSenderId: "1078317553539"
    };
    firebase.initializeApp(config);
    database = firebase.database();
}

/**
 * This function will push a dummy object to
 * '/reset' in Firebase and trigger removal of
 * entire Firebase DB and reload the page for
 * all users.
 */
function resetGame() {
    let dummy = 'x';
    database.ref('/reset').push(dummy);
}

/**
 * When a user enters their name and joins a game,
 * this function will assign them to player1 or player2 based on
 * which player spot is empty.
 * 
 * @param {string} player Specify either 'player1' or 'player2'.
 * @param {string} playerName The player's chosen name.
 * @param {*} playerNameObject Either game.player1.name or game.player2.name.
 */
function setPlayer(player, playerName, playerNameObject) {
    userPlayer = player;
    playerNameObject = playerName;
    let userColor = (userPlayer === 'player1') ? 'bg-primary' : 'bg-danger';

    database.ref('/players/' + userPlayer + '/name').set(playerNameObject);

    $('#' + userPlayer + '-name-text')
        .toggleClass(`${userColor} text-light`)
        .text(playerNameObject + ' (You)');

    $('#' + userPlayer + '-card').show();

    $('#join-game-card').hide();

    database.ref('/chat').push({
        user: 'RPS',
        text: `${playerNameObject} has joined the game.`
    });
}

/**
 * Compares players' picks and detemines a winner.
 * 
 * @param {string} pick1 First player's pick. 
 * @param {string} pick2 Second player's pick.
 */
function comparePicks(pick1, pick2) {

    // If player 1 wins...
    if (
        (pick1 == 'rock' && pick2 == 'scissors') ||
        (pick1 == 'paper' && pick2 == 'rock') ||
        (pick1 == 'scissors' && pick2 == 'paper')) {
        game.player1.wins++;
        game.player2.losses++;
        $('#player1-results-col').addClass('round-winner');
    }

    // If player 2 wins...
    if (
        (pick1 == 'rock' && pick2 == 'paper') ||
        (pick1 == 'paper' && pick2 == 'scissors') ||
        (pick1 == 'scissors' && pick2 == 'rock')) {
        game.player1.losses++;
        game.player2.wins++;
        $('#player2-results-col').addClass('round-winner');
    }

    updateResultsText();
    startNewRound();
}

/**
 * Updates the win/loss stats text for both players.
 */
function updateResultsText() {
    $('#player1-wins').text('Wins: ' + game.player1.wins);
    $('#player1-losses').text('Losses: ' + game.player1.losses);
    $('#player1-last-pick').text('Last pick: ' + game.player1.pick);

    $('#player2-wins').text('Wins: ' + game.player2.wins);
    $('#player2-losses').text('Losses: ' + game.player2.losses);
    $('#player2-last-pick').text('Last pick: ' + game.player2.pick);
}

/**
 * This is used to get and set player info
 * pulled from Firebase, used in the Firebase Listeners.
 * 
 * @param {*} playerObj e.g. game.player1.name
 * @param {string} playerID Either 'player1' or 'player2'.
 */
function updatePlayerInfo(playerObj, playerID) {
    if (playerObj != null) {
        $('#' + playerID + '-name').text(playerObj);
        $('#results-card').show();
    } else {
        $('#' + playerID + '-name').text('waiting on player...');
        $('#results-card').find('.stats').addClass('collapse');
        resetGameStats();
        resetPlayerStyles();
        updateResultsText();
    }
}

/**
 * Resets local and Firebase player picks.
 */
function startNewRound() {
    game.player1.pick = null;
    game.player2.pick = null;
    database.ref('/picks').remove();
}

/**
 * Resets all game stats, i.e. player wins and losses.
 */
function resetGameStats() {
    game.player1.wins = 0;
    game.player1.losses = 0;
    game.player2.wins = 0;
    game.player2.losses = 0;
}

/**
 * Resets player button colors and 
 * border around round winner.
 */
function resetPlayerStyles() {

    // Reset color for each button
    $('.player-btn').each(function () {
        $(this).removeClass('btn-primary btn-danger');
    });

    // Remove border around winner's stats
    $('#player1-results-col').removeClass('round-winner');
    $('#player2-results-col').removeClass('round-winner');
}

function showResults() {
    $('#results-card').find('.stats').removeClass('collapse');
}
// #endregion Functions