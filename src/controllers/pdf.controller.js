const PDFDocument = require("pdfkit");
const Appointment = require("../models/Appointment");

exports.getAppointmentPDF = async (req, res) => {
  try {
    const appt = await Appointment.findById(req.params.id)
      .populate("doctorId", "name consultationFee about")
      .populate("slotId", "date time")
      .populate("userId", "name email");

    if (!appt) {
      return res.status(404).json({ status: false, message: "Appointment not found" });
    }

    const disposition = req.query.disposition === "attachment"
      ? "attachment"
      : "inline";

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `${disposition}; filename=appointment_${appt._id}.pdf`
    );

    const doc = new PDFDocument();
    doc.pipe(res);

    doc.fontSize(20).text("Doctor Appointment Receipt", { align: "center" });
    doc.moveDown();

    doc.fontSize(12).text(`Appointment ID: ${appt._id}`);
    doc.text(`Patient: ${appt.patientName}`);
    doc.text(`Doctor: ${appt.doctorId.name}`);
    doc.text(`Date: ${appt.slotId.date}`);
    doc.text(`Time: ${appt.slotId.time}`);
    doc.text(`Fee: ₹${appt.amount}`);
    doc.text(`Status: ${appt.status}`);

    doc.end();

  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};
