const nodemailer = require("nodemailer");

// Create a transporter using Gmail (or your preferred service)
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: 'jophinemca007@gmail.com', // Your Gmail address
    pass: 'eiehwgcpfitrjlas'       // Your Gmail app password
  }
});

// Function to send email
function sendMail(to, subject, htmlMessage) {
  const mailOptions = {
    from: 'jophinemca007@gmail.com',
    to: to,
    subject: subject,
    html: htmlMessage
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending mail:", error);
    } else {
      console.log("Mail sent:", info.response);
    }
  });
}

// Test sending an email
sendMail("jophinemca07@gmail.com", "Test Mail for the process", "<h1>Test message</h1>");
