# API Documentation

## Authentication

### Register
**POST** `/api/auth/register`  
**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "password": "securePassword123",
  "role": "patient"
}
```
**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "role": "patient",
    "createdAt": "2026-04-27T10:30:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Login
**POST** `/api/auth/login`  
**Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "role": "patient"
  }
}
```

## Users Management

### Get All Users
**GET** `/api/users`  
**Headers:** `Authorization: Bearer <token>`  
**Query:** `?role=patient&page=1&limit=10&search=john`  
**Response:**
```json
{
  "success": true,
  "users": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "role": "patient",
      "dateOfBirth": "1990-05-15",
      "gender": "male",
      "address": "123 Main St, City"
    }
  ],
  "total": 50,
  "page": 1,
  "pages": 5
}
```

### Get User Profile
**GET** `/api/users/profile`  
**Headers:** `Authorization: Bearer <token>`  
**Response:**
```json
{
  "success": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "role": "patient",
    "profilePic": "url_to_image",
    "dateOfBirth": "1990-05-15",
    "gender": "male",
    "address": "123 Main St, City"
  }
}
```

### Update User Profile
**PUT** `/api/users/profile`  
**Headers:** `Authorization: Bearer <token>`  
**Body:**
```json
{
  "name": "Jane Doe",
  "dateOfBirth": "1990-05-15",
  "gender": "female",
  "address": "456 Oak Ave, City",
  "profilePic": "base64_or_url"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": { ... updated user object ... }
}
```

### Delete User
**DELETE** `/api/users/:userId`  
**Headers:** `Authorization: Bearer <token>`  
**Response:**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

## Specialists

### Get All Specialists
**GET** `/api/specialists`  
**Response:**
```json
{
  "success": true,
  "specialists": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Cardiology",
      "description": "Heart and cardiovascular diseases",
      "icon": "url_to_icon",
      "isActive": true,
      "createdAt": "2026-04-01T10:00:00Z"
    }
  ]
}
```

### Get Specialist by ID
**GET** `/api/specialists/:id`  
**Response:**
```json
{
  "success": true,
  "specialist": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Cardiology",
    "description": "Heart and cardiovascular diseases",
    "icon": "url_to_icon",
    "isActive": true,
    "createdAt": "2026-04-01T10:00:00Z"
  }
}
```

### Create Specialist
**POST** `/api/specialists`  
**Headers:** `Authorization: Bearer <admin_token>`  
**Body:**
```json
{
  "name": "Cardiology",
  "description": "Heart and cardiovascular diseases",
  "icon": "url_to_icon"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Specialist created successfully",
  "specialist": { ... specialist object ... }
}
```

### Update Specialist
**PUT** `/api/specialists/:id`  
**Headers:** `Authorization: Bearer <admin_token>`  
**Body:**
```json
{
  "name": "Updated Specialist Name",
  "description": "Updated description",
  "isActive": true
}
```
**Response:**
```json
{
  "success": true,
  "message": "Specialist updated successfully",
  "specialist": { ... updated specialist object ... }
}
```

### Delete Specialist
**DELETE** `/api/specialists/:id`  
**Headers:** `Authorization: Bearer <admin_token>`  
**Response:**
```json
{
  "success": true,
  "message": "Specialist deleted successfully"
}
```

## Doctors

### Get All Doctors
**GET** `/api/doctors`  
**Query:** `?specialistId=507f...&page=1&limit=10`  
**Response:**
```json
{
  "success": true,
  "doctors": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "userId": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "Dr. John Smith",
        "email": "john.smith@hospital.com"
      },
      "specialistId": {
        "_id": "507f1f77bcf86cd799439012",
        "name": "Cardiology"
      },
      "licenseNumber": "LICENSE12345",
      "experience": 10,
      "qualifications": ["MBBS", "MD"],
      "consultationFee": 50,
      "biography": "Experienced cardiologist with 10 years...",
      "isActive": true
    }
  ],
  "total": 25,
  "page": 1,
  "pages": 3
}
```

### Get Doctor by ID
**GET** `/api/doctors/:id`  
**Response:**
```json
{
  "success": true,
  "doctor": {
    "_id": "507f1f77bcf86cd799439014",
    "userId": { ... user details ... },
    "specialistId": { ... specialist details ... },
    "licenseNumber": "LICENSE12345",
    "experience": 10,
    "qualifications": ["MBBS", "MD"],
    "consultationFee": 50,
    "biography": "Experienced cardiologist...",
    "workingHours": {
      "monday": { "start": "09:00", "end": "17:00" },
      "tuesday": { "start": "09:00", "end": "17:00" }
    },
    "isActive": true
  }
}
```

