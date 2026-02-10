import express from 'express';
import nodemailer from 'nodemailer';

const router = express.Router();

// POST /api/contact
router.post('/', async (req, res) => {
  const { firstName, lastName, email, subject, message } = req.body;

  if (!firstName || !email || !message) {
    return res.status(400).json({ message: 'Please fill in all required fields.' });
  }

  try {
    // Create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // User's email from .env
        pass: process.env.EMAIL_PASS, // User's app password from .env
      },
    });

    // Setup email data
    const mailOptions = {
      from: `"${firstName} ${lastName}" <${email}>`, // Sender address
      to: process.env.EMAIL_USER, // List of receivers (sending to self)
      replyTo: email,
      subject: `Contact Form: ${subject || 'New Message'}`, // Subject line
      text: `
        Name: ${firstName} ${lastName}
        Email: ${email}
        Subject: ${subject}
        
        Message:
        ${message}
      `, // Plain text body
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `, // HTML body
    };

    // Send mail with defined transport object
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send message. Please try again later.' });
  }
});

export default router;
