const fs = require('fs');
const logPath = './log.txt';

function requestValidated (body) {
    // Todo: This is a hack..need to find better solution.
    return !(body[1] === 'w');
}

function appendCommandLog(command, input) {

    let dataToAppend = `${command}: ${input}\n`;

    fs.appendFile(logPath, dataToAppend, (error) => {

        if (error) console.log(error);
        
    });
}

module.exports = { requestValidated, appendCommandLog };