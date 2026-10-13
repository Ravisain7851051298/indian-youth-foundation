const nodemailer = require('nodemailer');
const EmailLog = require('../models/EmailLog');
const Setting = require('../models/Setting');

// Helper to get active transporter dynamically
const getTransporter = async () => {
  let host = process.env.SMTP_HOST || 'smtp.gmail.com';
  let port = Number(process.env.SMTP_PORT) || 587;
  let user = process.env.SMTP_USER || 'samasyasamadhanparishad@gmail.com';
  let pass = process.env.SMTP_PASS || '';

  try {
    const dbSettings = await Setting.findOne({ key: 'global_ngo_settings' });
    if (dbSettings) {
      if (dbSettings.smtpHost) host = dbSettings.smtpHost;
      if (dbSettings.smtpPort) port = Number(dbSettings.smtpPort);
      if (dbSettings.smtpUser) user = dbSettings.smtpUser;
      if (dbSettings.smtpPass) pass = dbSettings.smtpPass;
    }
  } catch (err) {
    // Continue with env fallback
  }

  if (user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass }
    });
  }

  return null;
};

const sendEmail = async ({ to, subject, htmlText, template = 'general' }) => {
  let deliveryStatus = 'logged_simulated';
  const transporter = await getTransporter();

  if (transporter) {
    try {
      const fromName = process.env.NGO_NAME || 'Indian Youth Foundation';
      const fromEmail = process.env.SMTP_USER || 'samasyasamadhanparishad@gmail.com';
      await transporter.sendMail({
        from: `"${fromName}" <${fromEmail}>`,
        to,
        subject,
        html: htmlText
      });
      deliveryStatus = 'delivered_via_smtp';
      console.log(`📧 [EMAIL SENT VIA SMTP] To: ${to} | Subject: ${subject}`);
    } catch (err) {
      console.warn(`⚠️ [SMTP SEND ERROR, RECORDING AUDIT]: ${err.message}`);
      deliveryStatus = 'logged_locally';
    }
  } else {
    console.log(`📧 [EMAIL AUDIT LOGGED] To: ${to} | Subject: ${subject}`);
  }

  // Persist real audit log into MongoDB
  try {
    const logDoc = await EmailLog.create({
      to,
      subject,
      template,
      status: deliveryStatus,
      sentAt: new Date()
    });
    return logDoc;
  } catch (err) {
    return { to, subject, status: deliveryStatus, sentAt: new Date() };
  }
};

