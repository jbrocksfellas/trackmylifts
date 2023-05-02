const nodemailer = require("nodemailer");
const { EMAIL_SENDER_ID, EMAIL_SENDER_PASSWORD } = require("../startups/config");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: EMAIL_SENDER_ID,
    pass: EMAIL_SENDER_PASSWORD,
  },
});

function sendEmail({ to, from = "", text, subject, html = "" }) {
  const newFrom = from ? from : "TrackMyLifts";

  const message = {
    from: `${newFrom} <${to}>`,
    to,
    subject,
    text,
  };

  if (html) message.html = html;

  transporter.sendMail(message, (err, info) => {
    if (err) {
      console.error("Failed to send email:", err);
    } else {
      console.log("Email sent:", info);
    }
  });
}

// sendEmail({ to: "jbrocksfellas@gmail.com", text: "hello mate", subject: "Email Verification" });

module.exports = { sendEmail };
