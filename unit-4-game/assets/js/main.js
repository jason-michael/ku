$(document).ready(function () {
    var player;
    var playerCard;
    var opponent;
    var opponentCard;
    var enemiesArray;

    class Character {
        constructor(keyword, rank, name, team, health, attack, counterattack, bonus, soundArray, image) {
            this.keyword = keyword;
            this.rank = rank;
            this.name = name;
            this.team = team;
            this.health = health;
            this.attack = attack;
            this.counterattack = counterattack;
            this.bonus = bonus;
            this.soundArray = soundArray;
            this.image = 'assets/img/characters/' + keyword + '.png';
        }
    }

    var carmine = new Character('carmine', 1, 'Carmine', 'cog', 120, 10, 15, 10, soundArray_carmine);
    var dizzy = new Character('dizzy', 2, 'Dizzy', 'cog', 100, 18, 5, 18, soundArray_dizzy);
    var cole = new Character('cole', 3, 'Cole', 'cog', 150, 7, 20, 7, soundArray_cole);
    var marcus = new Character('marcus', 4, 'Marcus', 'cog', 180, 5, 25, 5, soundArray_marcus);
    var wretch = new Character('wretch', 1, 'Wretch', 'locust', 120, 10, 15, 10, soundArray_locust);
    var drone = new Character('drone', 2, 'Drone', 'locust', 100, 18, 5, 18, soundArray_locust);
    var sniper = new Character('sniper', 3, 'Sniper', 'locust', 150, 7, 20, 7, soundArray_locust);
    var raam = new Character('raam', 4, 'Raam', 'locust', 180, 5, 25, 5, soundArray_locust);
    var cogCharacters = [carmine, dizzy, cole, marcus];
    var locustCharacters = [wretch, drone, sniper, raam];

    addCharacterCards($('#characters-cog'), cogCharacters);
    addCharacterCards($('#characters-locust'), locustCharacters);

    // Initial game layout
    $('#battle-area, #actions-box, .restart-btn').hide();
    $('.health-text, .health-icon').removeClass('d-inline').hide();
    showModal('Pick a character');

    // On character-card clicked...
    $(document).on('click', '.character-card.select', function () {

        if (player != null && opponent == null) {
            opponentCard = $(this);
            opponentCard.removeClass('select');
            opponent = opponentCard.data();

            playCharacterSound(opponent);
            moveCard(opponentCard, $('#opponent-box'));
            showActionsBox();

            clearActionText();
            setActionText(1, '', opponent.name + ' steps up');
        }

        if (player == null) {
            playerCard = $(this);
            playerCard.removeClass('select');
            player = playerCard.data();

            getEnemies(player);
            playCharacterSound(player);
            moveCard(playerCard, $('#player-box'));
            addCharacterCards($('#enemies-box'), enemiesArray);
            showBattleArea();

            $('.health-text, .health-icon').removeClass('d-inline').hide();

            music_gears.play();
        }
    });

    // On Attack clicked...
    $(document).on('click', '#attack-btn', function () {
        attack();
    });

    // On restart button clicked...
    $(document).on('click', '.restart-btn', function () {
        location.reload();
    });

    function attack() {

        if (opponent == null) showModal('Pick a new opponent');

        // Player's turn
        if (opponent != null && player.health > 0 && opponent.health > 0) {
            opponent.health -= player.attack;
            updateCard(opponent, opponentCard);

            setActionText(1, '', 'You attacked ' + opponent.name + ' for ' + player.attack + ' damage');

            // Opponent's death            
            if (player.health > 0 && opponent.health <= 0) {
                setActionText(3, 'forestgreen', 'You defeated ' + opponent.name);
                removeEnemyFromArray();
                opponent = null;
                opponentCard.remove();
            }

            if (enemiesArray.length === 0) {
                showModal('You win');
                showRestartButton();
            }
        }

        // Opponent's turn
        if (opponent != null && opponent.health > 0 && player.health > 0) {
            player.health -= opponent.counterattack;
            player.attack += player.bonus;
            updateCard(player, playerCard);

            setActionText(2, '', opponent.name + ' attacked you for ' + opponent.counterattack + ' damage');

            // Player's death
            if (opponent.health > 0 && player.health <= 0) {
                playerCard.remove();
                showModal('You died');
                showRestartButton();
                setActionText(3, 'red', opponent.name + ' defeated you');
            }
        }

        function updateCard(character, characterCard) {
            characterCard.find('.health-text').text(character.health);
        }
    }

    function getEnemies(player) {
        var spliceStart = player.rank - 1;
        enemiesArray = (player.team === 'cog') ? locustCharacters : cogCharacters;
        enemiesArray.splice(spliceStart, 1);

        // Shuffle enemies for added difficulty when picking an opponent
        enemiesArray.sort(function(a, b){return 0.5 - Math.random()});
    }

    function removeEnemyFromArray() {
        for (var i = 0; i < enemiesArray.length; i++) {
            if (enemiesArray[i].keyword === opponent.keyword) {
                enemiesArray.splice(i, 1);
            }
        }
    }

    function playCharacterSound(character) {
        character.soundArray[Math.floor(Math.random() * character.soundArray.length)].play();
    }

    function clearActionText() {
        $('#ptext1, #ptext2, #ptext3').text('');
    }

    function setActionText(textNum, color, text) {
        $('#ptext' + textNum).text(text);
        $('#ptext' + textNum).css('color', color);
    }

    function showActionsBox() {
        setTimeout(function () {
            $('#actions-box').fadeIn('slow');
            $('#player-box, #opponent-box').find('.health-text, .health-icon').addClass('d-inline').fadeIn('fast');
        }, 800);
    }

    function showBattleArea() {
        $('#character-selection').fadeOut('fast');

        setTimeout(function () {
            $('#battle-area').fadeIn('fast');
            showModal('Pick an opponent');
        }, 400);
    }

    function showRestartButton() {
        $('#attack-btn').hide();
        $('.restart-btn').show();
    }

    function showModal(text) {
        $('.modal-title').text(text);
        $('#mainModal').modal('show');
    }

    function moveCard(card, toElement) {
        $(card).fadeOut('fast');
        setTimeout(function () {
            $(toElement).append(card);
            $(card).fadeIn('fast');
        }, 400);
    }

    // Create a card for each character in given array
    function addCharacterCards(element, arr) {
        $.each(arr, function (indexInArray) {
            element.append(createCharacterCard(arr[indexInArray], indexInArray));
        });
    }

    // Build card for given character, returns character card html
    function createCharacterCard(character) {

        var card = $('<div>').addClass('card character-card select m-3 ' + character.team);
        var img = $('<img>').addClass('card-img-top').attr('src', character.image);
        var body = $('<div>').addClass('card-body p-2');
        var pName = $('<p>').addClass('card-title').text(character.name);
        var pHealth = $('<p>').addClass('card-text health-text d-inline').text(character.health);
        var heartIcon = $('<i>').addClass('health-icon fas fa-heart mr-2 d-inline');

        body.append(pName);
        body.append(heartIcon);
        body.append(pHealth);
        card.append(img);
        card.append(body);

        // Attach character to card
        card.data(character);

        return card;
    }
});