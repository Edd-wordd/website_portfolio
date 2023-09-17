require('dotenv').config();
const express = require ('express');
const nodemailer = require ('nodemailer');
const cors  = require ('cors');
const bodyParser = require ('body-parser');
let fetch;
import('node-fetch').then(module => {
  fetch = module.default;
});


const app = express();

app.use(cors())
app.use(bodyParser.json())

app.post('/api/forma', async (req, res) => {
  const { name, subject, email, message, phone } = req.body;

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
      user: process.env.COMPANY_EMAIL,
      pass: process.env.COMPANY_EMAIL_PASSWORD,
    }
  });

  const mailOptions = {
    from: email,
    to: process.env.COMPANY_EMAIL,
    subject: subject,
    html: `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; background-color: #f4f1fa; padding: 30px; border-radius: 5px;">
      <h1 style="background-color: #008000; color: #fff; padding: 15px 20px; font-size: 28px; margin: 0 0 30px; border-radius: 5px;">Eddwordd Inquiry</h1>
      <h3 style="font-size: 22px; margin: 0 0 15px; color: #333;">Client Details</h3>
      <ul style="list-style-type: none; padding: 0;">
        <li style="margin-bottom: 10px;"><strong>Name:</strong> ${name}</li>
        <li style="margin-bottom: 10px;"><strong>Email:</strong> ${email}</li>
        <li style="margin-bottom: 10px;"><strong>Phone:</strong> ${phone}</li>
      </ul>
      <h3 style="font-size: 22px; margin: 30px 0 15px; color: #333;">Message</h3>
      <p style="margin: 0;">${message}</p>
    </div>
  `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send email' });
  }
});

app.get('/validateEmail', async (req, res) => {
  const email = req.query.email;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Validate email format using regex
  if (!email.trim().match(emailRegex)) {
    console.error('Invalid email format.');
    return res.status(400).json({ error: 'Invalid email format.' });
  }

  const apiKey = process.env.EMAIL_APIKEY;
  // const apiURL = process.env.EMAIL_VALIDATION_URL

  try {
    const apiResponse = await fetch(`https://emailvalidation.abstractapi.com/v1/?api_key=${apiKey}&email=${email}`);

    if (!apiResponse.ok) {
      // Handle specific error messages based on status codes
      if (apiResponse.status === 405) {
        console.error('Method Not Allowed: The requested HTTP method is not supported.');
        return res.status(405).json({ error: 'Method Not Allowed' });
      } else if (apiResponse.status === 404) {
        console.error('Not Found: The requested resource could not be found.');
        return res.status(404).json({ error: 'Not Found' });
      } else {
        console.error('An error occurred:', apiResponse.statusText);
        return res.status(500).json({ error: 'An error occurred' });
      }
    }

    const data = await apiResponse.json();
    console.log(data);
    console.log(data.is_smtp_valid.value);
    res.json({ is_smtp_valid: data.is_smtp_valid.value });

  } catch (error) {
    console.error('An unexpected error occurred during the API request:', error.message);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
});

app.get('/validatePhone', async (req, res) => {
  const phone = req.query.phone;
  const phoneRegex = /^([0-9]{3} ?){2}[0-9]{4}$/;
  let reformattedPhone = '+1' + phone;

  if (!phone.trim().match(phoneRegex)) {
    console.error('Invalid phone format.');
    return res.status(400).json({ error: 'Invalid phone format.' });
  }

  const apiKey = process.env.PHONE_APIKEY;

  try {
    const fetchResponse = await fetch(`https://phonevalidation.abstractapi.com/v1/?api_key=${apiKey}&phone=${reformattedPhone}`);
    if (!fetchResponse.ok) {
      console.error('An error occurred:', fetchResponse.statusText);
      return res.status(500).json({ error: fetchResponse.statusText });
    }

    const data = await fetchResponse.json();
    console.log(data);

    if (data.valid !== undefined) {
      console.log(data.valid);
      return res.json({ valid: data.valid });
    } else {
      console.error('Unexpected response structure.');
      return res.status(500).json({ error: 'Unexpected response structure.' });
    }
  } catch (error) {
    console.error('An unexpected error occurred during the API request:', error.message);
    return res.status(500).json({ error: 'An unexpected error occurred.' });
  }
});

app.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});


