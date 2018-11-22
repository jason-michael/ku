//💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩
//💩 Need to put your own firebase info below:                            💩
//💩                                                                      💩
//💩 Initialize Firebase                                                  💩
//💩 var config = {                                                       💩
//💩     apiKey: "AIzaSyBvgl1K2sTEtEbIoiiwjo5m0PXZR7ysU64",               💩
//💩     authDomain: "train-scheduler-1f6cf.firebaseapp.com",             💩
//💩     databaseURL: "https://train-scheduler-1f6cf.firebaseio.com",     💩
//💩     projectId: "train-scheduler-1f6cf",                              💩
//💩     storageBucket: "",                                               💩
//💩     messagingSenderId: "753104171617"                                💩
//💩 };                                                                   💩  
//💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩

firebase.initializeApp(config);

let database = firebase.database();

database.ref('/trains').once('value', function(snapshot) {
    
    snapshot.forEach(function(childSnap){
        let _train = {
            name: childSnap.val().name,
            destination: childSnap.val().destination,
            firstTrainTime: childSnap.val().firstTrainTime,
            frequency: childSnap.val().frequency
        }

        addTrainToTable(_train, childSnap.key);

    });
});

let time = {
    currentTime: moment().format('hh:mm'),
    minutesAway: null,

    getNextArrival: function (startTime, freq) {

        let _startTime = moment(startTime, 'HH:mm').subtract(1, 'days');
        let _diffTime = moment().diff(moment(_startTime), 'minutes');
        let _remainder = _diffTime % freq;
        let _minutesAway = freq - _remainder;
        let _nextArrival = moment().add(_minutesAway, 'minutes').format('HH:mm');

        time.minutesAway = _minutesAway;

        return _nextArrival;
    },
}

$('#train-submit').on('click', (e) => {
    e.preventDefault();

    let _train = {
        name: $('#name-input').val().trim(),
        destination: $('#destination-input').val().trim(),
        firstTrainTime: $('#first-train-time-input').val().trim(),
        frequency: $('#frequency-input').val().trim()
    }

    addTrainToFirebase(_train);
    addTrainToTable(_train);

    $('#name-input').val('');
    $('#destination-input').val('');
    $('#first-train-time-input').val('');
    $('#frequency-input').val('');
});

$(document).on('click', '.delete-train-btn', function () {
    let _keyToRemove = $(this).parent().parent().attr('data-key');
    database.ref('/trains').child(_keyToRemove).remove();
    $(this).parent().parent().remove();
});

function addTrainToTable(train, key) {

    let _train = {
        nextArrival: time.getNextArrival(train.firstTrainTime, train.frequency),
        minutesAway: time.minutesAway
    }

    let trainRow = $(`
        <tr class="train-row" data-key="${key}">
            <td scope="row">${train.name}</td>
            <td>${train.destination}</td>
            <td>${train.frequency}</td>
            <td>${_train.nextArrival}</td>            
            <td>${_train.minutesAway}</td>
            <td><button class="btn delete-train-btn"><i class="fas fa-trash"></i></button></td>
        </tr>
    `);

    $('#table-body').prepend(trainRow);
}

function addTrainToFirebase(train) {
    let _key;
    let _train = train;
    database.ref('/trains').push(_train).then((snap) => {
        _key = snap.key;
    });
    
    return _key;
}