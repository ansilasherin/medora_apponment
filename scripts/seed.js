require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../src/models/User");
const Specialist = require("../src/models/Specialist");
const Doctor = require("../src/models/Doctor");
const Slot = require("../src/models/Slot");
const Appointment = require("../src/models/Appointment");
const Chat = require("../src/models/Chat");
const Payment = require("../src/models/Payment");

async function seed() {
  try {
    console.log("🌱 Starting Database Seeding...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const defaultPassword = "password123";
    const passwordHash = await bcrypt.hash(defaultPassword, 10);

    // 1. Create or Update Users
    console.log("👤 Seeding Users...");
    const usersData = [
      {
        name: "Hospital Admin",
        email: "admin@hospital.com",
        phone: "+919876543200",
        role: "admin",
        passwordHash,
        gender: "male",
        address: "Hospital Admin Block, Level 4",
        profilePic: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400"
      },
      {
        name: "John Doe",
        email: "patient@example.com",
        phone: "+1234567890",
        role: "patient",
        passwordHash,
        dateOfBirth: "1992-06-15",
        gender: "male",
        address: "123 Marine Drive, City",
        profilePic: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400"
      },
      {
        name: "Anu",
        email: "anu@gmail.com",
        phone: "+919847112233",
        role: "patient",
        passwordHash,
        dateOfBirth: "1996-03-22",
        gender: "female",
        address: "Hill View Heights, Kochi",
        profilePic: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400"
      },
      // Doctors users
      {
        name: "Dr. John Smith",
        email: "dr.john@hospital.com",
        phone: "+919847000001",
        role: "doctor",
        passwordHash,
        gender: "male",
        profilePic: "https://thumbs.dreamstime.com/b/happy-smiling-black-doctor-looking-camera-african-medical-office-portrait-man-working-laptop-modern-hospital-confident-164999333.jpg"
      },
      {
        name: "Dr. Selin",
        email: "dr.selin@hospital.com",
        phone: "+919847000002",
        role: "doctor",
        passwordHash,
        gender: "female",
        profilePic: "https://static.vecteezy.com/system/resources/previews/007/483/472/large_2x/a-young-doctor-woman-wears-a-lab-coat-and-stethoscope-in-hospital-free-photo.jpg"
      },
      {
        name: "Dr. Hazin",
        email: "dr.hazin@hospital.com",
        phone: "+919847000003",
        role: "doctor",
        passwordHash,
        gender: "male",
        profilePic: "https://static.vecteezy.com/system/resources/thumbnails/026/375/249/small/ai-generative-portrait-of-confident-male-doctor-in-white-coat-and-stethoscope-standing-with-arms-crossed-and-looking-at-camera-photo.jpg"
      },
      {
        name: "Dr. Arjun",
        email: "dr.arjun@hospital.com",
        phone: "+919847000004",
        role: "doctor",
        passwordHash,
        gender: "male",
        profilePic: "https://www.shutterstock.com/image-photo/cheerful-young-hispanic-doctor-man-600nw-2650128219.jpg"
      },
      {
        name: "Dr. Rahul",
        email: "dr.rahul@hospital.com",
        phone: "+919847000005",
        role: "doctor",
        passwordHash,
        gender: "male",
        profilePic: "https://t4.ftcdn.net/jpg/01/36/18/77/360_F_136187711_qeBMOwkPdTg1dCN8e5TR1AmduXDz60Xn.jpg"
      },
      {
        name: "Dr. Meera",
        email: "dr.meera@hospital.com",
        phone: "+919847000006",
        role: "doctor",
        passwordHash,
        gender: "female",
        profilePic: "https://img.freepik.com/free-photo/attractive-medical-professional-uniform-standing-with-arms-crossed-against-isolated-background_662251-416.jpg?semt=ais_hybrid&w=740&q=80"
      }
    ];

    const userMap = {};
    for (const u of usersData) {
      let existing = await User.findOne({
        $or: [{ email: u.email }, { phone: u.phone }]
      });
      if (!existing) {
        existing = await User.create(u);
      } else {
        existing.name = u.name;
        existing.email = u.email;
        existing.phone = u.phone;
        existing.role = u.role;
        existing.passwordHash = passwordHash;
        if (u.profilePic) existing.profilePic = u.profilePic;
        if (u.dateOfBirth) existing.dateOfBirth = u.dateOfBirth;
        if (u.gender) existing.gender = u.gender;
        if (u.address) existing.address = u.address;
        await existing.save();
      }
      userMap[u.email] = existing;
    }
    console.log(`✅ ${Object.keys(userMap).length} Users seeded.`);

    // 2. Specialists
    console.log("🩺 Seeding Specialists...");
    const specialistsData = [
      {
        name: "Cardiology",
        icon: "🫀",
        description: "Specialized in heart, blood vessels, and cardiovascular health."
      },
      {
        name: "Dentist",
        icon: "🦷",
        description: "Comprehensive oral, teeth, gum care and dental surgeries."
      },
      {
        name: "Dermatologist",
        icon: "🧴",
        description: "Expert care for skin conditions, hair, aesthetics and nails."
      },
      {
        name: "Neurologist",
        icon: "🧠",
        description: "Disorders of the nervous system, brain, spine and nerves."
      },
      {
        name: "Orthopedic",
        icon: "🦴",
        description: "Bones, joints, ligaments, spine and musculoskeletal injuries."
      },
      {
        name: "Pediatrician",
        icon: "👶",
        description: "Dedicated medical care for infants, children, and adolescents."
      }
    ];

    const specialistMap = {};
    for (const s of specialistsData) {
      let existing = await Specialist.findOne({ name: s.name });
      if (!existing) {
        existing = await Specialist.create({ ...s, isActive: true });
      } else {
        existing.icon = s.icon;
        existing.description = s.description;
        existing.isActive = true;
        await existing.save();
      }
      specialistMap[s.name] = existing;
    }
    console.log(`✅ ${Object.keys(specialistMap).length} Specialists seeded.`);

    // 3. Doctors
    console.log("👨‍⚕️ Seeding Doctors...");
    const doctorsData = [
      {
        name: "Dr. John Smith",
        userEmail: "dr.john@hospital.com",
        specialistName: "Cardiology",
        consultationFee: 500,
        experience: 10,
        qualifications: ["MBBS", "MD - Cardiology", "FACC"],
        licenseNumber: "CARD-10294",
        rating: 4.9,
        about: "A renowned cardiologist with over a decade of clinical experience diagnosing and treating cardiovascular diseases with utmost compassion.",
        biography: "Dr. John Smith completed his MD at AIIMS and specialized fellowship in interventional cardiology.",
        photo: "https://thumbs.dreamstime.com/b/happy-smiling-black-doctor-looking-camera-african-medical-office-portrait-man-working-laptop-modern-hospital-confident-164999333.jpg"
      },
      {
        name: "Dr. Selin",
        userEmail: "dr.selin@hospital.com",
        specialistName: "Dentist",
        consultationFee: 350,
        experience: 8,
        qualifications: ["BDS", "MDS - Orthodontics"],
        licenseNumber: "DENT-44812",
        rating: 4.8,
        about: "Expert in smile makeovers, orthodontics, root canals, and gentle pain-free dental care.",
        biography: "Passionate about preventive dentistry and bringing confident smiles to patients.",
        photo: "https://static.vecteezy.com/system/resources/previews/007/483/472/large_2x/a-young-doctor-woman-wears-a-lab-coat-and-stethoscope-in-hospital-free-photo.jpg"
      },
      {
        name: "Dr. Hazin",
        userEmail: "dr.hazin@hospital.com",
        specialistName: "Dermatologist",
        consultationFee: 550,
        experience: 9,
        qualifications: ["MBBS", "MD - Dermatology"],
        licenseNumber: "DERM-88231",
        rating: 4.7,
        about: "Consultant dermatologist treating chronic acne, eczema, allergies, and cosmetic skin therapies.",
        biography: "Specialized in advanced dermatological laser procedures and clinical skincare.",
        photo: "https://static.vecteezy.com/system/resources/thumbnails/026/375/249/small/ai-generative-portrait-of-confident-male-doctor-in-white-coat-and-stethoscope-standing-with-arms-crossed-and-looking-at-camera-photo.jpg"
      },
      {
        name: "Dr. Arjun",
        userEmail: "dr.arjun@hospital.com",
        specialistName: "Neurologist",
        consultationFee: 600,
        experience: 11,
        qualifications: ["MBBS", "MD", "DM - Neurology"],
        licenseNumber: "NEUR-90214",
        rating: 4.9,
        about: "Specialist in migraines, neurological rehabilitation, epilepsy, and cognitive neurological health.",
        biography: "Senior neurologist trained in neuro-electrophysiology and brain disorders.",
        photo: "https://www.shutterstock.com/image-photo/cheerful-young-hispanic-doctor-man-600nw-2650128219.jpg"
      },
      {
        name: "Dr. Rahul",
        userEmail: "dr.rahul@hospital.com",
        specialistName: "Orthopedic",
        consultationFee: 550,
        experience: 12,
        qualifications: ["MBBS", "MS - Orthopedics"],
        licenseNumber: "ORTH-33902",
        rating: 4.9,
        about: "Top orthopedic surgeon specializing in joint replacement, sports injury recovery, and spine wellness.",
        biography: "Has performed over 1,500 successful joint and fracture surgeries.",
        photo: "https://t4.ftcdn.net/jpg/01/36/18/77/360_F_136187711_qeBMOwkPdTg1dCN8e5TR1AmduXDz60Xn.jpg"
      },
      {
        name: "Dr. Meera",
        userEmail: "dr.meera@hospital.com",
        specialistName: "Pediatrician",
        consultationFee: 500,
        experience: 7,
        qualifications: ["MBBS", "DCH", "MD - Pediatrics"],
        licenseNumber: "PED-66103",
        rating: 4.8,
        about: "Compassionate child healthcare specialist dedicated to infant development, vaccinations, and pediatric wellness.",
        biography: "Dedicated pediatric practitioner with special interest in newborn care and childhood nutrition.",
        photo: "https://img.freepik.com/free-photo/attractive-medical-professional-uniform-standing-with-arms-crossed-against-isolated-background_662251-416.jpg?semt=ais_hybrid&w=740&q=80"
      }
    ];

    const doctorDocs = [];
    for (const d of doctorsData) {
      const user = userMap[d.userEmail];
      const specialist = specialistMap[d.specialistName];

      let existing = await Doctor.findOne({
        $or: [{ name: d.name }, { userId: user._id }]
      });

      if (!existing) {
        existing = await Doctor.create({
          userId: user._id,
          name: d.name,
          specialistId: specialist._id,
          consultationFee: d.consultationFee,
          experience: d.experience,
          qualifications: d.qualifications,
          licenseNumber: d.licenseNumber,
          rating: d.rating,
          about: d.about,
          biography: d.biography,
          photo: d.photo
        });
      } else {
        existing.userId = user._id;
        existing.specialistId = specialist._id;
        existing.consultationFee = d.consultationFee;
        existing.experience = d.experience;
        existing.qualifications = d.qualifications;
        existing.licenseNumber = d.licenseNumber;
        existing.rating = d.rating;
        existing.about = d.about;
        existing.biography = d.biography;
        existing.photo = d.photo;
        await existing.save();
      }
      doctorDocs.push(existing);
    }
    console.log(`✅ ${doctorDocs.length} Doctors seeded.`);

    // 4. Slots Seeding (Generate for today + next 6 days)
    console.log("⏰ Seeding Time Slots for all doctors...");
    await Slot.deleteMany({}); // Fresh slots

    const timeSlots = [
      { time: "09:00 AM", startTimeHours: "09:00:00", endTimeHours: "09:30:00" },
      { time: "10:00 AM", startTimeHours: "10:00:00", endTimeHours: "10:30:00" },
      { time: "11:30 AM", startTimeHours: "11:30:00", endTimeHours: "12:00:00" },
      { time: "02:00 PM", startTimeHours: "14:00:00", endTimeHours: "14:30:00" },
      { time: "03:30 PM", startTimeHours: "15:30:00", endTimeHours: "16:00:00" },
      { time: "05:00 PM", startTimeHours: "17:00:00", endTimeHours: "17:30:00" }
    ];

    const slotsToInsert = [];
    const now = new Date();

    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const d = new Date(now);
      d.setDate(now.getDate() + dayOffset);
      const dateStr = d.toISOString().split("T")[0]; // "YYYY-MM-DD"

      for (const doc of doctorDocs) {
        for (const slotTime of timeSlots) {
          slotsToInsert.push({
            doctorId: doc._id,
            date: dateStr,
            time: slotTime.time,
            startTime: `${dateStr}T${slotTime.startTimeHours}Z`,
            endTime: `${dateStr}T${slotTime.endTimeHours}Z`,
            isAvailable: true,
            isBooked: false
          });
        }
      }
    }

    const insertedSlots = await Slot.insertMany(slotsToInsert);
    console.log(`✅ ${insertedSlots.length} Time Slots successfully created!`);

    // 5. Sample Booked Appointments
    console.log("📅 Seeding Sample Appointments...");
    await Appointment.deleteMany({});

    const patientUser = userMap["patient@example.com"];
    const drJohn = doctorDocs[0];
    const drRahul = doctorDocs[4];

    // Pick 2 slots to book
    const slot1 = insertedSlots.find(s => s.doctorId.toString() === drJohn._id.toString());
    const slot2 = insertedSlots.find(s => s.doctorId.toString() === drRahul._id.toString());

    if (slot1) {
      slot1.isBooked = true;
      slot1.isAvailable = false;
      await slot1.save();

      const appt1 = await Appointment.create({
        userId: patientUser._id,
        patientId: patientUser._id,
        doctorId: drJohn._id,
        slotId: slot1._id,
        patientName: patientUser.name,
        age: 32,
        gender: "male",
        problem: "Occasional chest tightness and shortness of breath",
        notes: "Routine cardiac checkup requested",
        amount: drJohn.consultationFee,
        status: "confirmed",
        paymentStatus: "paid",
        appointmentDate: slot1.startTime
      });

      await Payment.create({
        appointmentId: appt1._id,
        userId: patientUser._id,
        amount: drJohn.consultationFee,
        currency: "INR",
        paymentMethod: "card",
        status: "completed",
        transactionId: "TXN_" + Date.now()
      });
    }

    if (slot2) {
      slot2.isBooked = true;
      slot2.isAvailable = false;
      await slot2.save();

      await Appointment.create({
        userId: patientUser._id,
        patientId: patientUser._id,
        doctorId: drRahul._id,
        slotId: slot2._id,
        patientName: patientUser.name,
        age: 32,
        gender: "male",
        problem: "Mild knee pain after workout",
        notes: "X-ray attached",
        amount: drRahul.consultationFee,
        status: "pending",
        paymentStatus: "unpaid",
        appointmentDate: slot2.startTime
      });
    }
    console.log("✅ Sample Appointments & Payment seeded.");

    // 6. Sample Chat Messages
    console.log("💬 Seeding Sample Chat Messages...");
    await Chat.deleteMany({});
    const drJohnUser = userMap["dr.john@hospital.com"];

    await Chat.create([
      {
        senderId: patientUser._id,
        recipientId: drJohnUser._id,
        message: "Hello Dr. John, I have booked an appointment for tomorrow morning.",
        isRead: true,
        createdAt: new Date(Date.now() - 3600000)
      },
      {
        senderId: drJohnUser._id,
        recipientId: patientUser._id,
        message: "Hello John! Received your booking. Please bring any past ECG reports if available.",
        isRead: false,
        createdAt: new Date(Date.now() - 1800000)
      }
    ]);
    console.log("✅ Sample Chat Messages seeded.");

    console.log("\n==========================================");
    console.log("🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!");
    console.log("==========================================");
    console.log("🔑 TEST LOGIN CREDENTIALS (Password for all: password123):");
    console.log("👉 Admin:    admin@hospital.com     | password123 (Role: admin)");
    console.log("👉 Patient:  patient@example.com   | password123 (Role: patient)");
    console.log("👉 Patient:  anu@gmail.com          | password123 (Role: patient)");
    console.log("👉 Doctor:   dr.john@hospital.com   | password123 (Role: doctor)");
    console.log("👉 Doctor:   dr.rahul@hospital.com  | password123 (Role: doctor)");
    console.log("==========================================\n");

    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding Error:", err);
    process.exit(1);
  }
}

seed();