### Create Doctor
**POST** `/api/doctors`  
**Headers:** `Authorization: Bearer <admin_token>`  
**Body:**
```json
{
  "userId": "507f1f77bcf86cd799439011",
  "specialistId": "507f1f77bcf86cd799439012",
  "licenseNumber": "LICENSE12345",
  "experience": 10,
  "qualifications": ["MBBS", "MD"],
  "consultationFee": 50,
  "biography": "Experienced cardiologist...",
  "workingHours": {
    "monday": { "start": "09:00", "end": "17:00" },
    "tuesday": { "start": "09:00", "end": "17:00" }
  }
}
```
**Response:**
```json
{
  "success": true,
  "message": "Doctor created successfully",
  "doctor": { ... doctor object ... }
}
```

### Update Doctor
**PUT** `/api/doctors/:id`  
**Headers:** `Authorization: Bearer <token>`  
**Body:**
```json
{
  "consultationFee": 60,
  "biography": "Updated biography...",
  "workingHours": { ... updated hours ... }
}
```
**Response:**
```json
{
  "success": true,
  "message": "Doctor updated successfully",
  "doctor": { ... updated doctor object ... }
}
```

### Delete Doctor
**DELETE** `/api/doctors/:id`  
**Headers:** `Authorization: Bearer <admin_token>`  
**Response:**
```json
{
  "success": true,
  "message": "Doctor deleted successfully"
}
```

## Slots

### Get Available Slots
**GET** `/api/slots/doctor/:doctorId`  
**Query:** `?date=2026-05-15&available=true`  
**Response:**
```json
{
  "success": true,
  "slots": [
    {
      "_id": "507f1f77bcf86cd799439015",
      "doctorId": "507f1f77bcf86cd799439014",
      "startTime": "2026-05-15T09:00:00Z",
      "endTime": "2026-05-15T09:30:00Z",
      "isAvailable": true
    }
  ]
}
```

### Get Slot by ID
**GET** `/api/slots/:id`  
**Response:**
```json
{
  "success": true,
  "slot": {
    "_id": "507f1f77bcf86cd799439015",
    "doctorId": "507f1f77bcf86cd799439014",
    "startTime": "2026-05-15T09:00:00Z",
    "endTime": "2026-05-15T09:30:00Z",
    "isAvailable": true,
    "createdAt": "2026-04-20T10:00:00Z"
  }
}
```

### Create Slot
**POST** `/api/slots`  
**Headers:** `Authorization: Bearer <doctor_token>`  
**Body:**
```json
{
  "doctorId": "507f1f77bcf86cd799439014",
  "startTime": "2026-05-15T09:00:00Z",
  "endTime": "2026-05-15T09:30:00Z"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Slot created successfully",
  "slot": { ... slot object ... }
}
```

### Update Slot
**PATCH** `/api/slots/:id`  
**Headers:** `Authorization: Bearer <doctor_token>`  
**Body:**
```json
{
  "isAvailable": false
}
```
**Response:**
```json
{
  "success": true,
  "message": "Slot updated successfully",
  "slot": { ... updated slot object ... }
}
```

### Delete Slot
**DELETE** `/api/slots/:id`  
**Headers:** `Authorization: Bearer <doctor_token>`  
**Response:**
```json
{
  "success": true,
  "message": "Slot deleted successfully"
}
```

## Appointments

### Get All Appointments
**GET** `/api/appointments`  
**Headers:** `Authorization: Bearer <token>`  
**Query:** `?status=confirmed&doctorId=507f...&page=1&limit=10`  
**Response:**
```json
{
  "success": true,
  "appointments": [
    {
      "_id": "507f1f77bcf86cd799439017",
      "patientId": { ... patient details ... },
      "doctorId": { ... doctor details ... },
      "slotId": { ... slot details ... },
      "status": "confirmed",
      "appointmentDate": "2026-05-15T09:00:00Z",
      "notes": "Patient has history of allergies",
      "paymentStatus": "paid",
      "videoCallUrl": "https://meet.example.com/room123",
      "createdAt": "2026-04-20T10:00:00Z"
    }
  ],
  "total": 15,
  "page": 1,
  "pages": 2
}
```

