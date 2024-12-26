# Coupon Management API

This API allows users to generate unique, time-bound discount coupons and validate them for specific products and users. It also logs requests into a mock database.

## Features
- **Generate Coupons**: Creates a unique, time-bound coupon for a product-user combination.
- **Validate Coupons**: Validates the coupon for a specific product and user.
- **Mock Database**: Stores users, products, and coupons for demonstration purposes.
- **Error Handling**: Handles errors like invalid product or user ID, invalid coupon, and expired coupon.

---

## Technology Stack
- **Backend Framework**: Node.js (Express)
- **Date Handling**: Moment.js

---

## Installation

### Prerequisites
- Node.js (>= v14.x)
- npm (comes with Node.js)

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/Subham-hyna/coupon-management.git
   cd coupon-management
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

4. The API will be running at `http://localhost:3000`.

---

## Endpoints

### 1. **Generate Coupon**
#### URL
`POST /generate-coupon`

#### Description
Generates a unique, time-bound discount coupon for a specific product-user combination. If a valid coupon already exists for the same product-user pair, it reuses the existing coupon. Expiration in 24 hrs from when generated.

#### Request Body
```json
{
  "productId": 101,
  "userId": 1
}
```

#### Response
- **Success (201)**
  ```json
  {
    "couponId": "ABC123"
  }
  ```
- **Existing Coupon (200)**
  ```json
  {
    "couponId": "ABC123"
  }
  ```
- **Error (400)**
  ```json
  {
    "error": "Invalid product or user ID"
  }
  ```

---

### 2. **Validate Coupon**
#### URL
`POST /validate-coupon`

#### Description
Validates the coupon for a specific product and user. Checks for expiration, product-user match, and coupon existence.

#### Request Body
```json
{
  "couponId": "ABC123",
  "productId": 101,
  "userId": 1
}
```

#### Response
- **Valid Coupon (200)**
  ```json
  {
    "message": "Coupon is valid",
    "discount": 10
  }
  ```
- **Error (400)**
  - Invalid Coupon:
    ```json
    {
      "error": "Invalid coupon"
    }
    ```
  - Coupon Expired:
    ```json
    {
      "error": "Coupon has expired"
    }
    ```
  - Product-User Mismatch:
    ```json
    {
      "error": "Coupon is not valid for this product or user"
    }
    ```

---

### 3. **Mock Database**
#### URL
`GET /mock-database`

#### Description
Returns the current state of the mock database, including users, products, and coupons.

#### Response
```json
{
  "users": [
    { "id": 1, "name": "John Doe" },
    { "id": 2, "name": "Jane Smith" },
    { "id": 3, "name": "Alice Johnson" },
    { "id": 4, "name": "Bob Brown" },
    { "id": 5, "name": "Emily Davis" }
  ],
  "products": [
    { "id": 101, "name": "Product A" },
    { "id": 102, "name": "Product B" },
    { "id": 103, "name": "Product C" },
    { "id": 104, "name": "Product D" },
    { "id": 105, "name": "Product E" }
  ],
  "coupons": [
    {
      "couponId": "ABC123",
      "productId": 101,
      "userId": 1,
      "discount": 10,
      "expirationDate": "2024-12-27T12:00:00.000Z"
    }
  ]
}
```

---

## Mock Database Schema

### Users
| Field | Type   | Description      |
|-------|--------|------------------|
| id    | Number | Unique User ID   |
| name  | String | Name of the User |

### Products
| Field | Type   | Description       |
|-------|--------|-------------------|
| id    | Number | Unique Product ID |
| name  | String | Name of the Product |

### Coupons
| Field          | Type    | Description                             |
|----------------|---------|-----------------------------------------|
| couponId       | String  | Unique 6-character alphanumeric ID      |
| productId      | Number  | Associated Product ID                   |
| userId         | Number  | Associated User ID                      |
| discount       | Number  | Discount percentage (e.g., 10)          |
| expirationDate | String  | ISO Date String indicating expiry       |

---

## Error Handling

The API ensures robust error handling for the following scenarios:
- **Invalid Input**: Missing or incorrect `productId`, `userId`, or `couponId`.
- **Invalid Coupon**: Non-existent coupon ID.
- **Expired Coupon**: Coupons past their expiration date.
- **Product-User Mismatch**: Coupon not applicable for the given product or user.

