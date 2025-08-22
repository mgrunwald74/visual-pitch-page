const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { Resend } = require('resend');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Middleware
app.use(helmet());
app.use(express.json());

// CORS configuration - adjust origin for production
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    error: 'Zu viele Anfragen. Bitte versuchen Sie es später erneut.'
  }
});

app.use('/api/send-email', limiter);

// Input validation function
const validateContactForm = (data) => {
  const errors = [];
  
  if (!data.name || data.name.trim().length < 2) {
    errors.push('Name ist erforderlich und muss mindestens 2 Zeichen lang sein.');
  }
  
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Gültige E-Mail-Adresse ist erforderlich.');
  }
  
  if (!data.variante || !['Variante A', 'Variante B'].includes(data.variante)) {
    errors.push('Bitte wählen Sie eine gültige Variante aus.');
  }
  
  if (data.telefon && data.telefon.length > 0 && !/^[\d\s\+\-\(\)]+$/.test(data.telefon)) {
    errors.push('Telefonnummer enthält ungültige Zeichen.');
  }
  
  return errors;
};

// Email sending route
app.post('/api/send-email', async (req, res) => {
  try {
    const { name, email, telefon, variante, nachricht } = req.body;
    
    // Validate input
    const validationErrors = validateContactForm(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        errors: validationErrors
      });
    }

    // Prepare email content
    const emailSubject = `Neue Kontaktanfrage - ${variante}`;
    const emailContent = `
Neue Kontaktanfrage über die Website:

Name: ${name}
E-Mail: ${email}
Telefon: ${telefon || 'Nicht angegeben'}
Gewählte Variante: ${variante}

Nachricht:
${nachricht || 'Keine Nachricht hinterlassen'}

---
Diese E-Mail wurde über das Kontaktformular der Website gesendet.
    `.trim();

    // Send email via Resend
    const data = await resend.emails.send({
      from: process.env.SENDER_EMAIL || 'kontakt@muenchnerenergieagentur.de',
      to: process.env.RECIPIENT_EMAIL || 'sgw@muenchnerenergieagentur.de',
      subject: emailSubject,
      text: emailContent,
      reply_to: email
    });

    console.log('Email sent successfully:', data.id);

    res.json({
      success: true,
      message: 'Ihre Nachricht wurde erfolgreich versendet. Wir melden uns bald bei Ihnen!'
    });

  } catch (error) {
    console.error('Error sending email:', error);
    
    res.status(500).json({
      success: false,
      message: 'Es gab einen Fehler beim Versenden Ihrer Nachricht. Bitte versuchen Sie es später erneut.'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});