### Get Appointment by ID
**GET** `/api/appointments/:id`  
**Headers:** `Authorization: Bearer <token>`  
**Response:**
```json
{
  "success": true,
  "appointment": {
    "_id": "507f1f77bcf86cd799439017",
    "patientId": { ... patient details ... },
    "doctorId": { ... doctor details ... },
    "slotId": { ... slot details ... },
    "status": "confirmed",
    "appointmentDate": "2026-05-15T09:00:00Z",
    "notes": "Patient has history of allergies",
    "paymentStatus": "paid",
    "videoCallUrl": "https://meet.example.com/room123"
  }
}
```

### Create Appointment
**POST** `/api/appointments`  
**Headers:** `Authorization: Bearer <patient_token>`  
**Body:**
```json
{
  "doctorId": "507f1f77bcf86cd799439014",
  "slotId": "507f1f77bcf86cd799439015",
  "notes": "I have chest pain and anxiety"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Appointment created successfully",
  "appointment": {
    "_id": "507f1f77bcf86cd799439017",
    "patientId": "507f1f77bcf86cd799439011",
    "doctorId": "507f1f77bcf86cd799439014",
    "slotId": "507f1f77bcf86cd799439015",
    "status": "pending",
    "appointmentDate": "2026-05-15T09:00:00Z",
    "notes": "I have chest pain and anxiety",
    "paymentStatus": "unpaid"
  }
}
```

### Update Appointment
**PUT** `/api/appointments/:id`  
**Headers:** `Authorization: Bearer <token>`  
**Body:**
```json
{
  "status": "confirmed",
  "notes": "Appointment confirmed. Please arrive 15 minutes early."
}
```
**Response:**
```json
{
  "success": true,
  "message": "Appointment updated successfully",
  "appointment": { ... updated appointment object ... }
}
```

### Cancel Appointment
**PATCH** `/api/appointments/:id`  
**Headers:** `Authorization: Bearer <token>`  
**Body:**
```json
{
  "status": "cancelled",
  "reason": "Emergency came up"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Appointment cancelled successfully",
  "appointment": { ... updated appointment object ... }
}
```

### Delete Appointment
**DELETE** `/api/appointments/:id`  
**Headers:** `Authorization: Bearer <token>`  
**Response:**
```json
{
  "success": true,
  "message": "Appointment deleted successfully"
}
```

## Payments

### Get All Payments
**GET** `/api/payments`  
**Headers:** `Authorization: Bearer <admin_token>`  
**Query:** `?status=completed&userId=507f...&page=1`  
**Response:**
```json
{
  "success": true,
  "payments": [
    {
      "_id": "507f1f77bcf86cd799439018",
      "appointmentId": "507f1f77bcf86cd799439017",
      "userId": "507f1f77bcf86cd799439011",
      "amount": 50,
      "currency": "USD",
      "status": "completed",
      "paymentMethod": "card",
      "transactionId": "TXN123456789",
      "createdAt": "2026-04-25T15:30:00Z"
    }
  ],
  "total": 100,
  "page": 1,
  "pages": 10
}
```

### Get Payment by ID
**GET** `/api/payments/:id`  
**Headers:** `Authorization: Bearer <token>`  
**Response:**
```json
{
  "success": true,
  "payment": {
    "_id": "507f1f77bcf86cd799439018",
    "appointmentId": "507f1f77bcf86cd799439017",
    "userId": "507f1f77bcf86cd799439011",
    "amount": 50,
    "currency": "USD",
    "status": "completed",
    "paymentMethod": "card",
    "transactionId": "TXN123456789"
  }
}
```

### Initiate Payment
**POST** `/api/payments/initiate`  
**Headers:** `Authorization: Bearer <patient_token>`  
**Body:**
```json
{
  "appointmentId": "507f1f77bcf86cd799439017",
  "amount": 50,
  "paymentMethod": "card"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Payment initiated successfully",
  "payment": {
    "_id": "507f1f77bcf86cd799439018",
    "appointmentId": "507f1f77bcf86cd799439017",
    "amount": 50,
    "currency": "USD",
    "status": "pending",
    "paymentUrl": "https://payment-gateway.com/pay/123456"
  }
}
```

### Update Payment Status
**PATCH** `/api/payments/:id`  
**Headers:** `Authorization: Bearer <admin_token>`  
**Body:**
```json
{
  "status": "completed",
  "transactionId": "TXN123456789"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Payment updated successfully",
  "payment": { ... updated payment object ... }
}
```

### Cancel Payment
**DELETE** `/api/payments/:id`  
**Headers:** `Authorization: Bearer <token>`  
**Response:**
```json
{
  "success": true,
  "message": "Payment cancelled successfully"
}
```

## Video Calls

