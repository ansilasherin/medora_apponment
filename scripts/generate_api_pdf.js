const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

function generatePDF() {
  const outputPath = path.join(__dirname, "../Doctor_Appointment_API_Documentation.pdf");
  const publicOutputPath = path.join(__dirname, "../public/Doctor_Appointment_API_Documentation.pdf");

  const doc = new PDFDocument({
    margin: 40,
    size: "A4",
    bufferPages: true
  });

  const writeStream = fs.createWriteStream(outputPath);
  doc.pipe(writeStream);

  const colors = {
    primary: "#1e3a8a",       // Deep blue
    secondary: "#0284c7",     // Teal blue
    text: "#1f2937",          // Dark gray
    muted: "#64748b",         // Slate gray
    bgLight: "#f8fafc",       // Very light gray
    border: "#cbd5e1",        // Border gray
    get: "#16a34a",           // Green
    post: "#2563eb",          // Blue
    put: "#d97706",           // Amber
    patch: "#9333ea",         // Purple
    delete: "#dc2626"         // Red
  };

  // Helper functions
  function addHeader(title, subtitle) {
    doc.rect(40, 35, 515, 65).fill("#0f172a");
    doc.fillColor("#ffffff").fontSize(20).font("Helvetica-Bold").text(title, 55, 48);
    doc.fillColor("#94a3b8").fontSize(10).font("Helvetica").text(subtitle, 55, 75);
    doc.moveDown(2);
    doc.y = 115;
  }

  function addSectionHeading(text) {
    if (doc.y > 680) doc.addPage();
    doc.moveDown(0.8);
    doc.fillColor(colors.primary).fontSize(14).font("Helvetica-Bold").text(text);
    doc.strokeColor(colors.secondary).lineWidth(1.5).moveTo(40, doc.y + 2).lineTo(200, doc.y + 2).stroke();
    doc.moveDown(0.6);
  }

  function addEndpoint(method, pathStr, desc, auth) {
    if (doc.y > 670) doc.addPage();
    doc.moveDown(0.5);

    const m = method.toUpperCase();
    let badgeColor = colors.get;
    if (m === "POST") badgeColor = colors.post;
    if (m === "PUT") badgeColor = colors.put;
    if (m === "PATCH") badgeColor = colors.patch;
    if (m === "DELETE") badgeColor = colors.delete;

    // Draw method badge
    const curY = doc.y;
    doc.rect(40, curY, 48, 16).fill(badgeColor);
    doc.fillColor("#ffffff").fontSize(9).font("Helvetica-Bold").text(m, 40, curY + 3, { width: 48, align: "center" });

    // Endpoint URL
    doc.fillColor("#0f172a").fontSize(10).font("Helvetica-Bold").text(pathStr, 96, curY + 3);

    // Auth badge
    if (auth) {
      doc.fillColor(colors.muted).fontSize(8).font("Helvetica-Oblique").text(`[Auth: ${auth}]`, 420, curY + 3, { align: "right", width: 130 });
    }

    doc.y = curY + 22;
    if (desc) {
      doc.fillColor(colors.muted).fontSize(9).font("Helvetica").text(desc, 45, doc.y);
      doc.moveDown(0.3);
    }
  }

  function addCodeBlock(code) {
    if (doc.y > 650) doc.addPage();
    const curY = doc.y;
    const lines = code.trim().split("\n");
    const blockHeight = lines.length * 11 + 14;

    if (curY + blockHeight > 750) {
      doc.addPage();
    }

    const startY = doc.y;
    doc.rect(40, startY, 515, blockHeight).fill("#f1f5f9");
    doc.strokeColor("#e2e8f0").lineWidth(1).rect(40, startY, 515, blockHeight).stroke();

    doc.fillColor("#0f172a").fontSize(8).font("Courier").text(code.trim(), 48, startY + 8, {
      width: 500,
      lineGap: 1.5
    });
    doc.y = startY + blockHeight + 6;
  }

  function addTable(headers, rows) {
    if (doc.y > 660) doc.addPage();
    const curY = doc.y;
    const colWidth = 515 / headers.length;

    // Header row
    doc.rect(40, curY, 515, 18).fill("#e2e8f0");
    headers.forEach((h, i) => {
      doc.fillColor("#1e293b").fontSize(8.5).font("Helvetica-Bold").text(h, 45 + i * colWidth, curY + 4, { width: colWidth - 8 });
    });

    let rowY = curY + 18;
    rows.forEach((row, rIdx) => {
      if (rowY > 740) {
        doc.addPage();
        rowY = 50;
      }
      if (rIdx % 2 === 1) {
        doc.rect(40, rowY, 515, 16).fill("#f8fafc");
      }
      row.forEach((cell, cIdx) => {
        doc.fillColor("#334155").fontSize(8).font("Helvetica").text(String(cell), 45 + cIdx * colWidth, rowY + 3, { width: colWidth - 8 });
      });
      rowY += 16;
    });

    doc.y = rowY + 8;
  }

  // --- COVER & TITLE ---
  addHeader(
    "Doctor Appointment API Documentation",
    "Production-Ready REST API for Flutter & Web Applications | Base URL: https://medora-apponment-5.onrender.com"
  );

  // Section: Overview & Server Info
  addSectionHeading("1. Server Overview & Credentials");
  doc.fillColor(colors.text).fontSize(9.5).font("Helvetica").text(
    "This API provides complete backend functionality for patient appointments, doctor scheduling, video consultations, and messaging. Password for all seeded accounts is: password123"
  );
  doc.moveDown(0.5);

  addTable(
    ["Role", "Email", "Password", "Permissions"],
    [
      ["Patient", "patient@example.com", "password123", "Book appointments, chat, make payment"],
      ["Patient", "anu@gmail.com", "password123", "Alternate patient account"],
      ["Doctor", "dr.john@hospital.com", "password123", "Cardiologist (Slots, Consultations)"],
      ["Doctor", "dr.rahul@hospital.com", "password123", "Orthopedic Surgeon"],
      ["Admin", "admin@hospital.com", "password123", "Full Administrative Access"]
    ]
  );

  // Section: Flutter Setup
  addSectionHeading("2. Flutter Integration Setup");
  doc.fillColor(colors.text).fontSize(9).font("Helvetica").text("Add this base configuration to your Flutter project (lib/services/api_service.dart):");
  addCodeBlock(
`class ApiConfig {
  static const String baseUrl = "https://medora-apponment-5.onrender.com";
  
  static Map<String, String> headers([String? token]) => {
    "Content-Type": "application/json",
    if (token != null) "Authorization": "Bearer $token",
  };
}`
  );

  // Section: Authentication
  addSectionHeading("3. Authentication Endpoints (/api/auth)");

  addEndpoint("POST", "/api/auth/login", "Authenticate patient, doctor, or admin. Returns JWT token.", "Public");
  addCodeBlock(
`// Request Body:
{
  "email": "patient@example.com",
  "password": "password123"
}

// Success Response (200 OK):
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsIn...",
  "user": {
    "_id": "671e...",
    "name": "John Doe",
    "email": "patient@example.com",
    "role": "patient"
  }
}`
  );

  addEndpoint("POST", "/api/auth/register", "Register a new user account.", "Public");
  addCodeBlock(
`// Request Body:
{
  "name": "Ansil Sherin",
  "email": "ansil@example.com",
  "phone": "+919876543210",
  "password": "password123",
  "role": "patient" // "patient" | "doctor" | "admin"
}`
  );

  // Section: User Profile
  addSectionHeading("4. User Profile Endpoints (/api/users)");

  addEndpoint("GET", "/api/users/profile", "Get logged-in user profile information.", "Bearer Token");
  addCodeBlock(
`// Success Response (200 OK):
{
  "success": true,
  "user": {
    "_id": "671e...",
    "name": "John Doe",
    "email": "patient@example.com",
    "phone": "+1234567890",
    "role": "patient",
    "dateOfBirth": "1992-06-15",
    "gender": "male",
    "address": "123 Marine Drive, Kochi"
  }
}`
  );

  addEndpoint("PUT", "/api/users/profile", "Update user profile details.", "Bearer Token");
  addCodeBlock(
`// Request Body:
{
  "name": "John Doe",
  "gender": "male",
  "dateOfBirth": "1992-06-15",
  "address": "Kochi, Kerala",
  "profilePic": "https://example.com/pic.jpg"
}`
  );

  // Section: Specialists
  addSectionHeading("5. Specialists / Categories (/api/specialists)");

  addEndpoint("GET", "/api/specialists", "List all medical departments for home screen carousel.", "Public");
  addCodeBlock(
`// Success Response (200 OK):
{
  "success": true,
  "specialists": [
    { "_id": "671e...", "name": "Cardiology", "icon": "🫀", "description": "Heart & Vascular" },
    { "_id": "671e...", "name": "Dentist", "icon": "🦷", "description": "Dental Care" },
    { "_id": "671e...", "name": "Dermatologist", "icon": "🧴", "description": "Skin & Hair" },
    { "_id": "671e...", "name": "Neurologist", "icon": "🧠", "description": "Brain & Spine" },
    { "_id": "671e...", "name": "Orthopedic", "icon": "🦴", "description": "Bones & Joints" },
    { "_id": "671e...", "name": "Pediatrician", "icon": "👶", "description": "Child Healthcare" }
  ]
}`
  );

  // Section: Doctors
  addSectionHeading("6. Doctors Endpoints (/api/doctors)");

  addEndpoint("GET", "/api/doctors", "List all doctors. Supports ?specialistId=... and ?search=...", "Public");
  addCodeBlock(
`// Query Options:
// GET /api/doctors?specialistId=671e... (Filter by specialty)
// GET /api/doctors?search=rahul       (Search doctor name)

// Success Response (200 OK):
{
  "success": true,
  "doctors": [
    {
      "_id": "671e...",
      "name": "Dr. John Smith",
      "photo": "https://...",
      "specialistId": { "name": "Cardiology", "icon": "🫀" },
      "consultationFee": 500,
      "experience": 10,
      "qualifications": ["MBBS", "MD - Cardiology", "FACC"],
      "rating": 4.9,
      "about": "A renowned cardiologist with over a decade of clinical experience."
    }
  ]
}`
  );

  addEndpoint("GET", "/api/doctors/:doctorId", "Get detailed profile of a single doctor.", "Public");

  // Section: Slots
  addSectionHeading("7. Time Slots & Calendar (/api/slots)");

  addEndpoint("GET", "/api/slots/doctor/:doctorId", "Get available slots for a doctor on a specific date.", "Public");
  addCodeBlock(
`// Query Options: ?date=2026-10-28&available=true

// Success Response (200 OK):
{
  "success": true,
  "slots": [
    {
      "_id": "671e_slot_1",
      "doctorId": "671e_doc_1",
      "date": "2026-10-28",
      "time": "09:00 AM",
      "isAvailable": true,
      "isBooked": false
    },
    {
      "_id": "671e_slot_2",
      "doctorId": "671e_doc_1",
      "date": "2026-10-28",
      "time": "10:00 AM",
      "isAvailable": true,
      "isBooked": false
    }
  ]
}`
  );

  // Section: Appointments
  addSectionHeading("8. Appointments Booking (/api/appointments)");

  addEndpoint("POST", "/api/appointments", "Book an appointment for a slot.", "Bearer Token");
  addCodeBlock(
`// Request Body:
{
  "doctorId": "671e_doc_1",
  "slotId": "671e_slot_1",
  "patientName": "Ansil Sherin",
  "age": 25,
  "gender": "male",
  "problem": "Chest discomfort after workout",
  "notes": "First consultation"
}

// Success Response (201 Created):
{
  "success": true,
  "message": "Appointment booked successfully",
  "appointment_id": "671e_appt_99",
  "amount": 500,
  "appointment": {
    "_id": "671e_appt_99",
    "status": "pending",
    "paymentStatus": "unpaid",
    "amount": 500
  }
}`
  );

  addEndpoint("GET", "/api/appointments", "Get current user's appointments list.", "Bearer Token");
  addEndpoint("GET", "/api/appointments/:id", "Get single appointment details.", "Bearer Token");
  addEndpoint("PATCH", "/api/appointments/:id", "Cancel an appointment with reason.", "Bearer Token");
  addCodeBlock(
`// Cancel Request Body:
{
  "reason": "Personal emergency, need to reschedule."
}`
  );

  addEndpoint("GET", "/api/appointments/:id/pdf", "Download appointment receipt slip as PDF.", "None (Public)");

  // Section: Payments
  addSectionHeading("9. Payments Flow (/api/payments)");

  addEndpoint("POST", "/api/payments/pay", "Instant payment simulation. Confirms appointment booking.", "Bearer Token");
  addCodeBlock(
`// Request Body:
{
  "appointmentId": "671e_appt_99",
  "paymentMethod": "upi" // "upi" | "card" | "netbanking"
}

// Success Response (200 OK):
{
  "success": true,
  "message": "Payment completed successfully",
  "booking_status": "confirmed",
  "appointment_id": "671e_appt_99"
}`
  );

  // Section: Chat
  addSectionHeading("10. Real-time In-App Chat (/api/chat)");

  addEndpoint("POST", "/api/chat/send", "Send a message to doctor or patient.", "Bearer Token");
  addCodeBlock(
`// Request Body:
{
  "recipientId": "671e_doctor_user_id",
  "message": "Hello Doctor, do I need to bring old prescription?"
}

// Success Response (201 Created):
{
  "success": true,
  "message": "Message sent successfully",
  "chatMessage": {
    "_id": "671e_chat_1",
    "message": "Hello Doctor, do I need to bring old prescription?",
    "isRead": false
  }
}`
  );

  addEndpoint("GET", "/api/chat/conversations", "List all active chat conversations with unread counts.", "Bearer Token");
  addEndpoint("GET", "/api/chat/history/:recipientId", "Get chat message history with a specific person.", "Bearer Token");
  addEndpoint("POST", "/api/chat/mark-read", "Mark all messages from sender as read.", "Bearer Token");

  // Section: Video Consultation
  addSectionHeading("11. Video Consultation (/api/calls)");

  addEndpoint("POST", "/api/calls/start", "Start video or audio consultation call.", "Bearer Token");
  addCodeBlock(
`// Request Body:
{
  "appointmentId": "671e_appt_99",
  "callType": "video" // "video" | "audio"
}

// Success Response (200 OK):
{
  "success": true,
  "call": {
    "roomId": "room-671e_appt_99",
    "status": "ongoing",
    "callType": "video"
  }
}`
  );

  addEndpoint("POST", "/api/calls/:callId/end", "End call and submit optional rating & feedback.", "Bearer Token");
  addCodeBlock(
`// Request Body:
{
  "feedbackRating": 5,
  "feedbackComment": "Excellent consultation by Dr. John."
}`
  );

  // Footers with page numbering
  const totalPages = doc.bufferedPageRange().count;
  for (let i = 0; i < totalPages; i++) {
    doc.switchToPage(i);
    doc.fillColor("#94a3b8").fontSize(8).font("Helvetica").text(
      `Medora Doctor Appointment API Documentation  |  Page ${i + 1} of ${totalPages}`,
      40,
      790,
      { width: 515, align: "center" }
    );
  }

  doc.end();

  writeStream.on("finish", () => {
    // Copy to public folder so it can be downloaded via URL
    fs.copyFileSync(outputPath, publicOutputPath);
    console.log("✅ PDF successfully created at:", outputPath);
    console.log("✅ Copied to public folder for direct browser download!");
    process.exit(0);
  });
}

generatePDF();
