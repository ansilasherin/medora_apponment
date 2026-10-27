# Doctor Appointment API — Complete Documentation

A comprehensive, production-ready REST API for managing doctor appointments, consultations, scheduling, user management, payments, video calls, and real-time chat.

**Local Base URL:** `http://localhost:5000`  
**Production Base URL:** `https://your-domain.com`

---

## 🔑 Test Login Credentials
All test accounts are already seeded in MongoDB. The default password for all test accounts is **`password123`**.

| Role | Email | Password | Description |
|---|---|---|---|
| **Admin** | `admin@hospital.com` | `password123` | Full administrative control (manage users, specialists, doctors, view payments) |
| **Patient** | `patient@example.com` | `password123` | John Doe (Book appointments, chat, make payments) |
| **Patient** | `anu@gmail.com` | `password123` | Anu (Second patient account for multi-user testing) |
| **Doctor** | `dr.john@hospital.com` | `password123` | Dr. John Smith (Cardiology) |
| **Doctor** | `dr.rahul@hospital.com` | `password123` | Dr. Rahul (Orthopedic) |
| **Doctor** | `dr.selin@hospital.com` | `password123` | Dr. Selin (Dentist) |
| **Doctor** | `dr.hazin@hospital.com` | `password123` | Dr. Hazin (Dermatologist) |
| **Doctor** | `dr.arjun@hospital.com` | `password123` | Dr. Arjun (Neurologist) |
| **Doctor** | `dr.meera@hospital.com` | `password123` | Dr. Meera (Pediatrician) |

> **Header for Protected Routes:**  
> `Authorization: Bearer <your_jwt_token>`

---

## 1. Authentication (`/api/auth`)