### Start Video Call
**POST** `/api/calls/start`  
**Headers:** `Authorization: Bearer <token>`  
**Body:**
```json
{
  "appointmentId": "507f1f77bcf86cd799439017",
  "callType": "video"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Call started successfully",
  "call": {
    "_id": "507f1f77bcf86cd799439019",
    "appointmentId": "507f1f77bcf86cd799439017",
    "initiatorId": "507f1f77bcf86cd799439011",
    "callType": "video",
    "status": "ongoing",
    "startTime": "2026-04-27T14:00:00Z",
    "roomId": "room-507f1f77bcf86cd7"
  }
}
```

### Get Call Status
**GET** `/api/calls/:callId/status`  
**Headers:** `Authorization: Bearer <token>`  
**Response:**
```json
{
  "success": true,
  "call": {
    "_id": "507f1f77bcf86cd799439019",
    "status": "ongoing",
    "participants": [
      {
        "userId": "507f1f77bcf86cd799439011",
        "name": "John Doe",
        "joinedAt": "2026-04-27T14:00:00Z"
      }
    ],
    "duration": 120
  }
}
```

### End Video Call
**POST** `/api/calls/:callId/end`  
**Headers:** `Authorization: Bearer <token>`  
**Body:**
```json
{
  "feedbackRating": 5,
  "feedbackComment": "Great consultation!"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Call ended successfully",
  "callData": {
    "_id": "507f1f77bcf86cd799439019",
    "status": "ended",
    "duration": 1200,
    "endTime": "2026-04-27T14:20:00Z"
  }
}
```

## Chat

### Send Message
**POST** `/api/chat/send`  
**Headers:** `Authorization: Bearer <token>`  
**Body:**
```json
{
  "recipientId": "507f1f77bcf86cd799439014",
  "message": "Hi Doctor, I have a question about my prescription.",
  "appointmentId": "507f1f77bcf86cd799439017"
}
```
**Response:**
```json
{
  "success": true,
  "message": {
    "_id": "507f1f77bcf86cd799439020",
    "senderId": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe"
    },
    "recipientId": {
      "_id": "507f1f77bcf86cd799439014",
      "name": "Dr. Smith"
    },
    "message": "Hi Doctor, I have a question...",
    "isRead": false,
    "createdAt": "2026-04-27T14:30:00Z"
  }
}
```

### Get Chat History
**GET** `/api/chat/history/:recipientId`  
**Headers:** `Authorization: Bearer <token>`  
**Query:** `?page=1&limit=20&appointmentId=507f...`  
**Response:**
```json
{
  "success": true,
  "messages": [
    {
      "_id": "507f1f77bcf86cd799439020",
      "senderId": { ... sender details ... },
      "recipientId": { ... recipient details ... },
      "message": "Hi Doctor, I have a question...",
      "isRead": true,
      "readAt": "2026-04-27T14:35:00Z",
      "createdAt": "2026-04-27T14:30:00Z"
    }
  ],
  "total": 45,
  "page": 1,
  "pages": 3
}
```

### Get All Conversations
**GET** `/api/chat/conversations`  
**Headers:** `Authorization: Bearer <token>`  
**Response:**
```json
{
  "success": true,
  "conversations": [
    {
      "conversationPartner": {
        "_id": "507f1f77bcf86cd799439014",
        "name": "Dr. Smith"
      },
      "lastMessage": "Sure, I'd be happy to help.",
      "unreadCount": 2,
      "lastMessageTime": "2026-04-27T14:32:00Z"
    }
  ]
}
```

### Mark Messages as Read
**POST** `/api/chat/mark-read`  
**Headers:** `Authorization: Bearer <token>`  
**Body:**
```json
{
  "senderId": "507f1f77bcf86cd799439014"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Messages marked as read"
}
```

### Get Unread Count
**GET** `/api/chat/unread-count`  
**Headers:** `Authorization: Bearer <token>`  
**Response:**
```json
{
  "success": true,
  "unreadCount": 5
}
```

### Delete Message
**DELETE** `/api/chat/message/:messageId`  
**Headers:** `Authorization: Bearer <token>`  
**Response:**
```json
{
  "success": true,
  "message": "Message deleted successfully"
}
```

### Search Messages
**GET** `/api/chat/search`  
**Headers:** `Authorization: Bearer <token>`  
**Query:** `?query=prescription&recipientId=507f...`  
**Response:**
```json
{
  "success": true,
  "results": [
    {
      "_id": "507f1f77bcf86cd799439020",
      "message": "Hi Doctor, I have a question about my prescription.",
      "senderId": { ... },
      "recipientId": { ... },
      "createdAt": "2026-04-27T14:30:00Z"
    }
  ]
}
```