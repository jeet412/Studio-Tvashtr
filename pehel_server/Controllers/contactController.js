const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');

const sendContact = async (req, res) => {
  const { firstName, lastName, email, phone, message } = req.body;

  // Validate all required fields
  if (!firstName || !lastName || !email || !phone || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Save to MongoDB
    const newContact = new Contact({
      firstName,
      lastName,
      email,
      phone,
      message,
    });
    await newContact.save();

    // Send Email via Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_PASS,
      },
    });

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: process.env.RECEIVER_EMAILS, // comma-separated list in .env
      subject: 'New Contact Form Submission',
      text: `
New Contact Form Submission:

Name: ${firstName} ${lastName}
Email: ${email}
Phone: +91-${phone}
Message:
${message}
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: 'Message sent successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send message' });
  }
};

module.exports = { sendContact };
