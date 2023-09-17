const express = require ('express');
const nodemailer = require ('nodemailer');
const cors  = require ('cors');
const bodyParser = require ('body-parser');

const app = express();

app.use(cors())
app.use(bodyParser.json())

app.post('/api/forma', async (req, res) => {
  const { name, subject, email, message, phone } = req.body;

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
      user: 'edward.plasencio@gmail.com',
      pass: 'vdegwkgdzkohizkk',
    }
  });

  const mailOptions = {
    from: email,
    to: 'edd_wordd@icloud.com',
    subject: subject,
    html: `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; background-color: #f4f1fa; padding: 30px; border-radius: 5px;">
      <h1 style="background-color: #0f0c29; color: #fff; padding: 15px 20px; font-size: 28px; margin: 0 0 30px; border-radius: 5px;">Eddwordd Inquiry</h1>
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
    res.status(500).send('Failed to send email');
  }
});

app.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});


