# MedOps Backend - REST APIs

**Base URL:** `http://localhost:5000`

---

## 1. AUTHENTICATION APIs

### Register User
**POST** `/api/auth/register`
- **Authorization:** None
- **Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "customer"
}
```
- **Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "customer"
  }
}
```

---

### Login User
**POST** `/api/auth/login`
- **Authorization:** None
- **Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
- **Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "customer"
  }
}
```

---

### Get Current User
**GET** `/api/auth/me`
- **Authorization:** Bearer Token (Required)
- **Headers:**
```
Authorization: Bearer <token>
```
- **Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "customer"
  }
}
```

---

### Get All Users (Admin Only)
**GET** `/api/auth/users/all`
- **Authorization:** Bearer Token (Admin Required)
- **Headers:**
```
Authorization: Bearer <admin_token>
```
- **Response (200):**
```json
{
  "success": true,
  "count": 3,
  "users": [
    {
      "id": "507f1f77bcf86cd799439011",
      "username": "john_doe",
      "email": "john@example.com",
      "role": "customer",
      "createdAt": "2024-03-14T10:00:00.000Z",
      "updatedAt": "2024-03-14T10:00:00.000Z"
    },
    {
      "id": "507f1f77bcf86cd799439012",
      "username": "admin_user",
      "email": "admin@medops.com",
      "role": "admin",
      "createdAt": "2024-03-14T09:00:00.000Z",
      "updatedAt": "2024-03-14T09:00:00.000Z"
    }
  ]
}
```

---

## 2. MEDICINES APIs

### Get All Medicines
**GET** `/api/medicines`
- **Authorization:** None
- **Response (200):**
```json
{
  "success": true,
  "count": 2,
  "medicines": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Paracetamol",
      "manufacturer": "ABC Pharma",
      "category": "Pain Relief",
      "price": 50,
      "quantity": 100,
      "description": "Over-the-counter pain reliever",
      "createdAt": "2024-03-14T10:00:00.000Z",
      "updatedAt": "2024-03-14T10:00:00.000Z"
    }
  ]
}
```

---

### Get Medicine by ID
**GET** `/api/medicines/:id`
- **Authorization:** None
- **Params:** `id` (Medicine ID)
- **Response (200):**
```json
{
  "success": true,
  "medicine": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Paracetamol",
    "manufacturer": "ABC Pharma",
    "category": "Pain Relief",
    "price": 50,
    "quantity": 100,
    "description": "Over-the-counter pain reliever",
    "createdAt": "2024-03-14T10:00:00.000Z",
    "updatedAt": "2024-03-14T10:00:00.000Z"
  }
}
```

---

### Search Medicines
**GET** `/api/medicines/search?query=paracetamol`
- **Authorization:** None
- **Query Params:** `query` (Search term)
- **Response (200):**
```json
{
  "success": true,
  "count": 1,
  "medicines": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Paracetamol",
      "manufacturer": "ABC Pharma",
      "category": "Pain Relief",
      "price": 50,
      "quantity": 100,
      "description": "Over-the-counter pain reliever",
      "createdAt": "2024-03-14T10:00:00.000Z",
      "updatedAt": "2024-03-14T10:00:00.000Z"
    }
  ]
}
```

---

### Check Medicine Availability
**GET** `/api/medicines/:id/availability`
- **Authorization:** None
- **Params:** `id` (Medicine ID)
- **Response (200):**
```json
{
  "success": true,
  "availability": {
    "medicineId": "507f1f77bcf86cd799439011",
    "name": "Paracetamol",
    "available": true,
    "quantity": 100
  }
}
```

---