### 1.1 Register
**POST** `/api/auth/register`  
*Auth: Public*

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "+919876543299",
  "password": "password123",
  "role": "patient"
}
```
*Note: `role` can be `"patient"`, `"doctor"`, or `"admin"`. Defaults to `"patient"`.*

**Response (201 Created):**
```json
{
  "success": true,
  "status": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsIn...",
  "user": {
    "_id": "662f...",
    "id": "662f...",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "phone": "+919876543299",
    "role": "patient",
    "createdAt": "2026-10-27T12:00:00.000Z"
  }
}
```

### 1.2 Login
**POST** `/api/auth/login`  
*Auth: Public*

**Request Body:**
```json
{
  "email": "patient@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "status": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsIn...",
  "user": {
    "_id": "662f...",
    "name": "John Doe",
    "email": "patient@example.com",
    "phone": "+1234567890",
    "role": "patient"
  }
}
```

---

## 2. User Management (`/api/users`)

### 2.1 Get Own Profile
**GET** `/api/users/profile`  
*Auth: Bearer Token*

**Response:**
```json
{
  "success": true,
  "user": {
    "_id": "662f...",
    "name": "John Doe",
    "email": "patient@example.com",
    "phone": "+1234567890",
    "role": "patient",
    "dateOfBirth": "1992-06-15",
    "gender": "male",
    "address": "123 Marine Drive, City",
    "profilePic": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400"
  }
}
```

### 2.2 Update Profile
**PUT** `/api/users/profile`  
*Auth: Bearer Token*

**Request Body:**
```json
{
  "name": "Johnathan Doe",
  "dateOfBirth": "1992-06-15",
  "gender": "male",
  "address": "456 Palm Grove, Kochi",
  "profilePic": "https://example.com/new-pic.jpg"
}
```

### 2.3 List All Users (Admin)
**GET** `/api/users`  
*Auth: Admin Bearer Token*  
*Query Params: `?role=patient&page=1&limit=10&search=john`*

**Response:**
```json
{
  "success": true,
  "users": [...],
  "total": 9,
  "page": 1,
  "pages": 1
}
```

### 2.4 Delete User (Admin)
**DELETE** `/api/users/:userId`  
*Auth: Admin Bearer Token*

---

## 3. Specialists (`/api/specialists`)

### 3.1 List All Specialists
**GET** `/api/specialists`  
*Auth: Public*

**Response:**
```json
{
  "success": true,
  "specialists": [
    {
      "_id": "662f...",
      "name": "Cardiology",
      "icon": "🫀",
      "description": "Specialized in heart, blood vessels, and cardiovascular health.",
      "isActive": true
    },
    {
      "_id": "662f...",
      "name": "Dentist",
      "icon": "🦷",
      "description": "Comprehensive oral, teeth, gum care and dental surgeries.",
      "isActive": true
    }
  ]
}
```

### 3.2 Get Specialist by ID
**GET** `/api/specialists/:id`  
*Auth: Public*

### 3.3 Create Specialist (Admin)
**POST** `/api/specialists`  
*Auth: Admin Bearer Token*

**Request Body:**
```json
{
  "name": "Ophthalmology",
  "icon": "👁️",
  "description": "Eye care and vision health"
}
```

### 3.4 Update Specialist (Admin)
**PUT** `/api/specialists/:id`  
*Auth: Admin Bearer Token*

### 3.5 Delete Specialist (Admin)
**DELETE** `/api/specialists/:id`  
*Auth: Admin Bearer Token*

---

## 4. Doctors (`/api/doctors`)

### 4.1 List All Doctors
**GET** `/api/doctors`  
*Auth: Public*  
*Query Params: `?specialistId=...&search=rahul&page=1&limit=10`*

**Response:**
```json
{
  "success": true,
  "doctors": [
    {
      "_id": "662f...",
      "name": "Dr. John Smith",
      "photo": "https://thumbs.dreamstime.com/...",
      "specialistId": {
        "_id": "662f...",
        "name": "Cardiology",
        "icon": "🫀"
      },
      "consultationFee": 500,
      "experience": 10,
      "qualifications": ["MBBS", "MD - Cardiology", "FACC"],
      "licenseNumber": "CARD-10294",
      "rating": 4.9,
      "about": "A renowned cardiologist with over a decade of clinical experience..."
    }
  ],
  "total": 6,
  "page": 1,
  "pages": 1
}
```

### 4.2 Get Doctor by ID
**GET** `/api/doctors/:id`  
*Auth: Public*

### 4.3 Create Doctor (Admin)
**POST** `/api/doctors`  
*Auth: Admin Bearer Token*

**Request Body:**
```json
{
  "userId": "662f... (User ID with role doctor)",
  "specialistId": "662f...",
  "name": "Dr. Sarah",
  "licenseNumber": "MED-5501",
  "experience": 5,
  "qualifications": ["MBBS", "MD"],
  "consultationFee": 400,
  "about": "Specialist biography...",
  "photo": "https://example.com/doctor.jpg"
}
```

### 4.4 Update Doctor
**PUT** `/api/doctors/:id`  
*Auth: Bearer Token*

### 4.5 Delete Doctor (Admin)
**DELETE** `/api/doctors/:id`  
*Auth: Admin Bearer Token*

---

## 5. Time Slots (`/api/slots`)

### 5.1 Get Available Slots for a Doctor
**GET** `/api/slots/doctor/:doctorId`  
*Auth: Public*  
*Query Params:*  
- `?date=YYYY-MM-DD` *(Optional: Filter by date)*  
- `?available=true` *(Optional: Filter only available slots)*

**Response:**
```json
{
  "success": true,
  "slots": [
    {
      "_id": "662f...",
      "doctorId": "662f...",
      "date": "2026-10-27",
      "time": "09:00 AM",
      "startTime": "2026-10-27T09:00:00Z",
      "endTime": "2026-10-27T09:30:00Z",
      "isAvailable": true,
      "isBooked": false
    }
  ]
}
```

### 5.2 Create Single Slot
**POST** `/api/slots`  
*Auth: Doctor / Admin Bearer Token*

**Request Body:**
```json
{
  "doctorId": "662f...",
  "startTime": "2026-10-28T10:00:00Z",
  "endTime": "2026-10-28T10:30:00Z",
  "date": "2026-10-28",
  "time": "10:00 AM"
}
```

### 5.3 Batch Add Slots for Doctor (Convenience)
**POST** `/api/doctors/:id/slots`  
*Auth: Doctor / Admin Bearer Token*

**Request Body:**
```json
{
  "date": "2026-10-30",
  "times": ["09:00 AM", "10:30 AM", "02:00 PM", "04:30 PM"]
}
```

### 5.4 Update Slot Availability
**PATCH** `/api/slots/:id`  
*Auth: Doctor / Admin Bearer Token*

**Request Body:**
```json
{ "isAvailable": false }
```

### 5.5 Delete Slot
**DELETE** `/api/slots/:id`  
*Auth: Doctor / Admin Bearer Token*

---

## 6. Appointments (`/api/appointments`)

### 6.1 Book Appointment
**POST** `/api/appointments`  
*Auth: Patient Bearer Token*

**Request Body:**
```json
{
  "doctorId": "662f...",
  "slotId": "662f...",
  "patientName": "John Doe",
  "age": 32,
  "gender": "male",
  "problem": "Frequent headaches and dizziness",
  "notes": "Please prescribe medication if necessary"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "status": true,
  "message": "Appointment booked successfully",
  "appointment_id": "662f...",
  "amount": 500,
  "appointment": {
    "_id": "662f...",
    "userId": "662f...",
    "patientId": "662f...",
    "doctorId": "662f...",
    "slotId": "662f...",
    "patientName": "John Doe",
    "amount": 500,
    "status": "pending",
    "paymentStatus": "unpaid",
    "appointmentDate": "2026-10-28T09:00:00Z"
  }
}
```

### 6.2 List Appointments
**GET** `/api/appointments`  
*Auth: Bearer Token*  
*Query Params: `?status=pending|confirmed|cancelled&doctorId=...&page=1`*

### 6.3 Get Appointment by ID
**GET** `/api/appointments/:id`  
*Auth: Bearer Token*

### 6.4 Update Appointment
**PUT** `/api/appointments/:id`  
*Auth: Bearer Token*

**Request Body:**
```json
{
  "status": "confirmed",
  "notes": "Patient arrived on time."
}
```

### 6.5 Cancel Appointment
**PATCH** `/api/appointments/:id`  
*Auth: Bearer Token*

**Request Body:**
```json
{
  "reason": "Emergency travel arose."
}
```

### 6.6 Download Appointment Receipt PDF
**GET** `/api/appointments/:id/pdf`  
*Auth: Bearer Token*  
*Returns a downloadable PDF receipt generated via PDFKit.*

---

## 7. Payments (`/api/payments`)

### 7.1 Initiate Payment
**POST** `/api/payments/initiate`  
*Auth: Bearer Token*

**Request Body:**
```json
{
  "appointmentId": "662f...",
  "amount": 500,
  "paymentMethod": "card"
}
```

**Response:**
```json
{
  "success": true,
  "payment": {
    "_id": "662f...",
    "amount": 500,
    "currency": "INR",
    "status": "pending",
    "paymentUrl": "https://payment-gateway.com/pay/TXN..."
  }
}
```

### 7.2 Direct Pay (Confirm Booking Instantly)
**POST** `/api/payments/pay`  
*Auth: Bearer Token*

**Request Body:**
```json
{
  "appointmentId": "662f...",
  "paymentMethod": "upi"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment completed successfully",
  "appointment_id": "662f...",
  "booking_status": "confirmed",
  "payment": {
    "status": "completed",
    "transactionId": "TXN..."
  }
}
```

### 7.3 List All Payments (Admin)
**GET** `/api/payments`  
*Auth: Admin Bearer Token*

---

## 8. Real-time Chat (`/api/chat`)

### 8.1 Send Message
**POST** `/api/chat/send`  
*Auth: Bearer Token*

**Request Body:**
```json
{
  "recipientId": "662f... (Doctor or Patient User ID)",
  "message": "Hello Doctor, can I take the medication before breakfast?",
  "appointmentId": "662f... (Optional)"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Message sent successfully",
  "chatMessage": {
    "_id": "662f...",
    "senderId": { "name": "John Doe", "role": "patient" },
    "recipientId": { "name": "Dr. John Smith", "role": "doctor" },
    "message": "Hello Doctor, can I take the medication before breakfast?",
    "isRead": false,
    "createdAt": "2026-10-27T12:00:00Z"
  }
}
```

### 8.2 Get Chat History
**GET** `/api/chat/history/:recipientId`  
*Auth: Bearer Token*  
*Query Params: `?page=1&limit=50&appointmentId=...`*

### 8.3 Get All Active Conversations
**GET** `/api/chat/conversations`  
*Auth: Bearer Token*

**Response:**
```json
{
  "success": true,
  "conversations": [
    {
      "conversationPartner": {
        "_id": "662f...",
        "name": "Dr. John Smith",
        "profilePic": "...",
        "role": "doctor"
      },
      "lastMessage": "Please bring any past ECG reports.",
      "unreadCount": 1
    }
  ]
}
```

### 8.4 Get Unread Messages Count
**GET** `/api/chat/unread-count`  
*Auth: Bearer Token*

**Response:**
```json
{
  "success": true,
  "unreadCount": 1
}
```

### 8.5 Mark Messages as Read
**POST** `/api/chat/mark-read`  
*Auth: Bearer Token*

**Request Body:**
```json
{
  "senderId": "662f..."
}
```

### 8.6 Search Messages
**GET** `/api/chat/search?query=ecg`  
*Auth: Bearer Token*

### 8.7 Delete Message
**DELETE** `/api/chat/message/:messageId`  
*Auth: Bearer Token*

---

## 9. Video & Audio Calls (`/api/calls`)

### 9.1 Start a Call
**POST** `/api/calls/start`  
*Auth: Bearer Token*

**Request Body:**
```json
{
  "appointmentId": "662f...",
  "callType": "video"
}
```
*Note: `callType` can be `"video"` or `"audio"`.*

**Response:**
```json
{
  "success": true,
  "message": "Call started successfully",
  "call": {
    "_id": "call_662f_1730000000",
    "callType": "video",
    "status": "ongoing",
    "roomId": "room-662f...",
    "startTime": "2026-10-27T12:00:00Z"
  }
}
```

### 9.2 Get Call Status
**GET** `/api/calls/:callId/status` or `GET /api/calls/status/:appointmentId`  
*Auth: Bearer Token*

### 9.3 End Call & Submit Feedback
**POST** `/api/calls/:callId/end` or `POST /api/calls/end/:appointmentId`  
*Auth: Bearer Token*

**Request Body:**
```json
{
  "feedbackRating": 5,
  "feedbackComment": "Great consultation, thank you Doctor!"
}
```

### 9.4 Call History
**GET** `/api/calls/history`  
*Auth: Bearer Token*

### 9.5 Browser Test Client for WebRTC Calls
Open in browser:  
`http://localhost:5000/video-call.html`

---

## 10. Health Check & Root
- **Root:** `GET http://localhost:5000/api`
- **Health:** `GET http://localhost:5000/api/health`

---
*Generated & Verified for Medora / FeelGood Doctor Appointment Backend.*