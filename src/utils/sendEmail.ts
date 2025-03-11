import nodemailer, { Transporter } from 'nodemailer';

export interface EmailOptions {
  email: string;
  subject: string;
  message: string;
}

const sendEmail = async (options: EmailOptions): Promise<void> => {
  const transporter: Transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST as string,
    port: parseInt(process.env.SMTP_PORT as string, 10), // Convert to number
    secure: true,
    auth: {
      user: process.env.SMTP_EMAIL as string,
      pass: process.env.SMTP_PASSWORD as string,
    },
  });

  const message = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  const info = await transporter.sendMail(message);
  console.log('Email sent:', info.messageId);
};

export default sendEmail;