### Add Medicine (Admin Only)
**POST** `/api/medicines`
- **Authorization:** Bearer Token (Admin Required)
- **Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```
- **Body:**
```json
{
  "name": "Aspirin",
  "manufacturer": "Bayer",
  "category": "Pain Relief",
  "price": 75,
  "quantity": 200,
  "description": "Effective pain reliever and fever reducer"
}
```
- **Response (201):**
```json
{
  "success": true,
  "message": "Medicine added successfully",
  "medicine": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Aspirin",
    "manufacturer": "Bayer",
    "category": "Pain Relief",
    "price": 75,
    "quantity": 200,
    "description": "Effective pain reliever and fever reducer",
    "createdAt": "2024-03-14T10:00:00.000Z",
    "updatedAt": "2024-03-14T10:00:00.000Z"
  }
}
```

---

### Update Medicine (Admin Only)
**PUT** `/api/medicines/:id`
- **Authorization:** Bearer Token (Admin Required)
- **Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```
- **Params:** `id` (Medicine ID)
- **Body:**
```json
{
  "price": 80,
  "quantity": 250
}
```
- **Response (200):**
```json
{
  "success": true,
  "message": "Medicine updated successfully",
  "medicine": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Aspirin",
    "manufacturer": "Bayer",
    "category": "Pain Relief",
    "price": 80,
    "quantity": 250,
    "description": "Effective pain reliever and fever reducer",
    "createdAt": "2024-03-14T10:00:00.000Z",
    "updatedAt": "2024-03-14T10:05:00.000Z"
  }
}
```

---

### Delete Medicine (Admin Only)
**DELETE** `/api/medicines/:id`
- **Authorization:** Bearer Token (Admin Required)
- **Headers:**
```
Authorization: Bearer <admin_token>
```
- **Params:** `id` (Medicine ID)
- **Response (200):**
```json
{
  "success": true,
  "message": "Medicine deleted successfully"
}
```

---

## 3. ORDERS APIs

### Place Order (Customer Only)
**POST** `/api/orders`
- **Authorization:** Bearer Token (Customer Required)
- **Headers:**
```
Authorization: Bearer <customer_token>
Content-Type: application/json
```
- **Body:**
```json
{
  "medicines": [
    {
      "medicineId": "507f1f77bcf86cd799439011",
      "quantity": 5
    },
    {
      "medicineId": "507f1f77bcf86cd799439012",
      "quantity": 2
    }
  ]
}
```
- **Response (201):**
```json
{
  "success": true,
  "message": "Order placed successfully",
  "order": {
    "_id": "607f1f77bcf86cd799439013",
    "customerId": "507f1f77bcf86cd799439011",
    "medicines": [
      {
        "medicineId": "507f1f77bcf86cd799439011",
        "quantity": 5,
        "price": 50
      }
    ],
    "totalPrice": 250,
    "status": "placed",
    "createdAt": "2024-03-14T10:00:00.000Z",
    "updatedAt": "2024-03-14T10:00:00.000Z"
  }
}
```

---

### Get My Orders (Customer Only)
**GET** `/api/orders/my`
- **Authorization:** Bearer Token (Customer Required)
- **Headers:**
```
Authorization: Bearer <customer_token>
```
- **Response (200):**
```json
{
  "success": true,
  "count": 1,
  "orders": [
    {
      "_id": "607f1f77bcf86cd799439013",
      "customerId": {
        "_id": "507f1f77bcf86cd799439011",
        "username": "john_doe",
        "email": "john@example.com",
        "role": "customer"
      },
      "medicines": [
        {
          "medicineId": {
            "_id": "507f1f77bcf86cd799439011",
            "name": "Paracetamol",
            "price": 50
          },
          "quantity": 5,
          "price": 50
        }
      ],
      "totalPrice": 250,
      "status": "placed",
      "createdAt": "2024-03-14T10:00:00.000Z",
      "updatedAt": "2024-03-14T10:00:00.000Z"
    }
  ]
}
```

---

### Get All Orders (Admin Only)
**GET** `/api/orders/all`
- **Authorization:** Bearer Token (Admin Required)
- **Headers:**
```
Authorization: Bearer <admin_token>
```
- **Response (200):**
```json
{
  "success": true,
  "count": 1,
  "orders": [
    {
      "_id": "607f1f77bcf86cd799439013",
      "customerId": {
        "_id": "507f1f77bcf86cd799439011",
        "username": "john_doe",
        "email": "john@example.com",
        "role": "customer"
      },
      "medicines": [
        {
          "medicineId": {
            "_id": "507f1f77bcf86cd799439011",
            "name": "Paracetamol",
            "price": 50
          },
          "quantity": 5,
          "price": 50
        }
      ],
      "totalPrice": 250,
      "status": "placed",
      "createdAt": "2024-03-14T10:00:00.000Z",
      "updatedAt": "2024-03-14T10:00:00.000Z"
    }
  ]
}
```

