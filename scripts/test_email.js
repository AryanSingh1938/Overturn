/**
 * Email Automation Diagnostic Script
 * Usage: node scripts/test_email.js [optional_target_email]
 */

const path = require('path');

// Resolve modules from server/node_modules
const dotenv = (() => {
  try { return require('dotenv'); } catch { return require('../server/node_modules/dotenv'); }
})();
const nodemailer = (() => {
  try { return require('nodemailer'); } catch { return require('../server/node_modules/nodemailer'); }
})();

dotenv.config({ path: path.resolve(__dirname, '../server/.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

async function testEmailAutomation() {
  console.log('\n======================================================');
  console.log('📧 OVERTURN EMAIL AUTOMATION DIAGNOSTIC');
  console.log('======================================================\n');

  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const targetEmail = process.argv[2] || process.env.DEMO_DISPATCH_EMAIL || user;

  if (!user || !pass) {
    console.warn('⚠️  SMTP credentials not configured in server/.env:');
    console.warn('   SMTP_USER is empty or missing');
    console.warn('   SMTP_PASS is empty or missing\n');
    console.log('📋 HOW TO CONFIGURE REAL EMAIL DISPATCH:');
    console.log('   1. Go to your Google Account -> Security -> 2-Step Verification -> App Passwords.');
    console.log('   2. Create an App Password for "Overturn" (you will get a 16-character code).');
    console.log('   3. Put your Gmail and 16-character code in server/.env:');
    console.log('      SMTP_HOST=smtp.gmail.com');
    console.log('      SMTP_USER=your_email@gmail.com');
    console.log('      SMTP_PASS=xxxx xxxx xxxx xxxx');
    console.log('      DEMO_DISPATCH_EMAIL=your_email@gmail.com\n');
    process.exit(1);
  }

  console.log(`Connecting to SMTP host: ${host}...`);
  console.log(`Sender: ${user}`);
  console.log(`Target: ${targetEmail}\n`);

  let transporter;
  if (host.toLowerCase().includes('gmail')) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass },
    });
  } else {
    transporter = nodemailer.createTransport({
      host,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: parseInt(process.env.SMTP_PORT || '587', 10) === 465,
      auth: { user, pass },
    });
  }

  try {
    console.log('1. Verifying SMTP authentication credentials...');
    await transporter.verify();
    console.log('   ✅ SMTP Authentication Successful!\n');

    console.log(`2. Dispatching test statutory notice to ${targetEmail}...`);
    const trackingToken = `OT-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    const info = await transporter.sendMail({
      from: `"Overturn Civic Engine" <${user}>`,
      to: targetEmail,
      subject: `[LEGAL NOTICE TEST] Rule 14(3) Statutory Representation (Tracking: ${trackingToken})`,
      text: `This is a verified automated test from Project Overturn Civic Engine.\nTracking Token: ${trackingToken}\nTimestamp: ${new Date().toISOString()}`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
          <div style="background: #0f172a; color: #ffffff; padding: 20px;">
            <h2 style="margin: 0; font-size: 20px;">⚖️ Overturn — Email Automation Active</h2>
            <p style="margin: 4px 0 0 0; color: #94a3b8; font-size: 13px;">Statutory Grievance Redressal Dispatch Engine</p>
          </div>
          <div style="padding: 24px;">
            <p><strong>Status:</strong> <span style="color: #059669; font-weight: bold;">CONNECTED & VERIFIED</span></p>
            <p><strong>Tracking Token:</strong> <code>${trackingToken}</code></p>
            <p><strong>Sender:</strong> ${user}</p>
            <p><strong>Target Recipient:</strong> ${targetEmail}</p>
            <p style="margin-top: 16px; padding: 12px; background: #f8fafc; border-left: 4px solid #F26B3A; font-size: 13px;">
              Automated SMTP dispatch is fully operational. When users click "Confirm & Dispatch Notice" in the UI, formal Rule 14(3) notices will land directly in this inbox.
            </p>
          </div>
        </div>
      `,
    });

    console.log(`   ✅ Test Email Sent Successfully! Message ID: ${info.messageId}`);
    console.log(`\n📬 Check your inbox at: ${targetEmail}`);
    console.log('======================================================\n');
  } catch (err) {
    console.error(`\n❌ SMTP Error: ${err.message}`);
    if (err.message.includes('Invalid login') || err.message.includes('Username and Password not accepted')) {
      console.log('\n💡 Tip for Gmail users:');
      console.log('   Do not use your regular Gmail password.');
      console.log('   You must generate a 16-character "App Password" at: https://myaccount.google.com/apppasswords');
    }
    console.log('======================================================\n');
    process.exit(1);
  }
}

testEmailAutomation();
