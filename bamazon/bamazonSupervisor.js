const util = require('./utility');
const bamazon = require('./bamazon');
const inquirer = require('inquirer');

bamazon.connect().then(promptSupervisorOptions);

//  SUPERVISOR OPTIONS
//------------------------------------------------------------------|
function promptSupervisorOptions() {

    util.printTitle('Supervisor Portal', 44);

    inquirer.prompt([{
        name: 'option',
        type: 'list',
        choices: [
            'View Product Sales by Department',
            'Create New Department',
            'Exit'
        ],
        message: 'Pick an option:'
    }]).then(answer => {

        console.clear();

        switch (answer.option) {
            case 'View Product Sales by Department':
                bamazon.viewSalesByDept()
                    .then(promptSupervisorOptions);
                break;
            case 'Create New Department':
                bamazon.viewSalesByDept()
                    .then(promptNewDept);
                break;
            default:
                bamazon.endConnection();
                break;
        }
    });
}

//  ADD NEW DEPARTMENT
//------------------------------------------------------------------|
function promptNewDept() {

    util.printTitle('Add New Department', 42);

    inquirer.prompt([{
            type: 'input',
            name: 'name',
            message: 'Name: '
        },
        {
            type: 'input',
            name: 'overhead',
            message: 'Overhead: '
        }
    ]).then(req => {

        if (req.name.trim() === '' || req.overhead.trim() === '') {
            return util.inputError('Error: fields cannot be blank.', promptNewDept);
        }

        if (isNaN(req.overhead)) {
            return util.inputError('Error: Overhead must be a number.', promptNewDept);
        }

        console.clear();

        bamazon.addNewDept(req.name.trim(), parseFloat(req.overhead.trim()).toFixed(2))
            .then(promptSupervisorOptions);
    });
}