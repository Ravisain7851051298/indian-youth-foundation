const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const EmailLog = require('../models/EmailLog');
const Setting = require('../models/Setting');
const pdfService = require('./pdfService');

// Helper to get active transporter dynamically from database Settings
const getTransporterConfig = async () => {
  let host = 'smtp.gmail.com';
  let port = 587;
  let user = '';
  let pass = '';
  let fromName = 'Yuva Kranti Dal';

  try {
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      // Find singleton setting document
      const dbSettings = await Setting.findOne();
      if (dbSettings) {
        if (dbSettings.smtpHost) host = dbSettings.smtpHost.trim();
        if (dbSettings.smtpPort) port = Number(dbSettings.smtpPort) || 587;
        if (dbSettings.smtpUser) user = dbSettings.smtpUser.trim();
        if (dbSettings.smtpPass) pass = dbSettings.smtpPass.replace(/\s+/g, '').trim();
        if (dbSettings.smtpFromName) fromName = dbSettings.smtpFromName.trim();
        else if (dbSettings.ngoName) fromName = dbSettings.ngoName.trim();
      }
    }
  } catch (err) {
    console.warn('⚠️ [EMAIL CONFIG WARNING] Could not fetch settings from DB:', err.message);
  }

  // Backup fallback to process.env only if DB credentials are blank
  if (!user && process.env.SMTP_USER) user = process.env.SMTP_USER.trim();
  if (!pass && process.env.SMTP_PASS) pass = process.env.SMTP_PASS.trim();
  if (!host && process.env.SMTP_HOST) host = process.env.SMTP_HOST.trim();
  if (process.env.SMTP_PORT && !port) port = Number(process.env.SMTP_PORT) || 587;

  if (user && pass && !pass.includes('•')) {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
      connectionTimeout: 8000,
      greetingTimeout: 8000,
      socketTimeout: 10000,
      tls: {
        rejectUnauthorized: false
      }
    });
    return { transporter, user, fromName, host, port };
  }

  return { transporter: null, user, fromName, host, port };
};

