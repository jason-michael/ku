# Bamazon
### Amazon-like Node/MySQL app.
Bamazon is a fictional app that lets users modify data (CRUD) in a SQL database using the node command line. 

There are three use cases:
- Customer: view and purchase products.
- Manager: view low stock, add stock, create new products and delete products.
- Supervisor: view product sales by department, create new departments.



# Index
- [Customer Demos](#customer-demos)
- [Manager Demos](#manager-demos)
- [Supervisor Demos](#supervisor-demos) 
- [Error Handling Demos](#error-handling-demos)
- [Issues](#issues)



## Customer Demos

### Buy Product
Enter item ID and desired quantity to 'purchase' a product. The table is automatically updated to reflect the purchase.<br><br>
![buy_product](demo/cst/buy_product.gif?raw=true)
<br>[Back to top](#index)

### Browse Products
Display all curently available products and product info.<br><br>
![browse_products](demo/cst/browse_products.gif?raw=true)
<br>[Back to top](#index)



## Manager Demos

### Browse Products
Display all curently available products and product info. Same as Customer -> Browse Products.<br><br>
![browse_products](demo/mgr/browse_products.gif?raw=true)
<br>[Back to top](#index)

### View Low Stock
Display all products with less than 5 stock.<br><br>
![low_stock](demo/mgr/low_stock.gif?raw=true)
<br>[Back to top](#index)

### Add Stock
Enter item ID and quantity to add.<br><br>
![add_stock](demo/mgr/add_stock.gif?raw=true)
<br>[Back to top](#index)

### Add New Product
Enter new product info to add to the database.<br><br>
![new_product](demo/mgr/new_product.gif?raw=true)
<br>[Back to top](#index)

### Delete Product
Enter item ID to delete a product.<br><br>
![delete_product](demo/mgr/delete_product.gif?raw=true)
<br>[Back to top](#index)



## Supervisor Demos

### View Product Sales by Department
Display product sales for each department, sorted by most profitable. `Total Profit` is calculated on request and is **not** stored if the database.<br><br>
![view_sales](demo/sup/view_sales.gif?raw=true)
<br>[Back to top](#index)

### Create New Department
Enter name and overhead cost to create a new department.<br>
**Note:** If the new department has no products on creation `Product Sales` and `Total Profit` will be empty.<br><br>
![add_dept](demo/sup/add_dept.gif?raw=true)
<br>[Back to top](#index)

### Adding Products to New Departments
Once a department has been created, products can be added to it.<br><br>
This example shows a **Manager** creating a new product `Diapers` and assigning it to the new `Baby` department. Then a **Customer** purchases the `Diapers` product. After the purchase, a **Supervisor** can now view sales for the `Baby` department. <br><br>
![add_dept_w_prod](demo/sup/add_dept_w_prod.gif?raw=true)
<br>[Back to top](#index)



# Error Handling Demos

## Customer

### Buy Product (invalid item ID)
![cst_buy_id](demo/err/cst_buy_id.gif?raw=true)
<br>[Back to top](#index)

### Buy Product (invalid stock)
**Note:** Blank and `0` values intentionally create an empty purchase.<br><br>
![cst_buy_stk](demo/err/cst_buy_stk.gif?raw=true)
<br>[Back to top](#index)

## Manager

### Add Stock (invalid id or stock)

In the demo below, `QTY to add: 0` adds 0 stock to a product. This has been fixed to display the correct `must be greater than 0` error.<br><br>
![mgr_add_stk](demo/err/mgr_add_stk.gif?raw=true)
<br>[Back to top](#index)

## Supervisor

### Create New Department

![sup_new_dept](demo/err/sup_new_dept.gif?raw=true)
<br>[Back to top](#index)

# Issues

- Need to validate input for **Manager - Add New Product**.

<br>[Back to top](#index)
#
<h6>KU Assignment<h6>
