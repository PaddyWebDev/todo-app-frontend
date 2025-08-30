import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail", // or "smtp", "hotmail", etc.
  auth: {
    user: process.env.EMAIL_USER, // your email
    pass: process.env.EMAIL_PASS, // app password (not regular password if Gmail)
  },
});
