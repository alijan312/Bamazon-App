CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
	id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR (30) NOT NULL,
    department_name VARCHAR (30) NOT NULL,
    price DECIMAL(8,2) NOT NULL,
    stock_quantity INT NOT NULL,
    PRIMARY KEY (id)
);
