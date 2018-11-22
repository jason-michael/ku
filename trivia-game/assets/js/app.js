$(document).ready(function () {

    let game = {

        category: 9,
        difficulty: 'easy',
        numberOfQuestions: 3,
        tick: '',
        round: 0,
        timeLeft: 30,
        correctAnswers: 0,
        incorrectAnswers: 0,
        unansweredQuestions: 0,
        queryResults: [],
        question: '',
        correctAnswer: '',
        answers: [],

        /**
         * Initialize the game
         */
        init: function () {
            this.getQuestions();
        },

        /**
         * Shows the start screen
         */
        showStart: function () {

            // Reset game variables, keeps previous game's options
            this.tick = '';
            this.round = 0;
            this.timeLeft = 30;
            this.correctAnswers = 0;
            this.incorrectAnswers = 0;
            this.unansweredQuestions = 0;
            this.queryResults = [];
            this.question = '';
            this.correctAnswer = '';
            this.answers = [];

            // Animations
            $('#results-div').fadeOut('fast');
            $('#hero-text').fadeOut('fast');
            setTimeout(function () {
                $('#hero-text').text('Trivia Game');
                $('#hero-text').fadeIn('fast');
                $('#options-div, #start-button').fadeIn('fast');
            }, 300);
        },

        /**
         * Starts the countdown timer (tick)
         */
        startTimer: function () {
            this.tick = setInterval(function () {
                game.timeLeft--;
                $('#hero-text').text(game.timeLeft);

                // Progress bar animation
                $('.progress').css('width', ((game.timeLeft / 30) * 100) + '%');
                if (game.timeLeft <= 15) {
                    $('.progress').css('background', 'goldenrod');
                }
                if (game.timeLeft <= 5) {
                    $('.progress').css('background', 'firebrick');
                }

                // If time runs out
                if (game.timeLeft === -1) {
                    game.unansweredQuestions++;
                    game.showAnswer();
                }
            }, 1000);
        },

        /**
         * Stops the countdown timer
         */
        stopTimer: function () {
            clearInterval(this.tick);
        },

        /**
         * Resets the countdown timer
         */
        resetTimer: function () {
            this.timeLeft = 30;
        },

        /**
         * Requests questions from Open Trivia DB
         * Stores result in 'queryResults'
         */
        getQuestions: function () {

            // Set query url with selected game options
            queryUrl = `https://opentdb.com/api.php?amount=${game.numberOfQuestions}&category=${game.category}&difficulty=${game.difficulty}&type=multiple`;

            // Request questions from Open Trivia DB
            $.ajax({
                url: queryUrl,
                method: 'GET',
            }).done(function ({
                results
            }) {
                game.queryResults = results;

                game.showQuestion(game.round);
            });

            // Loading text
            $('#hero-text').text('Finding questions...');
        },

        /**
         * Shows question/possible answers based on given number
         */
        showQuestion: function (questionNumber) {
            // Set question/possible answers to queryResult data
            game.question = this.queryResults[questionNumber].question;
            game.correctAnswer = decodeString(this.queryResults[questionNumber].correct_answer);
            game.possibleAnswers = this.queryResults[questionNumber].incorrect_answers;


            // Clear previous question/answers
            $('#question').empty();
            $('#answers').empty();

            // Animations
            $('#questions-div').fadeIn('fast');
            $('#hero-text').fadeIn('fast');
            $('#hero-text').text('30');
            $('.progress').fadeIn('fast');

            // Show the question (decoded)
            $('#question').text('#' + (game.round+1) + ': ' + decodeString(game.queryResults[game.round].question));

            // Put correct answer into array with incorrect answers
            this.possibleAnswers.push(this.correctAnswer);

            // Randomly sort array so correct answer is not always the last one
            this.possibleAnswers.sort(function (a, b) {
                return 0.5 - Math.random()
            });

            // Add answer buttons to #answers
            $.each(game.possibleAnswers, function (index, answer) {
                let answerButton = $('<div>').addClass('text-center answer select').text(decodeString(answer));

                $('#answers').append(answerButton);
            });

            game.startTimer();
        },

        /**
         * Moves the game to the next question or shows end-game results
         */
        nextQuestion: function () {
            this.round++;

            // If there are no more questions...
            if (this.round === this.queryResults.length) {

                // Animations
                $('#questions-div').fadeOut('fast');
                $('#hero-text').fadeOut('fast');

                setTimeout(function () {
                    game.showResults();
                }, 300);
            }
            // Else go to next question
            else {
                this.resetProgressBar();
                this.resetTimer();
                this.stopTimer();
                this.showQuestion(this.round);
            }
        },

        /**
         * Shows correct or incorrect for 3 seconds
         */
        showAnswer: function (userGuessedCorrectly) {
            this.stopTimer();
            this.hideProgressBar();

            if (userGuessedCorrectly) {
                $('#hero-text').text('Correct!');
                game.correctAnswers++;
            } else {
                $('#hero-text').text('Wrong!');
                game.incorrectAnswers++;
            }

            // Flash the correct answer
            $('.answer').each(function (index, answer) {
                $(answer).removeClass('select');

                // If guessed incorrectly, change correct answer color to green
                if ($(this).text() === game.correctAnswer) {
                    $(this).css('color', 'forestgreen');
                    $(this).css('font-weight', '500');
                    $(this).addClass('flash');
                }
            });

            // Wait for 3 seconds, move to next question
            setTimeout(function () {
                game.nextQuestion();
            }, 3000);
        },

        /**
         * Show end-game results
         */
        showResults: function () {

            // Animations
            $('#hero-text').fadeIn('fast');
            $('#results-div').fadeIn('fast');

            // Update text
            $('#correct-answers-text').text(game.correctAnswers);
            $('#incorrect-answers-text').text(game.incorrectAnswers);
            $('#unanswered-answers-text').text(game.unansweredQuestions);

            // Display score % in hero text
            let percentage = Math.floor((game.correctAnswers / game.numberOfQuestions) * 100);
            $('#hero-text').text('You scored: ' + percentage + '%')
        },

        resetProgressBar: function () {
            $('.progress').css('width', '100%');
            $('.progress').css('background', 'forestgreen');
        },

        hideProgressBar: function () {
            $('.progress').css('width', '0%');
            $('.progress').css('background', 'transparent');
        }
    }

    // Default query url if no options changed at init
    let queryUrl = `https://opentdb.com/api.php?amount=${game.numberOfQuestions}&category=${game.category}&difficulty=${game.difficulty}&type=multiple`


    // Set pre-game options on .option click...
    $(document).on('click', '.option', function () {
        let clickedOption = $(this).attr('option');
        let categoryName;

        // Loop through each like option and remove the active class
        $('.option[option="' + clickedOption + '"]').each(function () {
            $(this).removeClass('active');
        });

        $(this).addClass('active');

        // Gets selected options
        $('.active').each(function () {
            // Get category
            if ($(this).attr('option') === 'category') {

                // Convert category name to category number
                switch ($(this).text()) {
                    case 'Random':
                        //9-32
                        game.category = Math.floor(Math.random() * 24) + 9;
                        categoryName = 'Random';
                        break;
                    case 'Mythology':
                        game.category = 20;
                        categoryName = 'Mythology';
                        break;
                    case 'Vehicles':
                        game.category = 28;
                        categoryName = 'Vehicle'
                        break;
                    default:
                        break;
                }
            }

            // Get difficulty
            if ($(this).attr('option') === 'difficulty') {
                game.difficulty = $(this).text().toLowerCase();
            }

            // Get number of questions
            if ($(this).attr('option') === 'questions') {
                game.numberOfQuestions = $(this).text();
            }
        });

        // Set start button text
        $('.start-text').text(`${game.numberOfQuestions} ${game.difficulty} ${categoryName} questions`)
    });

    // On start-button clicked...
    $(document).on('click', '#start-button', function () {

        // Animation
        $('#options-div, #start-button, #hero-text').fadeOut('fast');

        game.init();
    });

    // On answer button clicked...
    $(document).on('click', '.select', function () {

        // Change picked answer color based on correct or incorrect
        if ($(this).text() === game.correctAnswer) {
            game.showAnswer(true);
            $(this).css('color', 'forestgreen');
        } else {
            game.showAnswer(false);
            $(this).css('color', 'firebrick');
        }

        // Remove .select to disable click after answer has been picked
        $('.answer').each(function (index, answer) {
            $(answer).removeClass('select');

            // If guessed incorrectly, change correct answer color to green
            if ($(this).text() === game.correctAnswer) {
                $(this).css('color', 'forestgreen');
                $(this).css('font-weight', '500');
                $(this).addClass('flash');
            }
        });
    });

    // On play again clicked...
    $(document).on('click', '#restart-button', function () {

        // Animations
        $('#results-div').fadeOut('fast');
        $('#hero-text').fadeOut('fast');

        // Go back to start menu
        game.showStart();
    });

    /**
     * Decode strings (i.e. &#039; === ' && &quot; === ")
     * 
     * https://stackoverflow.com/questions/1147359/how-to-decode-html-entities-using-jquery
     */
    function decodeString(encodedStr) {
        let textArea = document.createElement('textArea');
        textArea.innerHTML = encodedStr;

        let decodedStr = textArea.value;
        textArea.remove();

        return decodedStr;
    }

});