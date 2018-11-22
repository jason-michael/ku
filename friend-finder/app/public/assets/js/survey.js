// UI Elements
const userImage = document.getElementById('user-image');
const submitBtn = document.getElementById('submit-survey');
const nameInput = document.getElementById('name-input');
const surveyForm = document.getElementById('survey-form');
const imageInput = document.getElementById('image-input');
const matchModal = document.getElementById('match-modal');
const progressBar = document.getElementById('progress-bar');
const questionsArea = document.getElementById('questions');

const placeholderImage = 'https://mbtskoudsalg.com/images/avatar-icon-png-3.png';
let userScores = [];

const questionList = [
    '1. Arrays should start at 1.',
    '2. HTML is a programming language.',
    '3. MS Paint > Photoshop.',
    '4. Github is Facebook for programmers.',
    '5. Slack is just IRC with skins.',
];

//======================================
// FUNCTIONS
//======================================

// ! This function is called immediately.
(function addQuestionsToForm() {
    questionList.forEach((question, index) => {
        questionsArea.innerHTML += `
        <div class="field">
            <label class="label">${question}</label>
            <div class="control">
                <label class="radio">
                    <input type="radio" name="q${index}" value="1">
                    <i class="rdo-ico far fa-angry fa-2x"></i>
                </label>
                <label class="radio">
                    <input type="radio" name="q${index}" value="2">
                    <i class="rdo-ico far fa-frown fa-2x"></i>
                </label>
                <label class="radio">
                    <input type="radio" name="q${index}" value="3">
                    <i class="rdo-ico far fa-meh fa-2x"></i>                                
                </label>
                <label class="radio">
                    <input type="radio" name="q${index}" value="4">
                    <i class="rdo-ico far fa-smile fa-2x"></i>
                </label>
                <label class="radio">
                    <input type="radio" name="q${index}" value="5">
                    <i class="rdo-ico far fa-laugh fa-2x"></i>                                
                </label>
            </div>
        </div>
        <hr>`;
    });
})();


function addRadioValueToUserScores(radioName, score) {
    /*
        All radio names will have a leading 'q' followed by the question number,
        so we have to remove the leading 'q' to get the question number.
    */
    let questionNumber = Array.from(radioName).splice(1);

    userScores[questionNumber] = parseInt(score);
}


function toggleMatchModal(match) {

    if (matchModal.classList.contains('is-active')) {
        matchModal.classList.remove('is-active');
        return window.location.assign('/');
    }

    document.getElementById('match-image').setAttribute('src', match.photo);
    document.getElementById('match-name').innerHTML = match.name + '!';
    matchModal.classList.toggle('is-active');
}


function getRandomImage() {
    let url = `https://picsum.photos/600/?image=${Math.floor(Math.random() * 1000)}`;

    imageInput.value = url;
    userImage.setAttribute('src', url);

    /*
        This is required to update the progress bar correctly
        after clicking the random image button. 
    */
    imageInput.dispatchEvent(new Event('keyup'));
}


function updateProgressBar(current, max) {
    if ((current / max) === 1) progressBar.style.background = '#00a58c';
    progressBar.style.width = 100 * (current / max) + '%';
}


function validateSurvey() {
    const fields = [
        surveyForm['name-input'].value.trim(),
        surveyForm['image-input'].value.trim(),
        surveyForm['q0'].value.trim(),
        surveyForm['q1'].value,
        surveyForm['q2'].value,
        surveyForm['q3'].value,
        surveyForm['q4'].value,
    ];

    let validFields = 0;

    fields.forEach(field => {
        if (field !== '' && field !== null) validFields++;
    });

    updateProgressBar(validFields, fields.length);

    // If a field becomes invalid, disable the submit button.        
    if (validFields === fields.length) {
        submitBtn.disabled = false;
        submitBtn.classList.remove('is-outlined');
    }
    // If all fields are valid, enable the submit button.
    else {
        submitBtn.disabled = true;
        submitBtn.classList.add('is-outlined');
    }

    return (validFields === fields.length);
}


//======================================
// EVENT LISTENERS
//======================================
nameInput.addEventListener('keyup', () => validateSurvey());

imageInput.addEventListener('keyup', () => {
    let source = (imageInput.value.trim()) ? imageInput.value : placeholderImage;

    userImage.setAttribute('src', source);
    validateSurvey();
});

const radioBtns = document.querySelectorAll('input[type=radio]');

radioBtns.forEach(radioBtn => radioBtn.addEventListener('change', () => {
    addRadioValueToUserScores(radioBtn.name, radioBtn.value);
    validateSurvey();
}));

surveyForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Only POST if the survey is completely filled out.
    if (validateSurvey()) {
        let newUser = {
            name: nameInput.value,
            photo: imageInput.value,
            scores: userScores
        }
    
        $.post('/api/friends', newUser, match => {
            toggleMatchModal(match)
        });        
    }
});