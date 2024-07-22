import nodemailer from 'nodemailer'
import path from 'path'
import ejs from 'ejs'

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

export const sendVerificationEmail = async (to, code) => {
  try {
    const templatePath = path.resolve('src', 'helpers', 'mail_template.ejs')
    const html = await ejs.renderFile(templatePath, { code })

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject: 'Verify Your Email Address',
      html
    }

    await transporter.sendMail(mailOptions)
  } catch (error) {
    console.error('Error sending email:', error)
  }
}

export const sendPasswordResetEmail = async (to, resetToken) => {
  try {
    const templatePath = path.resolve('src', 'helpers', 'reset_password_template.ejs');
    const resetUrl = `${process.env.RESET_PASSWORD_FRONTEND_URL}/reset-password?token=${resetToken}`;
    const html = await ejs.renderFile(templatePath, { resetUrl });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject: 'Password Reset Request',
      html
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

// Send question reply notification mail
export const sendQuestionReplyNotificationEmail = async (to, name, title) => {
  try {
    const templatePath = path.resolve('src', 'helpers', 'question_reply_template.ejs');
    const html = await ejs.renderFile(templatePath, { name, title });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject: 'New Question Reply',
      html
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};