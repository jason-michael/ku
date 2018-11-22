//  DEPENDENCIES
//------------------------------------------------------------------|
const mysql = require('mysql');
const Table = require('cli-table');

//  CONNECTION OPTIONS
//------------------------------------------------------------------|
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3303,
    user: 'root',
    password: 'root',
    database: 'bamazon'
});

//  CLI-TABLES SETUP
//------------------------------------------------------------------|
let productsTable = new Table({
    head: ['ID', 'Product', 'Price', 'Stock'],
    colWidths: [6, 30, 10, 10],
    colAligns: ['left', 'left', 'right', 'right']
});

let departmentsTable = new Table({
    head: ['ID', 'Department', 'Overhead', 'Product Sales', 'Total Profit'],
    colWidths: [6, 20, 15, 20, 20],
    colAligns: ['left', 'left', 'right', 'right', 'right']
});

//  BAMAZON FUNCTIONS
//------------------------------------------------------------------|
module.exports = {

    addNewDept: function (name, overhead) {
        let query = `
            INSERT INTO departments (department_name, over_head_costs)
            VALUES ('${name}', '${overhead}')`;

        return new Promise((resolve, reject) => {

            connection.query(query, (err, res) => {
                if (err) reject(err);

                // Cli-table title, prints new dept name.
                console.log(`\rNew department added: ${name}.`);

                // Get the new department's info (for cli-table purposes only).
                connection.query(`SELECT * FROM departments WHERE department_id = ${res.insertId}`, (err, depts) => {
                    if (err) reject(err);

                    // Adds new department to the cli-table.
                    departmentsTable.push([
                        depts[0].department_id,
                        depts[0].department_name,
                        depts[0].over_head_costs
                    ]);

                    // Resolve and print cli-table.
                    resolve(console.log('\n' + departmentsTable.toString()));
                });
            });
        });
    },

    addNewProduct: function (name, dept, price, stock) {
        let query = `
            INSERT INTO products (product_name, department_name, price, stock_quantity)
            VALUES ('${name}', '${dept}', ${price}, ${stock})`;

        return new Promise((resolve, reject) => {

            connection.query(query, (err, results) => {
                if (err) reject(err);

                // Cli-table title, prints new product name.
                console.log(`\rNew product added: ${name}.`);

                // Get the new product's info (for console table purposes only).
                connection.query(`SELECT * FROM products WHERE item_id = ${results.insertId}`, (err, prods) => {
                    if (err) reject(err);

                    // Add new product to the cli-table.
                    productsTable.push([
                        prods[0].item_id,
                        prods[0].product_name,
                        prods[0].price,
                        prods[0].stock_quantity,
                    ]);

                    // Resolve and print the cli-table.
                    resolve(console.log('\n' + productsTable.toString()));
                });
            });
        });
    },

    addPurchaseToSales(item, qty) {
        // Adds purchased product price to the current product_sales value in the database. 
        let query = `
        UPDATE products 
        SET product_sales = product_sales + ${item.price * Math.abs(qty)} 
        WHERE item_id = ${item.id}`;

        return new Promise((resolve, reject) => {

            connection.query(query, err => {
                if (err) reject(err);
                resolve();
            });
        });
    },

    connect: function () {
        return new Promise((resolve, reject) => {

            connection.connect(err => {
                if (err) reject(err);
                resolve(console.log(`\nConnected to Bamazon.`));
            });
        });
    },

    deleteProduct: function (id) {
        let query = `DELETE FROM products WHERE item_id = ${id}`;

        return new Promise((resolve, reject) => {

            connection.query(query, err => {
                if (err) reject(err);
                resolve(console.log(`\nItem deleted.\n`));
            });
        });
    },

    endConnection: function () {
        return connection.end();
    },

    modifyStock: function (item, qty) {

        /**
         * qty:
         * positive value to add stock
         * negative value to remove stock (purchase)
         */

        // If a purchase was made:
        if (qty < 0) this.addPurchaseToSales(item, qty);

        // Sets stock_quantity of a database product to the
        // current stock + qty (qty can be positive or negative). 
        let query = `
            UPDATE products 
            SET stock_quantity = ${item.stock + qty} 
            WHERE item_id = ${item.id}`;

        return new Promise((resolve, reject) => {
            connection.query(query, err => {
                if (err) reject(err);
                resolve();
            });
        });
    },

    // Searches the database for a given product id,
    // returns an array (if array.length === 0, no item found ).
    validateProduct: function (id) {
        let query = `SELECT * FROM products WHERE item_id = ${id}`;

        return new Promise((resolve, reject) => {

            connection.query(query, (err, res) => {
                if (err) reject(err);
                return resolve(res);
            });
        });
    },

    viewLowInventory: function () {
        let query = 'SELECT * FROM products WHERE stock_quantity < 5';

        return new Promise((resolve, reject) => {

            connection.query(query, (err, prods) => {
                if (err) reject(err);

                // Reset the products cli-table.
                productsTable.length = 0;

                // Add low inventory items to the products cli-table.
                let item;
                prods.forEach(prod => {
                    item = {
                        id: prod.item_id,
                        name: prod.product_name,
                        price: prod.price,
                        stock: prod.stock_quantity
                    }

                    productsTable.push([item.id, item.name, item.price, item.stock]);
                });

                // Resolve and print cli-table title and table.
                resolve(console.log('All products with stock less than 5:\n' + productsTable.toString()));
            });
        });
    },

    viewProducts: function () {
        // These resets are required to display the cli-table correctly.
        this.availableItems = [];
        productsTable.length = 0;

        return new Promise((resolve, reject) => {

            connection.query('SELECT * FROM products', (err, prods) => {
                if (err) reject(err);

                // Populate availableItems and productsTable with products.
                let item;
                prods.forEach(prod => {
                    item = {
                        id: prod.item_id,
                        name: prod.product_name,
                        price: parseFloat(prod.price).toFixed(2),
                        stock: prod.stock_quantity
                    }
                    productsTable.push([item.id, item.name, item.price, item.stock]);
                });

                // Resolve and print the products cli-table.
                resolve(console.log('All products:\n' + productsTable.toString()));
            });
        });
    },

    viewSalesByDept: function () {
        // Note: query expanded and sql comments added for better readability inside this doc.
        let query = `
            SELECT departments.department_id, products.department_name, departments.over_head_costs,

                -- Calculate total product sales:
                SUM(products.product_sales) AS product_sales, 
                
                -- Calcualte total profit (product sales - overhead costs):
                SUM(products.product_sales) - departments.over_head_costs AS total_profit

            FROM products

            INNER JOIN departments ON departments.department_name = products.department_name

            GROUP BY products.department_name

            ORDER BY total_profit DESC`;

        return new Promise((resolve, reject) => {

            connection.query(query, (err, depts) => {
                if (err) reject(err);

                // Add departments to the departments cli-table.
                let item;
                departmentsTable.length = 0;
                depts.forEach(dept => {
                    item = {
                        id: dept.department_id,
                        name: dept.department_name,
                        overhead: parseFloat(dept.over_head_costs).toFixed(2),
                        sales: parseFloat(dept.product_sales).toFixed(2),
                        profit: parseFloat(dept.total_profit).toFixed(2)
                    }

                    departmentsTable.push([item.id, item.name, item.overhead, item.sales, item.profit]);
                });

                // Resolve and print the title and cli-table. 
                resolve(console.log('Product Sales by Department: (sorted by profit)\n' + departmentsTable.toString()));
            });
        });
    },
}