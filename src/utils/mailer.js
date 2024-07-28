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
    const templatePath = path.resolve('src', 'helpers', 'templates', 'mail_template.ejs')
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
    const templatePath = path.resolve('src', 'helpers', 'templates', 'reset_password_template.ejs');
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
    const templatePath = path.resolve('src', 'helpers', 'templates', 'question_reply_template.ejs');
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

// Send order details to the user email

export const sendOrderDetailsEmail = async (to, order) => {
  try {
    const templatePath = path.resolve('src', 'helpers', 'templates', 'order_details_template.ejs');

    const html = await ejs.renderFile(templatePath, {...order});

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject: 'Order Confirmation Details',
      html
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};