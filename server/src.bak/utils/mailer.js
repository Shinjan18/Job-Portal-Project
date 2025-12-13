const nodemailer = require('nodemailer');

let cachedTransport = null;
let cachedInfo = null;

async function getTransport() {
  if (cachedTransport) return cachedTransport;

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM } = process.env;
  const hasSmtp =
    SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS && EMAIL_FROM;

  if (hasSmtp) {
    cachedInfo = { type: 'smtp' };
    cachedTransport = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: Number(SMTP_PORT) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
    console.log('[mail] using SMTP transport');
    return cachedTransport;
  }

  // Ethereal fallback
  const testAccount = await nodemailer.createTestAccount();
  cachedInfo = {
    type: 'ethereal',
    user: testAccount.user,
  };
  cachedTransport = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
  console.log('[mail] using Ethereal transport');
  return cachedTransport;
}

async function sendMail(options) {
  const transporter = await getTransport();
  const info = await transporter.sendMail(options);

  let previewUrl = null;
  if (cachedInfo?.type === 'ethereal') {
    previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log('[mail] Ethereal preview URL:', previewUrl);
    }
  }
  if (transporter.options.streamTransport) {
    console.log('[mail] message preview:\n', info.message.toString());
  }
  return { info, previewUrl, transportType: cachedInfo?.type || 'unknown' };
}

module.exports = { sendMail };


