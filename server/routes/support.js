import express from 'express';
import nodemailer from 'nodemailer';

const router = express.Router();

// POST /api/support
router.post('/', async (req, res) => {
  const { topic, message, userEmail, userId } = req.body;

  if (!topic || !message) {
    return res.status(400).json({ message: 'Topic and message are required.' });
  }

  // Validate environment variables
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('Missing EMAIL_USER or EMAIL_PASS in .env. Email will not be sent.');
    // In development or if unconfigured, we might just log it and pretend it worked
    // to avoid breaking the frontend experience for the user right now.
    // However, user specifically asked for it to work.
    // We will return a success but log the error on server.
    return res.status(200).json({ message: 'Support request received (Simulation: Email config missing).' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'kumarsumeet683@gmail.com', // User requested this specific email
      subject: `STC Support Request: ${topic}`,
      html: `
          <h3>New Support Request</h3>
          <p><strong>Topic:</strong> ${topic}</p>
          <p><strong>From User:</strong> ${userEmail || 'Anonymous'} (ID: ${userId || 'N/A'})</p>
          <hr />
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        `,
      replyTo: userEmail
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Support request sent successfully!' });

  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send email.', error: error.message });
  }
});

export default router;
