// ==== VARIABLES ====
var alphabet = [
    "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
var hiddenWord;
var wordToGuess;
var charArr;
var wins = 0;  
var losses = 0;
var guessesLeft = 6;
var guessedLetters = "";
var lastWord = "";
var currentVehicle;
var previousVehicle;

// To trigger mobile keyboard...
var mobileKey = document.getElementById("hiddenWord-text").addEventListener("click", showKeyboard);

// ==== OBJECTS ====
class Vehicle {
    constructor(keyword, make, model, year, msrp, engine, horsepower, torque, topSpeed, zeroToSixty, imgPath) {
        this.keyword = keyword.toLowerCase();
        this.make = make;
        this.model = model;
        this.year = year;
        this.msrp = msrp;
        this.engine = engine
        this.horsepower = horsepower;
        this.torque = torque;
        this.topSpeed = topSpeed;
        this.zeroToSixty = zeroToSixty;
        this.imgPath = "assets/images/cars/" + keyword + ".jpg";
    }
}

// Vehicles to be guessed
var v01 = new Vehicle('saleen', 'Saleen', "S7 Twin Turbo", "2005-2009", "$550,000", "7.0L V8", "750", "700", "248 mph", "3s");
var v02 = new Vehicle('viper', 'Dodge', 'Viper', '1996-2002', "$69,725", '8.0L V-10', '420', '490', '197 mph', '3.9s');
var v03 = new Vehicle('lamborghini', 'Lamborghini', 'Aventador', '2011-present', "$399,500", '6.5L V12', '700', '507', '217 mph', '3s');
var v04 = new Vehicle('nissan', 'Nissan', 'GT-R', '2007-present', "$96,820", '3.8L V6', '485', '588', '196 mph', '3.4s');
var v05 = new Vehicle('diablo', 'Lamborghini', 'Diablo', '1990-2001', "$222,000", '6.0L V12', '550', '457', '202 mph', '4.5s');
var v06 = new Vehicle('lexus', 'Lexus', 'LFA', '2010-2012', "$375,000", '4.8L V10', '553', '354', '202 mph', '3.6s');
var v07 = new Vehicle('acura', 'Acura', 'NSX', '1990-2005', "$84,000", '3.0L, 3.2L V6', '252-290', '210-224', '168 mph', '4.7s');
var v08 = new Vehicle('ford', 'Ford', 'GT', '2003-2006', "$139,995", '5.4L V8', '550', '500', '205 mph', '3.4s');
var v09 = new Vehicle('bugatti', 'Bugatti', 'Veyron SuperSport', '2010-present', "$1,990,000", '8.0L W16', '1001', '922', '267 mph', '2.4s');
var v10 = new Vehicle('mclaren', 'McLaren', 'F1', '1992-1998', "$815,000", '6.1L V12 (BMW)', '680', '520', '240 mph', '3.1s');

// Array of all vehicles
var vehicles = [v01, v02, v03, v04, v05, v06, v07, v08, v09];

// ==== GAME ====
// Start a new game
newGame();

// If it's the first time the game has been ran (0 wins and 0 losses), hide car info jumbotron
if ((wins == 0) || (losses == 0)){
    document.getElementById("car-info").style.visibility = "hidden";
}

// On key press (key up)
document.onkeyup = function (event) {

    // Get the pressed key
    key = event.key;
    key = key.toLowerCase();

    // Run the game
    runGame(key);
}

// ==== FUNCTIONS ====
function hideWord(wordToHide) {
    hiddenWord = "";
    for (var i = 0; i < wordToHide.length; i++) {
        hiddenWord = hiddenWord + "_ ";
    }
    return hiddenWord;
}

function reavealLetter(index) {
    var hiddenArr = hiddenWord.split(" ");
    hiddenArr[index] = charArr[index];
    hiddenWord = hiddenArr.join(' ');

    checkIfSolved(hiddenWord);

    //Breaks if deleted...
    document.getElementById("hiddenWord-text").innerHTML = hiddenWord;
}

function checkIfSolved(string) {
    // not solved
    if (string.includes("_")) {
    }
    // solved
    else {
        wins++;
        newGame();

        document.getElementById("wins-text").innerHTML = wins;

        // Show 'car-info' jumbotron
        showCar(previousVehicle);
    }

}

function newGame() {
    if(typeof wordToGuess !== "undefined"){
        // lastWord = wordToGuess;
        previousVehicle = currentVehicle;
        lastWord = previousVehicle.keyword;
        showCar(previousVehicle);
    }

    // Show instructions text animation
    var startAccents = document.getElementsByClassName("startAccent");
    for (var i = 0; i < startAccents.length; i++) {
        startAccents[i].style.visibility = "visible";
    }

    guessesLeft = 6;
    guessedLetters = "";
    pickWord();
    hideWord(wordToGuess);
    refresh();
}

function runGame(guess){
    // Hide the animated 'press key to start..etc' angle brackets
    var startAccents = document.getElementsByClassName("startAccent");
    for (var i = 0; i < startAccents.length; i++) {
        startAccents[i].style.visibility = "hidden";
    }

    // get the key pressed, change to lowercase
    // key = event.key;
    // key = key.toLowerCase();

    // Limit input to alphabet...
    if (alphabet.includes(guess)) {

        // check if key pressed matches letters in 'wordToGuess'
        if (wordToGuess.includes(guess)) {

            // Split the word into an array of chars
            charArr = wordToGuess.split('');

            // For each matching letter, reveal it
            charArr.forEach(function (element, i) {
                if (element == guess) {
                    reavealLetter(i);
                }
            });
        }
        // if no matching letters found...
        else {
            if (guessedLetters.includes(guess)) {
                
            }
            else {
                guessesLeft--;
                guessedLetters = (guessedLetters + guess + " ");
                document.getElementById("guessesLeft-text").innerHTML = guessesLeft;
                document.getElementById("lettersGuessed-text").style.textTransform = "uppercase";

            }

            // if no guesses left, increase loss count and start a new game
            if (guessesLeft == 0) {
                losses++;
                newGame();
            }


            // Wrong guess anim: (warning flash)
            // Set game-jumbotron background to red
            document.getElementById("game-jumbotron").style.background = "rgba(255, 0, 0, 0.66)";
            // after 100ms change color back
            setTimeout(function(){
                document.getElementById("game-jumbotron").style.background = "rgba(0, 0, 0, 0.66)";
            }, 100);
        }
    }
    else {
        // Wrong guess anim: (warning flash)
        // Set game-jumbotron background to red
        document.getElementById("game-jumbotron").style.background = "rgba(255, 0, 0, 0.66)";
        // after 100ms change color back
        setTimeout(function () {
            document.getElementById("game-jumbotron").style.background = "rgba(0, 0, 0, 0.66)";
        }, 100);
    }

    refresh();

}

function pickWord() {
    currentVehicle = vehicles[Math.floor(Math.random() * vehicles.length)];
    wordToGuess = currentVehicle.keyword;
    return wordToGuess;
}

function refresh() {
    // Hidden word
    document.getElementById("hiddenWord-text").innerHTML = hiddenWord;

    // Wins
    document.getElementById("wins-text").innerHTML = wins;

    // Losses
    document.getElementById("losses-text").innerHTML = losses;

    //Guesses left
    document.getElementById("guessesLeft-text").innerHTML = guessesLeft;

    // Guessed letters
    document.getElementById("lettersGuessed-text").innerHTML = guessedLetters;

    // Last word
    document.getElementById("lastWord-text").innerHTML = lastWord;
}

function showCar(Vehicle) {
    document.getElementById("car-info").style.visibility = "visible";    
    document.getElementById("carImage").outerHTML = "<img id='carImage' src='" + Vehicle.imgPath + "' alt='image'>";
    document.getElementById("carMake-text").innerHTML = Vehicle.make;
    document.getElementById("carModel-text").innerHTML = Vehicle.model;
    document.getElementById("carYear-text").innerHTML = Vehicle.year;
    document.getElementById("carMsrp-text").innerHTML = Vehicle.msrp;
    document.getElementById("carEngine-text").innerHTML = Vehicle.engine;
    document.getElementById("carHorsepower-text").innerHTML = Vehicle.horsepower;
    document.getElementById("carTorque-text").innerHTML = Vehicle.torque;
    document.getElementById("carTopSpeed-text").innerHTML = Vehicle.topSpeed;
    document.getElementById("carZeroToSixty-text").innerHTML = Vehicle.zeroToSixty;

    // Car-Info fade-in animation:
    // add class to trigger css anim
    document.getElementById("car-info").classList.add("carInfoAnim");
    // remove class to anim can be triggered again
    setTimeout(function() {
        document.getElementById("car-info").classList.remove("carInfoAnim");
    }, 1000);
}   

// On hidden-word click (intended for use on mobile, doesn't work well...)
function showKeyboard(){
    var guess = prompt("Enter a single letter:");
    runGame(guess);
}