// 1. Donation Approved -> Form 10BD / 80G Tax Receipt Email
const sendDonationApprovalEmail = async ({ to, donorName, receiptNumber, amount, panNumber, campaignTitle }) => {
  const subject = `Official 80G Donation Receipt #${receiptNumber} - Indian Youth Foundation`;
  const htmlText = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
      <div style="background: linear-gradient(135deg, #ea580c, #f59e0b); padding: 16px; border-radius: 8px; text-align: center; color: white;">
        <h2 style="margin: 0; font-size: 20px;">INDIAN YOUTH FOUNDATION</h2>
        <p style="margin: 4px 0 0; font-size: 12px;">12A & 80G Certified Non-Profit Organisation (Reg: 421/2019)</p>
      </div>

      <div style="padding: 20px 0; color: #1e293b;">
        <h3 style="color: #059669; margin-top: 0;">✓ Donation Payment Verified & Approved</h3>
        <p>Dear <strong>${donorName}</strong>,</p>
        <p>We are grateful for your generous contribution of <strong>₹${Number(amount).toLocaleString('en-IN')}</strong> towards <strong>${campaignTitle || 'General Social Welfare Fund'}</strong>.</p>
        
        <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 14px; margin: 16px 0; font-size: 13px;">
          <p style="margin: 4px 0;"><strong>Receipt Number:</strong> <span style="font-family: monospace; color: #ea580c; font-weight: bold;">${receiptNumber}</span></p>
          <p style="margin: 4px 0;"><strong>Amount Received:</strong> ₹${Number(amount).toLocaleString('en-IN')}</p>
          <p style="margin: 4px 0;"><strong>Donor PAN No:</strong> ${panNumber || 'NA'}</p>
          <p style="margin: 4px 0;"><strong>Tax Exemption:</strong> 50% deduction under Section 80G of Income Tax Act</p>
          <p style="margin: 4px 0;"><strong>Status:</strong> <span style="color: #059669; font-weight: bold;">Verified & Approved by Trustees</span></p>
        </div>

        <p style="font-size: 12px; color: #64748b;">
          Your official digitally stamped 80G receipt is ready for download in your portal account.
        </p>

        <div style="text-align: center; margin: 24px 0;">
          <a href="http://localhost:3000/profile/donations" style="background: #ea580c; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 13px;">
            Download Official 80G Tax Receipt
          </a>
        </div>
      </div>

      <div style="border-top: 1px solid #e2e8f0; padding-top: 12px; font-size: 11px; color: #94a3b8; text-align: center;">
        Head Office - Krishna Vihar Pala Road Aligarh, Uttar Pradesh | Helpline: +91 93196 98759<br/>
        Email: samasyasamadhanparishad@gmail.com
      </div>
    </div>
  `;
  return await sendEmail({ to, subject, htmlText, template: 'donation_80g' });
};

// 2. Membership Approved -> Appointment Letter & Digital ID Card Email
const sendMembershipApprovalEmail = async ({ to, memberName, role = 'Member', memberId, designation, planName }) => {
  const subject = `Official Appointment Letter & ID Card Approved (${memberId}) - Indian Youth Foundation`;
  const htmlText = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
      <div style="background: linear-gradient(135deg, #ea580c, #f59e0b); padding: 16px; border-radius: 8px; text-align: center; color: white;">
        <h2 style="margin: 0; font-size: 20px;">INDIAN YOUTH FOUNDATION</h2>
        <p style="margin: 4px 0 0; font-size: 12px;">Nationwide Non-Profit Movement • NITI Aayog Registered</p>
      </div>

      <div style="padding: 20px 0; color: #1e293b;">
        <h3 style="color: #059669; margin-top: 0;">🎉 Congratulations! Membership Approved by Trustees</h3>
        <p>Dear <strong>${memberName}</strong>,</p>
        <p>We are delighted to confirm that following verification of your credentials and contribution receipt, the National Executive Committee of <strong>Indian Youth Foundation</strong> has officially approved your appointment.</p>
        
        <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 14px; margin: 16px 0; font-size: 13px;">
          <p style="margin: 4px 0;"><strong>Official Member ID:</strong> <span style="font-family: monospace; color: #ea580c; font-weight: bold;">${memberId}</span></p>
          <p style="margin: 4px 0;"><strong>Role Assigned:</strong> <span style="font-weight: bold;">${role}</span></p>
          <p style="margin: 4px 0;"><strong>Designation:</strong> ${designation || 'Active Social Worker'}</p>
          <p style="margin: 4px 0;"><strong>Membership Plan:</strong> ${planName || 'Standard Active Member'}</p>
          <p style="margin: 4px 0;"><strong>Status:</strong> <span style="color: #059669; font-weight: bold;">Active & Verified</span></p>
        </div>

        <p style="font-size: 12px; color: #64748b;">
          Your formal Letter of Appointment (with digital seal & signature) and official Dual-Sided ID Card with QR Verification have been unlocked in your profile portal.
        </p>

        <div style="text-align: center; margin: 24px 0;">
          <a href="http://localhost:3000/profile/appointment-letter" style="background: #0f172a; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 13px;">
            View Official Appointment Letter & ID Card
          </a>
        </div>
      </div>

      <div style="border-top: 1px solid #e2e8f0; padding-top: 12px; font-size: 11px; color: #94a3b8; text-align: center;">
        Head Office - Krishna Vihar Pala Road Aligarh, Uttar Pradesh | Helpline: +91 93196 98759<br/>
        Email: samasyasamadhanparishad@gmail.com
      </div>
    </div>
  `;
  return await sendEmail({ to, subject, htmlText, template: 'membership_approved' });
};

