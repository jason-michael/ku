const util = require('./utility');
const bamazon = require('./bamazon');
const inquirer = require('inquirer');

bamazon.connect().then(promptManagerOptions);

//  MANAGER OPTIONS
//------------------------------------------------------------------|
function promptManagerOptions() {

    util.printTitle('Manager Portal', 42);

    inquirer.prompt([{
        name: 'option',
        type: 'list',
        choices: [
            'View all products',
            'View low stock',
            'Add stock',
            'Add new product',
            'Delete product',
            'Exit'
        ],
        message: 'Pick an option:'
    }]).then(answer => {
        console.clear();
        switch (answer.option) {
            case 'View all products':
                bamazon.viewProducts().then(promptManagerOptions);
                break;
            case 'View low stock':
                bamazon.viewLowInventory().then(promptManagerOptions);
                break;
            case 'Add stock':
                bamazon.viewProducts().then(promptAddToStock);
                break;
            case 'Add new product':
                promptNewProduct();
                break;
            case 'Delete product':
                bamazon.viewProducts().then(promptDeleteProduct);
                break;
            default:
                bamazon.endConnection();
                break;
        }
    });
}

//  ADD STOCK TO PRODUCT
//------------------------------------------------------------------|
function promptAddToStock() {

    util.printTitle('Add Stock', 40);

    inquirer.prompt([{
            type: 'input',
            name: 'itemId',
            message: 'Item ID: '
        },
        {
            type: 'input',
            name: 'qty',
            message: 'QTY to add: '
        }
    ]).then(req => {

        // Validate ID input
        if (req.itemId.trim() === '') {
            return util.inputError('Item ID cannot be blank.', () => {
                bamazon.viewProducts().then(promptManagerOptions);
            });
        }

        // Validate Item ID and Stock
        bamazon.validateProduct(req.itemId).then(res => {

            // ID
            if (!res.length) {
                return util.inputError('Invalid item ID', () => {
                    bamazon.viewProducts().then(promptManagerOptions);
                });
            }

            // Stock
            if (req.qty < 0 || !req.qty) {
                return util.inputError('Quantity must be greater than 0.', () => {
                    bamazon.viewProducts().then(promptManagerOptions);
                });
            }

            let item = {
                id: res[0].item_id,
                name: res[0].product_name,
                price: res[0].price,
                stock: res[0].stock_quantity
            };

            /**
             * Add stock to product,
             * then log message and show updated product table,
             * then return to manager options prompt.
             */
            console.clear();
            bamazon.modifyStock(item, parseInt(req.qty))
                .then(() => {
                    console.log(`(${req.qty}) ${item.name} added. (Total: ${item.stock + parseInt(req.qty)})\n`);
                    return bamazon.viewProducts();
                })
                .then(promptManagerOptions);
        });
    });
}

//  ADD NEW PRODUCT
//------------------------------------------------------------------|
function promptNewProduct() {

    util.printTitle('Add New Product', 42);

    inquirer.prompt([{
            type: 'input',
            name: 'name',
            message: 'Name: '
        },
        {
            type: 'input',
            name: 'dept',
            message: 'Department: '
        },
        {
            type: 'input',
            name: 'price',
            message: 'Price: '
        },
        {
            type: 'input',
            name: 'stock',
            message: 'Initial stock: '
        }
    ]).then(req => {

        let prop;
        let inputs = [req.name, req.dept, req.price, req.stock];
        let outputs = [];

        // Validate inputs
        for (let i = 0; i < inputs.length; i++) {
            prop = inputs[i].trim();
            if (prop === '') return util.inputError('Error: fields cannot be blank.', promptNewProduct);
            outputs.push(prop);
        }

        console.clear();

        bamazon.addNewProduct(outputs[0], outputs[1], outputs[2], outputs[3])
            .then(promptManagerOptions);
    });
}

//  DELETE PRODUCT
//------------------------------------------------------------------|
function promptDeleteProduct() {

    util.printTitle('Delete Product', 40);

    inquirer.prompt([{
        type: 'input',
        name: 'itemId',
        message: 'Item ID: '
    }]).then(req => {

        console.clear();

        bamazon.deleteProduct(req.itemId)
            .then(bamazon.viewProducts)
            .then(promptManagerOptions);
    });
}