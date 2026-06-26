let client = null;

if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  const twilio = require('twilio');
  client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

const send = async (to, body) => {
  if (!client || !process.env.TWILIO_PHONE_NUMBER) {
    console.log(`[SMS SKIPPED - no config] To: ${to} | ${body}`);
    return;
  }
  // Normalize US number to E.164
  const normalized = to.replace(/\D/g, '');
  const e164 = normalized.startsWith('1') ? `+${normalized}` : `+1${normalized}`;
  try {
    await client.messages.create({
      body,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: e164,
    });
  } catch (err) {
    console.error(`SMS error to ${e164}:`, err.message);
  }
};

module.exports = {
  newJobAlert: (phone, job) =>
    send(
      phone,
      `BidRinse: New ${job.job_type === 'commercial' ? '🏢 Commercial' : '🏠 Residential'} ${job.service_type} job in ${job.city || job.zip_code}, NC. Tap to view & quote: ${process.env.FRONTEND_URL}/business/jobs`
    ),
};