// Diagnostic SMTP tester
const testSmtpConnection = async ({ host, port, user, pass, fromName, to }) => {
  if (!user || !user.trim()) {
    throw new Error('SMTP Username (Email) is required to test.');
  }
  const cleanPass = (pass || '').replace(/\s+/g, '');
  if (!cleanPass) {
    throw new Error('SMTP App Password is required to test.');
  }
  if (cleanPass.includes('•') || cleanPass.includes('*')) {
    throw new Error('Please enter your actual 16-character Google App Password (masked bullet characters •••••••• cannot be authenticated).');
  }
  if (!to || !to.trim()) {
    throw new Error('A recipient test email address is required.');
  }

  const parsedPort = Number(port) || 587;
  const parsedHost = (host || 'smtp.gmail.com').trim();
  const parsedUser = user.trim();
  const senderTitle = (fromName || 'Yuva Kranti Dal').trim();

  const transporter = nodemailer.createTransport({
    host: parsedHost,
    port: parsedPort,
    secure: parsedPort === 465,
    auth: { user: parsedUser, pass: cleanPass },
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 10000,
    tls: {
      rejectUnauthorized: false
    }
  });

  // Verify connection configuration
  await transporter.verify();

  // Send test email
  const info = await transporter.sendMail({
    from: `"${senderTitle}" <${parsedUser}>`,
    to: to.trim(),
    subject: `✅ SMTP Diagnostic Test Passed - Yuva Kranti Dal`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h2 style="color: #dc2626; margin-bottom: 4px;">YUVA KRANTI DAL</h2>
          <p style="color: #64748b; font-size: 13px; margin: 0;">Automated SMTP Server Diagnostics &amp; Validation</p>
        </div>
        <div style="background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
          <h3 style="color: #065f46; margin: 0 0 6px 0; font-size: 16px;">✓ Connection Successful!</h3>
          <p style="color: #047857; margin: 0; font-size: 14px;">Your SMTP credentials saved in the Admin Settings panel are working correctly and ready to dispatch official certificates, ID cards, and receipts.</p>
        </div>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px; color: #334155; margin-bottom: 20px;">
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 8px 0; font-weight: bold; width: 140px;">SMTP Host:</td>
            <td style="padding: 8px 0;">${parsedHost}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 8px 0; font-weight: bold;">SMTP Port:</td>
            <td style="padding: 8px 0;">${parsedPort} (${parsedPort === 465 ? 'SSL' : 'TLS/STARTTLS'})</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 8px 0; font-weight: bold;">Sender Account:</td>
            <td style="padding: 8px 0; font-family: monospace;">${parsedUser}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 8px 0; font-weight: bold;">Sender Title:</td>
            <td style="padding: 8px 0;">${senderTitle}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 8px 0; font-weight: bold;">Recipient Tested:</td>
            <td style="padding: 8px 0; font-family: monospace;">${to}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">Server Response:</td>
            <td style="padding: 8px 0; color: #059669; font-weight: bold;">250 OK (Accepted)</td>
          </tr>
        </table>
        <p style="font-size: 11px; color: #94a3b8; text-align: center; margin: 0;">Sent automatically from the Yuva Kranti Dal Admin CMS.</p>
      </div>
    `
  });

  return {
    success: true,
    messageId: info.messageId,
    accepted: info.accepted
  };
};

const sendEmail = async ({ to, subject, htmlText, template = 'general', attachments = [] }) => {
  let deliveryStatus = 'logged_simulated';
  const { transporter, user: smtpUser, fromName: dbFromName } = await getTransporterConfig();

  if (!to) {
    console.warn(`⚠️ [EMAIL NOTICE] No recipient email specified for subject: "${subject}".`);
    return { success: false, message: 'No recipient email specified' };
  }

  if (transporter) {
    try {
      const fromName = dbFromName || 'Yuva Kranti Dal';
      const fromEmail = smtpUser || 'samasyasamadhanparishad@gmail.com';
      const mailOptions = {
        from: `"${fromName}" <${fromEmail}>`,
        to,
        subject,
        html: htmlText
      };

      if (attachments && Array.isArray(attachments) && attachments.length > 0) {
        mailOptions.attachments = attachments;
      }

      await transporter.sendMail(mailOptions);
      deliveryStatus = 'delivered_via_smtp';
      console.log(`📧 [EMAIL SENT VIA SMTP] To: ${to} | Subject: ${subject} | Attachments: ${attachments.length}`);
    } catch (err) {
      console.warn(`⚠️ [SMTP SEND ERROR, RECORDING AUDIT]: ${err.message}`);
      deliveryStatus = 'logged_locally';
    }
  } else {
    console.log(`📧 [EMAIL AUDIT LOGGED] To: ${to} | Subject: ${subject} | Attachments: ${attachments.length} (SMTP credentials not configured)`);
  }

  // Persist real audit log into MongoDB if connected
  try {
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      const logDoc = await EmailLog.create({
        to,
        subject,
        template,
        status: deliveryStatus,
        metadata: {
          attachments: attachments.map(a => a.filename || 'attachment.pdf')
        },
        sentAt: new Date()
      });
      return { success: true, status: deliveryStatus, logDoc };
    }
  } catch (err) {
    // Continue with in-memory status
  }
  return { success: true, to, subject, status: deliveryStatus, sentAt: new Date() };
};

// 1. Donation Approved -> Form 10BD / 80G Tax Receipt Email with PDF Attachment
const sendDonationApprovalEmail = async (data) => {
  const donationObj = data.toObject ? data.toObject() : data;
  const to = donationObj.to || donationObj.donorEmail || donationObj.email;
  const donorName = donationObj.donorName || 'Generous Contributor';
  const receiptNumber = donationObj.receiptNumber || 'BYK-80G-PENDING';
  const amount = Number(donationObj.amount) || 0;
  const panNumber = donationObj.panNumber || donationObj.pan || 'N/A';
  const campaignTitle = donationObj.campaignTitle || 'General Welfare Fund';
  const temporaryPassword = donationObj.temporaryPassword || data.temporaryPassword || '';
  const clientBase = (process.env.CLIENT_URL || 'http://localhost:3000').replace(/\/+$/, '');

  if (!to) {
    console.warn('⚠️ [EMAIL NOTICE] No recipient email found for donation approval notification.');
    return null;
  }

  // Generate Official 80G Receipt PDF
  let attachments = [];
  try {
    const pdfBuffer = await pdfService.generateDonationReceiptPdf(donationObj);
    attachments.push({
      filename: `Donation_Receipt_${receiptNumber}.pdf`,
      content: pdfBuffer,
      contentType: 'application/pdf'
    });
  } catch (err) {
    console.error('Error generating donation receipt PDF:', err);
  }

  const subject = `Official 80G Tax Receipt #${receiptNumber} Attached - Yuva Kranti Dal`;
  const htmlText = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 14px; background-color: #ffffff;">
      <div style="background: linear-gradient(135deg, #c2410c, #ea580c); padding: 18px; border-radius: 10px; text-align: center; color: white;">
        <h2 style="margin: 0; font-size: 22px; letter-spacing: 0.5px;">YUVA KRANTI DAL</h2>
        <p style="margin: 4px 0 0; font-size: 12px; opacity: 0.95;">12A & 80G Certified Non-Profit Trust • Reg. No: 421/2019</p>
      </div>

      <div style="padding: 20px 0; color: #1e293b;">
        <div style="display: inline-block; background-color: #ecfdf5; border: 1px solid #a7f3d0; color: #047857; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; margin-bottom: 12px;">
          ✓ Donation Payment Verified & Tax Receipt Issued
        </div>

        <p style="font-size: 15px; margin: 8px 0;">Dear <strong>${donorName}</strong>,</p>
        <p style="font-size: 14px; line-height: 1.6; color: #334155;">
          Thank you for your generous contribution of <strong>₹${amount.toLocaleString('en-IN')}</strong> towards <strong>${campaignTitle}</strong>. Your support enables us to bring positive change and social empowerment across India.
        </p>
        
        <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 10px; padding: 16px; margin: 18px 0; font-size: 13px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 4px 0; color: #64748b; width: 45%;"><strong>Receipt Number:</strong></td>
              <td style="padding: 4px 0; font-family: monospace; color: #ea580c; font-weight: bold;">${receiptNumber}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #64748b;"><strong>Amount Received:</strong></td>
              <td style="padding: 4px 0; font-weight: bold; color: #059669;">₹${amount.toLocaleString('en-IN')}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #64748b;"><strong>Donor PAN:</strong></td>
              <td style="padding: 4px 0; font-family: monospace;">${panNumber}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #64748b;"><strong>Tax Exemption:</strong></td>
              <td style="padding: 4px 0; color: #0f172a;">50% deduction under Section 80G of IT Act, 1961</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #64748b;"><strong>Audit Status:</strong></td>
              <td style="padding: 4px 0; color: #059669; font-weight: bold;">Verified & Approved by Trustees</td>
            </tr>
          </table>
        </div>

        ${temporaryPassword ? `
        <div style="background-color: #fefce8; border: 2px dashed #ca8a04; border-radius: 10px; padding: 16px; margin: 18px 0; font-size: 13px;">
          <h4 style="margin: 0 0 8px; color: #854d0e; font-size: 14px;">🔑 Your Donor Portal Login Credentials</h4>
          <p style="margin: 4px 0; color: #475569;">An authenticated portal account has been created for you by the Trustee Administration. You can use these credentials to log in, view donation history, and download cumulative 80G certificates:</p>
          <div style="background: white; border: 1px solid #fef08a; padding: 10px 14px; border-radius: 6px; margin: 8px 0;">
            <p style="margin: 4px 0;"><strong>Login Email / Identifier:</strong> <span style="font-family: monospace; color: #0f172a; font-weight: bold;">${to}</span></p>
            <p style="margin: 4px 0;"><strong>Initial Password:</strong> <span style="font-family: monospace; background: #fee2e2; color: #991b1b; padding: 2px 8px; border-radius: 4px; font-weight: bold; letter-spacing: 0.5px;">${temporaryPassword}</span></p>
          </div>
          <p style="margin: 6px 0 0; font-size: 12px; color: #854d0e;">
            🔒 For security, please sign in and change your password in Profile Settings upon first login.
          </p>
        </div>
        ` : `
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 14px; margin: 14px 0; font-size: 12.5px; color: #334155;">
          🔐 Sign in with your registered email (<strong>${to}</strong>) to access and download all your past receipts anytime.
        </div>
        `}

        <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 12px 14px; margin: 16px 0; font-size: 12.5px; color: #1e40af; border-radius: 4px;">
          📎 <strong>PDF Receipt Attached:</strong> Your official Form 10BD / 80G tax receipt with digital seal, QR verification code, and trustee signature is attached to this email as a PDF file.
        </div>

        <div style="text-align: center; margin: 26px 0 16px;">
          <a href="${clientBase}/login?role=donor" style="background: #ea580c; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 13px; display: inline-block;">
            Sign In to Donor Portal
          </a>
        </div>
      </div>

      <div style="border-top: 1px solid #e2e8f0; padding-top: 14px; font-size: 11px; color: #94a3b8; text-align: center; line-height: 1.5;">
        National Head Office - Krishna Vihar Pala Road Aligarh, Uttar Pradesh - 202001 | Helpline: +91 93196 98759<br/>
        Email: samasyasamadhanparishad@gmail.com | Website: bharatiyayuvakranti.org
      </div>
    </div>
  `;

  return await sendEmail({
    to,
    subject,
    htmlText,
    template: 'donation_80g',
    attachments
  });
};

// 2. Membership Approved -> Appointment Letter & Digital ID Card Email with PDFs Attached
const sendMembershipApprovalEmail = async (param) => {
  const memberObj = param.toObject ? param.toObject() : param;
  const to = memberObj.to || memberObj.email || memberObj.user?.email;
  const memberName = memberObj.memberName || memberObj.name || memberObj.user?.name || 'Valued Member';
  const memberId = memberObj.memberId || memberObj.user?.memberId || 'BYK-MEM-2026-PENDING';
  const role = memberObj.role || memberObj.user?.role || 'Member';
  const designation = memberObj.designation || memberObj.user?.designation || 'Active Social Worker';
  const planName = memberObj.planName || memberObj.membershipPlan || memberObj.user?.membershipPlan || 'Standard Active Member';

  const temporaryPassword = memberObj.temporaryPassword || param.temporaryPassword || '';
  const clientBase = (process.env.CLIENT_URL || 'http://localhost:3000').replace(/\/+$/, '');

  if (!to) {
    console.warn('⚠️ [EMAIL NOTICE] No recipient email found for membership approval notification.');
    return null;
  }

  // Generate Member Appointment Letter PDF & Member ID Card PDF
  let attachments = [];
  try {
    const [apptPdf, idCardPdf] = await Promise.all([
      pdfService.generateAppointmentLetterPdf({ ...memberObj, memberId, name: memberName, designation }),
      pdfService.generateMemberIdCardPdf({ ...memberObj, memberId, name: memberName, designation, role })
    ]);

    attachments.push(
      {
        filename: `Member_Appointment_Letter_${memberId}.pdf`,
        content: apptPdf,
        contentType: 'application/pdf'
      },
      {
        filename: `Member_ID_Card_${memberId}.pdf`,
        content: idCardPdf,
        contentType: 'application/pdf'
      }
    );
  } catch (err) {
    console.error('Error generating membership PDFs:', err);
  }

  const subject = `Official Appointment Letter & ID Card Attached (${memberId}) - Yuva Kranti Dal`;
  const htmlText = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 14px; background-color: #ffffff;">
      <div style="background: linear-gradient(135deg, #b91c1c, #ea580c); padding: 18px; border-radius: 10px; text-align: center; color: white;">
        <h2 style="margin: 0; font-size: 22px; letter-spacing: 0.5px;">YUVA KRANTI DAL</h2>
        <p style="margin: 4px 0 0; font-size: 12px; opacity: 0.95;">Nationwide Non-Profit Movement • NITI Aayog Registered NGO</p>
      </div>

      <div style="padding: 20px 0; color: #1e293b;">
        <div style="display: inline-block; background-color: #ecfdf5; border: 1px solid #a7f3d0; color: #047857; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; margin-bottom: 12px;">
          🎉 Congratulations! Membership Approved by National Executive Council
        </div>

        <p style="font-size: 15px; margin: 8px 0;">Dear <strong>${memberName}</strong>,</p>
        <p style="font-size: 14px; line-height: 1.6; color: #334155;">
          Following thorough verification of your credentials and enrollment details, the Board of Trustees and National Executive Council of <strong>Yuva Kranti Dal</strong> have officially approved your appointment as a registered member.
        </p>
        
        <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 10px; padding: 16px; margin: 18px 0; font-size: 13px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 4px 0; color: #64748b; width: 45%;"><strong>Official Member ID:</strong></td>
              <td style="padding: 4px 0; font-family: monospace; color: #b91c1c; font-weight: bold;">${memberId}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #64748b;"><strong>Role Assigned:</strong></td>
              <td style="padding: 4px 0; font-weight: bold; color: #0f172a;">${role}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #64748b;"><strong>Designation:</strong></td>
              <td style="padding: 4px 0; color: #0f172a;">${designation}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #64748b;"><strong>Membership Plan:</strong></td>
              <td style="padding: 4px 0; color: #0f172a;">${planName}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #64748b;"><strong>Enrollment Status:</strong></td>
              <td style="padding: 4px 0; color: #059669; font-weight: bold;">Active, Verified & Sealed</td>
            </tr>
          </table>
        </div>

        ${temporaryPassword ? `
        <div style="background-color: #fefce8; border: 2px dashed #ca8a04; border-radius: 10px; padding: 16px; margin: 18px 0; font-size: 13px;">
          <h4 style="margin: 0 0 8px; color: #854d0e; font-size: 14px;">🔑 Your Portal Login Credentials</h4>
          <p style="margin: 4px 0; color: #475569;">Your authenticated portal account has been created by the Trustee Administration. Use the credentials below to log in:</p>
          <div style="background: white; border: 1px solid #fef08a; padding: 10px 14px; border-radius: 6px; margin: 8px 0;">
            <p style="margin: 4px 0;"><strong>Login Email / Identifier:</strong> <span style="font-family: monospace; color: #0f172a; font-weight: bold;">${to}</span></p>
            <p style="margin: 4px 0;"><strong>Initial Password:</strong> <span style="font-family: monospace; background: #fee2e2; color: #991b1b; padding: 2px 8px; border-radius: 4px; font-weight: bold; letter-spacing: 0.5px;">${temporaryPassword}</span></p>
          </div>
          <p style="margin: 6px 0 0; font-size: 12px; color: #854d0e;">
            🔒 For security, please sign in and change your password in your Profile Settings upon first login.
          </p>
        </div>
        ` : `
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 14px; margin: 14px 0; font-size: 12.5px; color: #334155;">
          🔐 Sign in with your registered email (<strong>${to}</strong>) and password to access your verifiable dashboard.
        </div>
        `}

        <div style="background-color: #f0fdf4; border-left: 4px solid #16a34a; padding: 12px 14px; margin: 16px 0; font-size: 12.5px; color: #166534; border-radius: 4px;">
          📄 <strong>PDF Credentials Attached to this Email:</strong><br/>
          • <strong>Member_Appointment_Letter_${memberId}.pdf</strong> (Official Letter of Appointment)<br/>
          • <strong>Member_ID_Card_${memberId}.pdf</strong> (Dual-Sided Identity Card with QR Verification)
        </div>

        <div style="text-align: center; margin: 26px 0 16px;">
          <a href="${clientBase}/login?role=member" style="background: #0f172a; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 13px; display: inline-block;">
            Sign In to Member Portal
          </a>
        </div>
      </div>

      <div style="border-top: 1px solid #e2e8f0; padding-top: 14px; font-size: 11px; color: #94a3b8; text-align: center; line-height: 1.5;">
        National Head Office - Krishna Vihar Pala Road Aligarh, Uttar Pradesh - 202001 | Helpline: +91 93196 98759<br/>
        Email: samasyasamadhanparishad@gmail.com | Website: bharatiyayuvakranti.org
      </div>
    </div>
  `;

  return await sendEmail({
    to,
    subject,
    htmlText,
    template: 'membership_approved',
    attachments
  });
};

// 3. Volunteer Approved -> Offer Letter & ID Card Email with PDFs Attached
const sendVolunteerApprovalEmail = async (param) => {
  const volObj = param.toObject ? param.toObject() : param;
  const to = volObj.to || volObj.email || volObj.user?.email;
  const volunteerName = volObj.volunteerName || volObj.name || volObj.user?.name || 'Valued Volunteer';
  const volunteerId = volObj.volunteerId || volObj.memberId || volObj.user?.memberId || 'BYK-VOL-2026-PENDING';

  const temporaryPassword = volObj.temporaryPassword || param.temporaryPassword || '';
  const clientBase = (process.env.CLIENT_URL || 'http://localhost:3000').replace(/\/+$/, '');

  if (!to) {
    console.warn('⚠️ [EMAIL NOTICE] No recipient email found for volunteer approval notification.');
    return null;
  }

  // Generate Volunteer Offer Letter PDF & Volunteer ID Card PDF
  let attachments = [];
  try {
    const [offerPdf, idCardPdf] = await Promise.all([
      pdfService.generateVolunteerOfferLetterPdf({ ...volObj, memberId: volunteerId, name: volunteerName }),
      pdfService.generateVolunteerIdCardPdf({ ...volObj, memberId: volunteerId, name: volunteerName, role: 'Volunteer' })
    ]);

    attachments.push(
      {
        filename: `Volunteer_Offer_Letter_${volunteerId}.pdf`,
        content: offerPdf,
        contentType: 'application/pdf'
      },
      {
        filename: `Volunteer_ID_Card_${volunteerId}.pdf`,
        content: idCardPdf,
        contentType: 'application/pdf'
      }
    );
  } catch (err) {
    console.error('Error generating volunteer PDFs:', err);
  }

  const subject = `Volunteer Offer Letter & ID Card Attached (${volunteerId}) - Yuva Kranti Dal`;
  const htmlText = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 14px; background-color: #ffffff;">
      <div style="background: linear-gradient(135deg, #059669, #10b981); padding: 18px; border-radius: 10px; text-align: center; color: white;">
        <h2 style="margin: 0; font-size: 22px; letter-spacing: 0.5px;">YUVA KRANTI DAL</h2>
        <p style="margin: 4px 0 0; font-size: 12px; opacity: 0.95;">Volunteer Wing • Serving Humanity with Compassion</p>
      </div>

      <div style="padding: 20px 0; color: #1e293b;">
        <div style="display: inline-block; background-color: #ecfdf5; border: 1px solid #a7f3d0; color: #047857; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; margin-bottom: 12px;">
          🎉 Welcome to the Mission! Volunteer Enrolment Approved
        </div>

        <p style="font-size: 15px; margin: 8px 0;">Dear <strong>${volunteerName}</strong>,</p>
        <p style="font-size: 14px; line-height: 1.6; color: #334155;">
          We are delighted to welcome you to the volunteer wing of <strong>Yuva Kranti Dal</strong>. Your application has been approved by the Executive Committee, and you are now an active grassroots ambassador.
        </p>
        
        <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 10px; padding: 16px; margin: 18px 0; font-size: 13px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 4px 0; color: #64748b; width: 45%;"><strong>Official Volunteer ID:</strong></td>
              <td style="padding: 4px 0; font-family: monospace; color: #059669; font-weight: bold;">${volunteerId}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #64748b;"><strong>Wing:</strong></td>
              <td style="padding: 4px 0; font-weight: bold; color: #0f172a;">Active Grassroots Youth Volunteer</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #64748b;"><strong>Status:</strong></td>
              <td style="padding: 4px 0; color: #059669; font-weight: bold;">Verified & Active</td>
            </tr>
          </table>
        </div>

        ${temporaryPassword ? `
        <div style="background-color: #fefce8; border: 2px dashed #ca8a04; border-radius: 10px; padding: 16px; margin: 18px 0; font-size: 13px;">
          <h4 style="margin: 0 0 8px; color: #854d0e; font-size: 14px;">🔑 Your Volunteer Portal Login Credentials</h4>
          <p style="margin: 4px 0; color: #475569;">Your authenticated portal account has been created by the Trustee Administration. Use the credentials below to log in:</p>
          <div style="background: white; border: 1px solid #fef08a; padding: 10px 14px; border-radius: 6px; margin: 8px 0;">
            <p style="margin: 4px 0;"><strong>Login Email / Identifier:</strong> <span style="font-family: monospace; color: #0f172a; font-weight: bold;">${to}</span></p>
            <p style="margin: 4px 0;"><strong>Initial Password:</strong> <span style="font-family: monospace; background: #fee2e2; color: #991b1b; padding: 2px 8px; border-radius: 4px; font-weight: bold; letter-spacing: 0.5px;">${temporaryPassword}</span></p>
          </div>
          <p style="margin: 6px 0 0; font-size: 12px; color: #854d0e;">
            🔒 For security, please sign in and change your password in your Profile Settings upon first login.
          </p>
        </div>
        ` : `
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 14px; margin: 14px 0; font-size: 12.5px; color: #334155;">
          🔐 Sign in with your registered email (<strong>${to}</strong>) and password to access your verifiable dashboard.
        </div>
        `}

        <div style="background-color: #f0fdf4; border-left: 4px solid #059669; padding: 12px 14px; margin: 16px 0; font-size: 12.5px; color: #065f46; border-radius: 4px;">
          📄 <strong>PDF Credentials Attached to this Email:</strong><br/>
          • <strong>Volunteer_Offer_Letter_${volunteerId}.pdf</strong> (Formal Appointment Offer Letter)<br/>
          • <strong>Volunteer_ID_Card_${volunteerId}.pdf</strong> (Dual-Sided QR Verifiable Volunteer ID Card)
        </div>

        <div style="text-align: center; margin: 26px 0 16px;">
          <a href="${clientBase}/login?role=volunteer" style="background: #059669; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 13px; display: inline-block;">
            Access Volunteer Portal
          </a>
        </div>
      </div>

      <div style="border-top: 1px solid #e2e8f0; padding-top: 14px; font-size: 11px; color: #94a3b8; text-align: center; line-height: 1.5;">
        National Head Office - Krishna Vihar Pala Road Aligarh, Uttar Pradesh - 202001 | Helpline: +91 93196 98759<br/>
        Email: samasyasamadhanparishad@gmail.com | Website: bharatiyayuvakranti.org
      </div>
    </div>
  `;

  return await sendEmail({
    to,
    subject,
    htmlText,
    template: 'volunteer_approved',
    attachments
  });
};

// 4. Certificate Awarded Email with PDF Attached
const sendCertificateEmail = async (param) => {
  const certObj = param.toObject ? param.toObject() : param;
  const to = certObj.to || certObj.recipientEmail || certObj.email || certObj.recipient?.email;
  const recipientName = certObj.recipientName || certObj.name || 'Honored Contributor';
  const awardTitle = certObj.awardTitle || certObj.title || 'Certificate of Appreciation & National Service';
  const certificateNo = certObj.certificateNo || certObj.certificateId || 'BYK-CERT-PENDING';
  const reason = certObj.reason || 'In recognition of outstanding dedication and exemplary leadership for societal empowerment.';

  if (!to) {
    console.warn('⚠️ [EMAIL NOTICE] No recipient email found for certificate notification.');
    return null;
  }

  // Generate Certificate PDF
  let attachments = [];
  try {
    const certPdf = await pdfService.generateCertificatePdf({
      ...certObj,
      certificateId: certificateNo,
      recipientName,
      title: awardTitle,
      reason
    });

    attachments.push({
      filename: `Certificate_${certificateNo}.pdf`,
      content: certPdf,
      contentType: 'application/pdf'
    });
  } catch (err) {
    console.error('Error generating certificate PDF:', err);
  }

  const subject = `Certificate of Appreciation Awarded & Attached (${certificateNo}) - Yuva Kranti Dal`;
  const htmlText = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 14px; background-color: #ffffff;">
      <div style="background: linear-gradient(135deg, #c2410c, #d97706); padding: 18px; border-radius: 10px; text-align: center; color: white;">
        <h2 style="margin: 0; font-size: 22px; letter-spacing: 0.5px;">YUVA KRANTI DAL</h2>
        <p style="margin: 4px 0 0; font-size: 12px; opacity: 0.95;">National Honours & Civic Recognition Council</p>
      </div>

      <div style="padding: 20px 0; color: #1e293b;">
        <div style="display: inline-block; background-color: #fef3c7; border: 1px solid #fde68a; color: #92400e; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; margin-bottom: 12px;">
          🎖️ National Citation Conferred
        </div>

        <p style="font-size: 15px; margin: 8px 0;">Dear <strong>${recipientName}</strong>,</p>
        <p style="font-size: 14px; line-height: 1.6; color: #334155;">
          The National Executive Council of <strong>Yuva Kranti Dal</strong> is proud to confer upon you the official citation: <strong>"${awardTitle}"</strong>.
        </p>
        
        <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 10px; padding: 16px; margin: 18px 0; font-size: 13px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 4px 0; color: #64748b; width: 45%;"><strong>Certificate Number:</strong></td>
              <td style="padding: 4px 0; font-family: monospace; color: #c2410c; font-weight: bold;">${certificateNo}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #64748b;"><strong>Citation Title:</strong></td>
              <td style="padding: 4px 0; font-weight: bold; color: #0f172a;">${awardTitle}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #64748b;"><strong>Commendation:</strong></td>
              <td style="padding: 4px 0; color: #334155;">${reason}</td>
            </tr>
          </table>
        </div>

        <div style="background-color: #fffbeb; border-left: 4px solid #d97706; padding: 12px 14px; margin: 16px 0; font-size: 12.5px; color: #92400e; border-radius: 4px;">
          📜 <strong>PDF Certificate Attached:</strong> Your high-resolution printable Certificate of Appreciation carrying the official Trust Seal, QR verification code, and President's signature is attached to this email.
        </div>

        <div style="text-align: center; margin: 26px 0 16px;">
          <a href="https://www.yuvakrantidal.com/certificates?view=${certificateNo}" style="background: #c2410c; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 13px; display: inline-block;">
            Verify Certificate on Portal
          </a>
        </div>
      </div>

      <div style="border-top: 1px solid #e2e8f0; padding-top: 14px; font-size: 11px; color: #94a3b8; text-align: center; line-height: 1.5;">
        National Head Office - Krishna Vihar Pala Road Aligarh, Uttar Pradesh - 202001 | Helpline: +91 93196 98759<br/>
        Email: samasyasamadhanparishad@gmail.com | Website: bharatiyayuvakranti.org
      </div>
    </div>
  `;

  return await sendEmail({
    to,
    subject,
    htmlText,
    template: 'certificate_awarded',
    attachments
  });
};

// 5. Password Reset Email
const sendPasswordResetEmail = async (param1, param2) => {
  let to, resetToken, resetUrl, userName;

  if (param1 && typeof param1 === 'object' && param2 !== undefined) {
    // Called as (user, resetUrl)
    to = param1.email || param1.to;
    userName = param1.name || param1.userName;
    resetUrl = param2;
  } else if (param1 && typeof param1 === 'object') {
    // Called as ({ to, resetToken, resetUrl, userName })
    to = param1.to || param1.email;
    userName = param1.userName || param1.name;
    resetToken = param1.resetToken;
    resetUrl = param1.resetUrl;
  }

  const frontendUrl = process.env.FRONTEND_URL || process.env.CLIENT_URL || 'http://localhost:3000';
  if (!resetUrl && resetToken) {
    resetUrl = `${frontendUrl}/reset-password?token=${resetToken}&email=${encodeURIComponent(to || '')}`;
  }

  if (!to) {
    console.warn('⚠️ [EMAIL NOTICE] No recipient email specified for password reset.');
    return null;
  }

  const subject = `Password Reset Request - Yuva Kranti Dal Portal`;
  const htmlText = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 14px; background-color: #ffffff;">
      <div style="background: linear-gradient(135deg, #ea580c, #f59e0b); padding: 18px; border-radius: 10px; text-align: center; color: white;">
        <h2 style="margin: 0; font-size: 22px; letter-spacing: 0.5px;">YUVA KRANTI DAL</h2>
        <p style="margin: 4px 0 0; font-size: 12px; opacity: 0.95;">Member & Administrative Portal Security</p>
      </div>

      <div style="padding: 20px 0; color: #1e293b;">
        <h3 style="color: #ea580c; margin-top: 0; font-size: 18px;">🔐 Password Reset Instructions</h3>
        <p style="font-size: 15px; margin: 8px 0;">Dear <strong>${userName || 'Valued Member'}</strong>,</p>
        <p style="font-size: 14px; line-height: 1.6; color: #334155;">
          We received a request to reset the password for your Yuva Kranti Dal portal account.
        </p>
        
        <p style="font-size: 14px; line-height: 1.6; color: #334155; margin: 16px 0;">
          Click the secure button below to choose a new password. This reset link will expire in <strong>30 minutes</strong> for your account security:
        </p>

        <div style="text-align: center; margin: 26px 0;">
          <a href="${resetUrl}" style="background: #ea580c; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block; box-shadow: 0 4px 6px -1px rgba(234, 88, 12, 0.2);">
            Reset My Password
          </a>
        </div>

        <p style="font-size: 12px; color: #64748b; line-height: 1.6; background-color: #f8fafc; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0;">
          If the button above doesn't work, copy and paste this link into your browser:<br/>
          <a href="${resetUrl}" style="color: #ea580c; word-break: break-all;">${resetUrl}</a>
        </p>

        <p style="font-size: 11.5px; color: #94a3b8; line-height: 1.5; margin-top: 16px;">
          If you did not request this password reset, please ignore this email. Your current password will remain completely secure.
        </p>
      </div>

      <div style="border-top: 1px solid #e2e8f0; padding-top: 14px; font-size: 11px; color: #94a3b8; text-align: center; line-height: 1.5;">
        National Head Office - Krishna Vihar Pala Road Aligarh, Uttar Pradesh - 202001 | Helpline: +91 93196 98759<br/>
        Email: samasyasamadhanparishad@gmail.com | Website: bharatiyayuvakranti.org
      </div>
    </div>
  `;

  return await sendEmail({
    to,
    subject,
    htmlText,
    template: 'forgot_password'
  });
};

module.exports = {
  sendEmail,
  testSmtpConnection,
  sendDonationApprovalEmail,
  sendMembershipApprovalEmail,
  sendVolunteerApprovalEmail,
  sendCertificateEmail,
  sendPasswordResetEmail
};
