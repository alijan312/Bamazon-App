require('dotenv').config();
const inquirer = require('inquirer');
const mysql = require('mysql');
const chalk = require('chalk');
const Table = require('cli-table');


const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'bamazon',
});

connection.connect((err) => {
    if (err) throw (err);
    console.log(`connected as id ${connection.threadId}`);

    initialize();
});

function initialize() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        let table = new Table({
            head: ['ID', 'Product', 'Department', 'Price', 'Stock Quantity']
        });

        console.log('==========================================================')
        console.log(chalk.bgBlue('WELCOME TO BAMAZON. HERE ARE THE ITEMS FOR SALE: '));
        console.log('==========================================================')
        for (var i = 0; i < res.length; i++) {
            table.push([res[i].id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity])
        }
        console.log(table.toString());
        productSale();
    });
}

function productSale() {
    inquirer.prompt([{
        name: 'id',
        type: 'input',
        message: 'Please enter the ID of the product you would like to buy!'
    }, {
        name: 'quantity',
        type: 'input',
        message: 'How many units of the product would you like to buy?',
        validate: function (value) {
            if (isNaN(value) === false) {
                return true;
            }
            return false;
        }
    }]).then(function (answer) {
        connection.query('SELECT * FROM products WHERE ?', {
            id: answer.id
        }, function (err, res) {
            if (err) throw err;
            if (parseInt(answer.quantity) > res[0].stock_quantity) {
                console.log('INSUFFICIENT QUANTITY!');
                console.log('THERE ARE  ' + res[0].stock_quantity + ' ITEMS LEFT IN STOCK.')
                productSale();
            } else {
                let totalCost = res[0].price * answer.quantity;
                connection.query('UPDATE products SET ?? = ?? - ? WHERE ?',
                    [
                        'stock_quantity',
                        'stock_quantity',
                        answer.quantity,
                        {
                            id: answer.id
                        }
                    ],
                    function (err, res) {
                        console.log(chalk.bgGreen('YOU HAVE PURCHASED ' + answer.quantity + ' ITEM/S.'));
                        console.log(chalk.bgCyan('YOUR TOTAL COST IS: $' + totalCost.toFixed(2)));
                        productSale();
                    });
                
            }
        });

    });
}