// 3. Volunteer Appointment & Welcome Email
const sendVolunteerApprovalEmail = async ({ to, volunteerName, volunteerId }) => {
  const subject = `Volunteer Appointment & Offer Letter Approved (${volunteerId}) - Indian Youth Foundation`;
  const htmlText = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
      <div style="background: linear-gradient(135deg, #059669, #10b981); padding: 16px; border-radius: 8px; text-align: center; color: white;">
        <h2 style="margin: 0; font-size: 20px;">INDIAN YOUTH FOUNDATION</h2>
        <p style="margin: 4px 0 0; font-size: 12px;">Registered National Non-Profit Trust • Serving Humanity</p>
      </div>

      <div style="padding: 20px 0; color: #1e293b;">
        <h3 style="color: #059669; margin-top: 0;">🎉 Welcome to the Mission! Volunteer Enrolment Approved</h3>
        <p>Dear <strong>${volunteerName}</strong>,</p>
        <p>We are delighted to welcome you to the volunteer wing of <strong>Indian Youth Foundation</strong>. Your application has been approved by the Executive Committee.</p>
        
        <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 14px; margin: 16px 0; font-size: 13px;">
          <p style="margin: 4px 0;"><strong>Official Volunteer ID:</strong> <span style="font-family: monospace; color: #059669; font-weight: bold;">${volunteerId}</span></p>
          <p style="margin: 4px 0;"><strong>Role:</strong> Active Grassroots Volunteer</p>
          <p style="margin: 4px 0;"><strong>Status:</strong> <span style="color: #059669; font-weight: bold;">Verified & Active</span></p>
        </div>

        <div style="text-align: center; margin: 24px 0;">
          <a href="http://localhost:3000/profile/appointment-letter" style="background: #059669; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 13px;">
            Access Volunteer Offer Letter & ID Card
          </a>
        </div>
      </div>

      <div style="border-top: 1px solid #e2e8f0; padding-top: 12px; font-size: 11px; color: #94a3b8; text-align: center;">
        Head Office - Krishna Vihar Pala Road Aligarh, Uttar Pradesh | Helpline: +91 93196 98759<br/>
        Email: samasyasamadhanparishad@gmail.com
      </div>
    </div>
  `;
  return await sendEmail({ to, subject, htmlText, template: 'volunteer_approved' });
};

// 4. Certificate Awarded Email
const sendCertificateEmail = async ({ to, recipientName, awardTitle, certificateNo }) => {
  const subject = `Certificate of Appreciation Awarded (${certificateNo}) - Indian Youth Foundation`;
  const htmlText = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
      <div style="background: linear-gradient(135deg, #d97706, #f59e0b); padding: 16px; border-radius: 8px; text-align: center; color: white;">
        <h2 style="margin: 0; font-size: 20px;">INDIAN YOUTH FOUNDATION</h2>
        <p style="margin: 4px 0 0; font-size: 12px;">Recognition of Meritorious Social Welfare Service</p>
      </div>

      <div style="padding: 20px 0; color: #1e293b;">
        <h3 style="color: #d97706; margin-top: 0;">🎖️ Certificate of Appreciation Awarded</h3>
        <p>Dear <strong>${recipientName}</strong>,</p>
        <p>The National Executive Council has conferred upon you the official citation: <strong>"${awardTitle}"</strong>.</p>
        
        <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 14px; margin: 16px 0; font-size: 13px;">
          <p style="margin: 4px 0;"><strong>Certificate Number:</strong> <span style="font-family: monospace; color: #ea580c; font-weight: bold;">${certificateNo}</span></p>
          <p style="margin: 4px 0;"><strong>Award Citation:</strong> ${awardTitle}</p>
        </div>

        <div style="text-align: center; margin: 24px 0;">
          <a href="http://localhost:3000/certificates?view=${certificateNo}" style="background: #d97706; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 13px;">
            View Verified Certificate
          </a>
        </div>
      </div>
    </div>
  `;
  return await sendEmail({ to, subject, htmlText, template: 'certificate_awarded' });
};

// 5. Password Reset Email
const sendPasswordResetEmail = async ({ to, resetToken, userName }) => {
  const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;
  const subject = `Password Reset Request - Indian Youth Foundation Portal`;
  const htmlText = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
      <div style="background: linear-gradient(135deg, #ea580c, #f59e0b); padding: 16px; border-radius: 8px; text-align: center; color: white;">
        <h2 style="margin: 0; font-size: 20px;">INDIAN YOUTH FOUNDATION</h2>
        <p style="margin: 4px 0 0; font-size: 12px;">Official Member & Administrative Portal Security</p>
      </div>

      <div style="padding: 20px 0; color: #1e293b;">
        <h3 style="color: #ea580c; margin-top: 0;">🔐 Password Reset Instructions</h3>
        <p>Dear <strong>${userName || 'Member'}</strong>,</p>
        <p>We received a request to reset your password for your Indian Youth Foundation portal account.</p>
        
        <p style="margin: 20px 0;">
          Click the secure button below to set a new password. This link is valid for 1 hour:
        </p>

        <div style="text-align: center; margin: 24px 0;">
          <a href="${resetUrl}" style="background: #ea580c; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 13px;">
            Reset My Password
          </a>
        </div>

        <p style="font-size: 11px; color: #64748b; line-height: 1.5;">
          If you did not request this password reset, please ignore this email. Your password will remain unchanged.
        </p>
      </div>

      <div style="border-top: 1px solid #e2e8f0; padding-top: 12px; font-size: 11px; color: #94a3b8; text-align: center;">
        Head Office - Krishna Vihar Pala Road Aligarh, Uttar Pradesh | Helpline: +91 93196 98759<br/>
        Email: samasyasamadhanparishad@gmail.com
      </div>
    </div>
  `;
  return await sendEmail({ to, subject, htmlText, template: 'forgot_password' });
};

module.exports = {
  sendEmail,
  sendDonationApprovalEmail,
  sendMembershipApprovalEmail,
  sendVolunteerApprovalEmail,
  sendCertificateEmail,
  sendPasswordResetEmail
};