---

### Get Order by ID
**GET** `/api/orders/:id`
- **Authorization:** Bearer Token (Required)
- **Headers:**
```
Authorization: Bearer <token>
```
- **Params:** `id` (Order ID)
- **Response (200):**
```json
{
  "success": true,
  "order": {
    "_id": "607f1f77bcf86cd799439013",
    "customerId": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "john_doe",
      "email": "john@example.com",
      "role": "customer"
    },
    "medicines": [
      {
        "medicineId": {
          "_id": "507f1f77bcf86cd799439011",
          "name": "Paracetamol",
          "price": 50
        },
        "quantity": 5,
        "price": 50
      }
    ],
    "totalPrice": 250,
    "status": "placed",
    "createdAt": "2024-03-14T10:00:00.000Z",
    "updatedAt": "2024-03-14T10:00:00.000Z"
  }
}
```

---

### Update Order Status (Admin Only)
**PUT** `/api/orders/status/:id`
- **Authorization:** Bearer Token (Admin Required)
- **Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```
- **Params:** `id` (Order ID)
- **Body:**
```json
{
  "status": "confirmed"
}
```
- **Valid Statuses:** `placed`, `confirmed`, `shipped`, `delivered`, `cancelled`
- **Response (200):**
```json
{
  "success": true,
  "message": "Order status updated successfully",
  "order": {
    "_id": "607f1f77bcf86cd799439013",
    "customerId": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "john_doe",
      "email": "john@example.com",
      "role": "customer"
    },
    "medicines": [
      {
        "medicineId": {
          "_id": "507f1f77bcf86cd799439011",
          "name": "Paracetamol",
          "price": 50
        },
        "quantity": 5,
        "price": 50
      }
    ],
    "totalPrice": 250,
    "status": "confirmed",
    "createdAt": "2024-03-14T10:00:00.000Z",
    "updatedAt": "2024-03-14T10:05:00.000Z"
  }
}
```

---

### Cancel Order (Customer Only)
**DELETE** `/api/orders/cancel/:id`
- **Authorization:** Bearer Token (Customer Required)
- **Headers:**
```
Authorization: Bearer <customer_token>
```
- **Params:** `id` (Order ID)
- **Note:** Only orders with status "placed" can be cancelled
- **Response (200):**
```json
{
  "success": true,
  "message": "Order cancelled successfully",
  "order": {
    "_id": "607f1f77bcf86cd799439013",
    "customerId": "507f1f77bcf86cd799439011",
    "medicines": [
      {
        "medicineId": "507f1f77bcf86cd799439011",
        "quantity": 5,
        "price": 50
      }
    ],
    "totalPrice": 250,
    "status": "cancelled",
    "createdAt": "2024-03-14T10:00:00.000Z",
    "updatedAt": "2024-03-14T10:10:00.000Z"
  }
}
```

---

## QUICK TEST FLOW

1. **Register** → POST `/api/auth/register`
2. **Login** → POST `/api/auth/login` (Get Token)
3. **Get Medicines** → GET `/api/medicines`
4. **Add Medicine** (Admin) → POST `/api/medicines`
5. **Place Order** (Customer) → POST `/api/orders`
6. **Get My Orders** → GET `/api/orders/my`
7. **Update Order Status** (Admin) → PUT `/api/orders/status/:id`

---

## ERROR RESPONSES

**400 Bad Request:**
```json
{
  "success": false,
  "message": "Error description"
}
```

**401 Unauthorized:**
```json
{
  "success": false,
  "message": "No token provided" or "Invalid or expired token"
}
```

**403 Forbidden:**
```json
{
  "success": false,
  "message": "Access denied. Insufficient permissions."
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "Resource not found"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

