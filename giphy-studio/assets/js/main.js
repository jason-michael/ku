$(document).ready(() => {

    let isMobileLayout = ($(document).width() < 900 ? true : false);

    //#region Objects
    let user = {
        userTopics: ['trippy', 'seamless', 'seamless trippy', 'funny', 'america'],
        userTopicsSort: 'asc'
    }

    let giphy = {
        apiKey: 'm566fJHpzoc43NlM4cgIJggpzm6QYn0M',
        queryResults: '',
        topic: '',

        searchGiphy: function (searchTerm, offset) {

            giphy.topic = searchTerm.trim().toLowerCase();
            giphy.topic = giphy.topic.replace(' ', '+');

            let queryUrl = `https://api.giphy.com/v1/gifs/search?q=${giphy.topic}&api_key=${giphy.apiKey}&limit=10&offset=${offset}`;

            giphy.getGifsFromAPI(queryUrl, 'gallery');
        },

        getGifsFromAPI: function (queryUrl, section) {

            $.ajax({
                    url: queryUrl,
                    method: 'GET'
                })
                .done(function (response) {
                    giphy.queryResults = response.data;
                    giphy.addGifsToSection(section);
                });
        },

        createGifCard: function (config) {

            config.topic = config.topic.replace('+', ' ');

            let card = $('<div>').addClass('card').data(config.details).attr('data-topic', config.topic).attr('data-isFavorite', 'false');
            card.html(`
                <img src="${config.imgSrc}" alt="" class="card-image" data-state="still">
                <div class="card-body">
                    <p>${config.topic}</p>
                    <p>${config.rating.toUpperCase()}</p>
                    <div class="card-buttons">
                        <button class="favorite"><i class="far fa-heart"></i></button>
                    </div>
                </div>
            </div>`);

            return card;
        },

        addGifsToSection: function (section) {

            $.each(this.queryResults, function (index, gif) {

                let cardConfig = {
                    imgSrc: gif.images.fixed_height_still.url,
                    rating: gif.rating,
                    details: gif,
                    topic: giphy.topic
                }
                let newGifCard = giphy.createGifCard(cardConfig);

                $('#' + section).prepend(newGifCard);
                $('#' + section).scrollTop(0);

                updateContentCount();
            });
        }
    }

    let sidebar = {

        addTopicButton: function (topic) {

            let topicButton = $(
                `<button class="btn user-btn" data-value="${topic}" data-offset="0">` +
                `${topic}` +
                `<i class="fa fa-times user-button-delete"></i>` +
                `</button>`);

            $('#user-topics-list').prepend(topicButton);
            $('#user-buttons-count-text').text(user.userTopics.length);

        },

        checkForExistingTopic: function (topic) {

            topic = topic.trim().toLowerCase();

            if (user.userTopics.indexOf(topic) === -1) {

                user.userTopics.push(topic.toLowerCase());

                sidebar.addTopicButton(topic);

            } else {

                sidebar.flashButton(topic);

            }

            $('#search-bar').val('');

        },

        flashButton: function (buttonText) {

            $('.user-btn').each(function () {

                let button = $(this);

                if (button.text() == buttonText) {

                    setTimeout(function () {

                        button.removeClass('flash');

                    }, 500);

                    button.addClass('flash');
                    button.focus();

                    $('#search-bar').focus();
                }
            });
        },

        searchTopic: function (topic) {

            sidebar.checkForExistingTopic(topic);
            sidebar.flashButton(topic);

            giphy.searchGiphy(topic);

            $('#user-topics-list').scrollTop(0);

            if (isMobileLayout) $('.sidebar-content').toggle();

        }
    }
    //#endregion objects

    //#region Initialization

    $.each(user.userTopics, (index) => {
        sidebar.addTopicButton(user.userTopics[index]);
    });

    //#endregion init

    //#region Events

    // SEARCH: Search button clicked
    $(document).on('click', '#search-button', function () {

        let searchTerm = $('#search-bar').val().trim();

        if (searchTerm !== '') {

            sidebar.searchTopic(searchTerm);

        }
    });

    // SEARCH: Enter pressed inside search bar
    $(document).on('keyup', '#search-bar', function (event) {

        let searchTerm = $(this).val().trim();

        if (searchTerm !== '' && event.keyCode === 13) {

            sidebar.searchTopic(searchTerm);

        }
    });



    // USER BUTTON: on click
    $(document).on('click', '.user-btn', function (e) {
        /**
         * If we don't compare target and currentTarget
         * new gifs will be added when the user clicks on the 
         * 'delete' icon on user buttons
         */
        if (e.target === e.currentTarget) {

            let dataOffset = parseInt($(this).attr('data-offset'));

            giphy.searchGiphy($(this).text(), dataOffset);

            dataOffset += 10;
            $(this).attr('data-offset', dataOffset);

            showContentSection('gallery');
            $('#gallery').scrollTop(0);

        }

        if (isMobileLayout) $('.sidebar-content').toggle();

    });

    // USER BUTTON -> DELETE: on click
    $(document).on('click', '.user-button-delete', function () {

        // Get the item and remove it from the userTopics array
        let item = $(this).parent().attr('data-value');
        user.userTopics.splice(user.userTopics.indexOf(item), 1);

        // Remove the button from the DOM
        $(this).parent().remove();
        $('#user-buttons-count-text').text(user.userTopics.length);
    });

    // USER BUTTON FILTERS -> DELETE: on click
    $(document).on('click', '#user-topics-trash', function () {

        // Delete all array items and user buttons
        user.userTopics = [];
        $('#user-topics-list').empty();
        $('#user-topics-sort').css('color', '#999');
        $('#user-buttons-count-text').text(user.userTopics.length);
    });

    // USER BUTTON FILTERS -> SORT: on click
    $(document).on('click', '#user-topics-sort', function () {

        $(this).css('color', '#0077ff');

        switch (user.userTopicsSort) {
            case 'asc':
                user.userTopics.sort();
                user.userTopicsSort = 'des';
                $('#user-topics-sort > i').toggleClass('fa fa-sort-alpha-up fa fa-sort-alpha-down');
                break;

            case 'des':
                user.userTopics.sort();
                user.userTopics.reverse();
                user.userTopicsSort = 'asc';
                $('#user-topics-sort > i').toggleClass('fa fa-sort-alpha-up fa fa-sort-alpha-down');
                break;

            default:
                break;
        }

        $('#user-topics-list').empty();

        // Re-adds user topics to buttons, now sorted
        $.each(user.userTopics, (index) => {

            sidebar.addTopicButton(user.userTopics[index]);

        });
    });



    // GIF CARD: on click
    $(document).on('click', '.card-image', function () {
        toggleGifAnimation($(this).parent());
    });

    // GIF CARD -> FAVORITE: on click
    $(document).on('click', '.favorite', function () {
        let card = $(this).parent().parent().parent();
        toggleFavorite(card);
    });

    // GIF CARD -> DOWNLOAD: on click
    $(document).on('click', '.download', function () {
        let card = $(this).parent().parent().parent();
    });



    // CONTENT BUTTON: on click
    $(document).on('click', '.content-btn', function () {

        let data_content = $(this).attr('data-content');

        showContentSection(data_content);

        if (isMobileLayout) $('.sidebar-content').toggle();

    });

    // CONTENT BUTTON -> TRENDING: on click
    $(document).on('click', '.content-btn[data-content="trending"]', function () {

        let offset = parseInt($(this).attr('data-offset'));
        let queryUrl = `https://api.giphy.com/v1/gifs/trending?api_key=${giphy.apiKey}&offset=${$(this).attr('data-offset')}`;

        giphy.topic = 'Trending';
        giphy.getGifsFromAPI(queryUrl, 'trending');

        offset += 50;

        $(this).attr('data-offset', offset);
    });

    // CONTENT BUTTON -> RANDOM: on click
    $(document).on('click', '.content-btn[data-content="random"]', function () {

        let offset = parseInt($(this).attr('data-offset'));
        let queryUrl = `https://api.giphy.com/v1/gifs/search?api_key=${giphy.apiKey}&q=random&offset=${$(this).attr('data-offset')}`;

        giphy.topic = 'Random';
        giphy.getGifsFromAPI(queryUrl, 'random');

        offset += 25;

        $(this).attr('data-offset', offset);
    });


    // MENU: on click (mobile-only)
    $('.menu').on('click', () => {

        $('.sidebar-content').toggle();

    });

    // MEDIA QUERY -> SET isMobileLayout true/false
    $(window).resize(function () {
        let _width = $(document).width();

        isMobileLayout = (_width < 900 ? true : false);

        if (!isMobileLayout) {
            $('.sidebar-content').show();
        } else {
            $('.sidebar-content').hide();
        }
    });

    // #endregion events

    //#region Functions

    function showContentSection(section) {

        // Remove current active, set to clicked button
        $('.active').removeClass('active');
        $('.content-btn[data-content="' + section + '"').toggleClass('active');

        // Hide all main content sections, show clicked section
        $('.main-content, #header-text').hide();
        $('#' + section + ', #header-text').fadeIn('fast');
        // $('#header-text').fadeIn('slow')
        $('#header-text').text(section);

        // Change sidebar border color to match button clicked
        let borderColor =  $('.content-btn[data-content="' + section + '"]').find('i').css('color');
        $('#sidebar').css('border-color', borderColor);
    }

    function toggleGifAnimation(card) {

        let cardImage = card.find('.card-image');
        let currentState = cardImage.attr('data-state');
        let img_src = {
            still: card.data().images.fixed_height_still.url,
            animated: card.data().images.fixed_height.url
        }

        if (currentState === 'still') {
            cardImage.attr('src', img_src.animated);
            cardImage.attr('data-state', 'animated');
            card.addClass('card-animated');
        } else {
            cardImage.attr('src', img_src.still);
            cardImage.attr('data-state', 'still');
            card.removeClass('card-animated');
        }
    }

    function toggleFavorite(card) {

        if (card.attr('data-isFavorite') === 'false') {
            card.attr('data-isFavorite', 'true');
            card.find('.fa-heart').toggleClass('far fas').css('color', 'red');
            $('#favorites').prepend(card);
        } else {
            card.attr('data-isFavorite', 'false');
            card.find('.fa-heart').toggleClass('far fas').css('color', 'white');
            $('#gallery').prepend(card);
        }

        updateContentCount();
    }

    function updateContentCount() {

        let sections = ['gallery', 'favorites', 'random', 'trending'];

        $.each(sections, (index, section) => {
            let sectionItems = $('#' + section).children();
            $('.content-btn[data-content="' + section + '"] > span').text(sectionItems.length);
        })
    }
    //#endregion functions
});