## The Usage

### Environment

1. Nodejs16+

### Install dependencies

Open a terminal to run
    
    npm install

### Set up server
Open a terminal to run
    
    npm start

### Open browser and test following url

* http://localhost:8080/register
* http://localhost:8080/login
* http://localhost:8080/add-product



# Product API Documentation

This API allows you to manage products, including creating, updating, deleting, and searching for products.

## Base URL

The base URL for this API is `/api/products`.

## Endpoints

### Create a New Product

- **HTTP Method**: POST
- **Endpoint**: `/api/products`
- **Description**: Create a new product.
- **Request Body**: JSON object with the following properties:
    - `title` (string) - The title of the product.
    - `price` (number) - The price of the product.
    - `stock` (number) - The stock quantity of the product.
    - `image` (string) - URL of the product image.
- **Response**: Returns the created product as JSON.
- **Status Codes**:
    - 201 - Product created successfully.
    - 500 - Server error.

### Update a Product

- **HTTP Method**: PUT
- **Endpoint**: `/api/products/:id`
- **Description**: Update an existing product by ID.
- **Request Parameters**: `id` - The ID of the product to update.
- **Request Body**: JSON object with the following properties:
    - `title` (string) - The updated title of the product.
    - `price` (number) - The updated price of the product.
    - `stock` (number) - The updated stock quantity of the product.
    - `image` (string) - URL of the updated product image.
- **Response**: Returns the updated product as JSON.
- **Status Codes**:
    - 200 - Product updated successfully.
    - 404 - Product not found.
    - 500 - Server error.

### Delete a Product

- **HTTP Method**: DELETE
- **Endpoint**: `/api/products/:id`
- **Description**: Delete an existing product by ID.
- **Request Parameters**: `id` - The ID of the product to delete.
- **Response**: Returns the deleted product as JSON.
- **Status Codes**:
    - 200 - Product deleted successfully.
    - 404 - Product not found.
    - 500 - Server error.

### Search for Products

- **HTTP Method**: GET
- **Endpoint**: `/api/products/search`
- **Description**: Search for products based on various criteria.
- **Query Parameters** (all optional):
    - `title` (string) - Search products with titles matching the provided text (case-insensitive).
    - `minPrice` (number) - Filter products with a price greater than or equal to the provided value.
    - `maxPrice` (number) - Filter products with a price less than or equal to the provided value.
- **Response**: Returns an array of matching products as JSON.
- **Status Codes**:
    - 200 - Search successful.
    - 500 - Server error.




