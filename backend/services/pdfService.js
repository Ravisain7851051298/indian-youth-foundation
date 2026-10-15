const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');
const Setting = require('../models/Setting');

// Helper to resolve image files from uploads/ or URLs safely as buffer
async function resolveImageBuffer(imgUrl) {
  if (!imgUrl) return null;
  try {
    // 1. Local path starting with /uploads or uploads
    if (imgUrl.startsWith('/uploads') || imgUrl.startsWith('uploads')) {
      const cleanPath = imgUrl.startsWith('/') ? imgUrl.slice(1) : imgUrl;
      const localFilePath = path.join(__dirname, '..', cleanPath);
      if (fs.existsSync(localFilePath)) {
        return fs.readFileSync(localFilePath);
      }
    }
    // 2. Contains /uploads/
    if (imgUrl.includes('/uploads/')) {
      const parts = imgUrl.split('/uploads/');
      const localFilePath = path.join(__dirname, '..', 'uploads', parts[1]);
      if (fs.existsSync(localFilePath)) {
        return fs.readFileSync(localFilePath);
      }
    }
    // 3. Web URL fallback (non-blocking with 2.5s timeout)
    if (imgUrl.startsWith('http://') || imgUrl.startsWith('https://')) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);
      const res = await fetch(imgUrl, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        const arrayBuf = await res.arrayBuffer();
        return Buffer.from(arrayBuf);
      }
    }
  } catch (e) {
    // Graceful fallback without throwing
  }
  return null;
}

// Helper to convert number to Indian currency words
function numberToWords(num) {
  const n = Math.floor(Number(num) || 0);
  if (n <= 0) return 'Zero Rupees Only';

  const single = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function convertTwoDigits(val) {
    if (val < 10) return single[val];
    if (val < 20) return teens[val - 10];
    const unit = val % 10;
    return tens[Math.floor(val / 10)] + (unit ? ' ' + single[unit] : '');
  }

  function convertThreeDigits(val) {
    const hundred = Math.floor(val / 100);
    const rest = val % 100;
    let res = '';
    if (hundred > 0) {
      res += single[hundred] + ' Hundred';
      if (rest > 0) res += ' ';
    }
    if (rest > 0) {
      res += convertTwoDigits(rest);
    }
    return res;
  }

  const crore = Math.floor(n / 10000000);
  let rem = n % 10000000;
  const lakh = Math.floor(rem / 100000);
  rem = rem % 100000;
  const thousand = Math.floor(rem / 1000);
  rem = rem % 1000;
  const hundredAndRest = rem;

  let words = '';
  if (crore > 0) words += convertTwoDigits(crore) + ' Crore ';
  if (lakh > 0) words += convertTwoDigits(lakh) + ' Lakh ';
  if (thousand > 0) words += convertTwoDigits(thousand) + ' Thousand ';
  if (hundredAndRest > 0) words += convertThreeDigits(hundredAndRest) + ' ';

  return words.trim() + ' Rupees Only';
}

function formatDate(d) {
  try {
    const date = d ? new Date(d) : new Date();
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  } catch (e) {
    return '14 Oct 2026';
  }
}

// Clean non-Latin / unsupported characters for standard PDFKit fonts
function sanitize(str) {
  if (!str) return '';
  return String(str).replace(/[^\x20-\x7E\n\r\t]/g, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * Draw a prestigious trust shield in vector graphics
 */
function drawVectorShield(doc, x, y, width = 42, height = 50, color = '#b45309') {
  doc.save();
  const w = width;
  const h = height;
  doc.lineWidth(1.5).strokeColor(color).fillColor('#fef3c7');
  
  // Shield path
  doc.moveTo(x, y)
     .lineTo(x + w, y)
     .lineTo(x + w, y + h * 0.55)
     .quadraticCurveTo(x + w * 0.5, y + h, x + w * 0.5, y + h)
     .quadraticCurveTo(x, y + h * 0.55, x, y + h * 0.55)
     .closePath()
     .fillAndStroke();

  // Shield inner star/badge text
  doc.font('Helvetica-Bold').fontSize(6.5).fillColor('#9a3412');
  doc.text('12A/80G', x + 2, y + 14, { width: w - 4, align: 'center' });
  doc.fontSize(5.5).fillColor('#b45309');
  doc.text('VERIFIED', x + 2, y + 24, { width: w - 4, align: 'center' });
  doc.fontSize(4.5).fillColor('#475569');
  doc.text('GOVT TRUST', x + 2, y + 33, { width: w - 4, align: 'center' });
  doc.restore();
}

/**
 * Draw a vector Trust Seal / Stamp
 */
function drawVectorSeal(doc, cx, cy, radius = 34, accentColor = '#b91c1c') {
  doc.save();
  // Outer circle
  doc.lineWidth(1.8).strokeColor(accentColor).circle(cx, cy, radius).stroke();
  // Inner beaded circle
  doc.lineWidth(0.8).dash(3, { space: 2 }).circle(cx, cy, radius - 4).stroke();
  doc.undash();
  // Core circle
  doc.lineWidth(1).circle(cx, cy, radius - 8).stroke();

  // Seal Text
  doc.font('Helvetica-Bold').fontSize(5.5).fillColor(accentColor);
  doc.text('INDIAN YOUTH FOUNDATION', cx - radius + 6, cy - 16, { width: (radius - 6) * 2, align: 'center' });
  doc.fontSize(7).text('OFFICIAL SEAL', cx - radius + 6, cy - 5, { width: (radius - 6) * 2, align: 'center' });
  doc.fontSize(5).text('REG NO: 421/2019', cx - radius + 6, cy + 6, { width: (radius - 6) * 2, align: 'center' });
  doc.restore();
}

/**
 * 1. GENERATE DONATION 80G TAX RECEIPT PDF
 */
async function generateDonationReceiptPdf(donation = {}) {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', margin: 40 });
      const buffers = [];
      doc.on('data', b => buffers.push(b));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      const receiptNumber = sanitize(donation.receiptNumber || 'BYK-80G-2026-0001');
      const donorName = sanitize(donation.donorName || 'Generous Contributor');
      const panNumber = sanitize(donation.panNumber || donation.pan || 'NOT PROVIDED');
      const amount = Number(donation.amount) || 0;
      const email = sanitize(donation.donorEmail || donation.email || 'N/A');
      const phone = sanitize(donation.donorPhone || donation.phone || 'N/A');
      const address = sanitize(donation.address || 'N/A');
      const campaign = sanitize(donation.campaignTitle || 'General Youth Welfare & Education Fund');
      const dateStr = formatDate(donation.createdAt || donation.approvedAt);
      const txId = sanitize(donation.transactionId || donation.orderId || 'Verified Online');
      const paymentMethod = sanitize(donation.paymentMethod || 'UPI Transfer');
      const approvedBy = sanitize(donation.approvedBy || 'Trustee Board');

      // Verification QR Code
      const qrData = `https://bharatiyayuvakranti.org/verify/donation/${receiptNumber}`;
      const qrBuffer = await QRCode.toBuffer(qrData, { width: 100, margin: 1 });

      // Outer Decorative Double Border
      doc.rect(25, 25, 545, 792).lineWidth(2).strokeColor('#ea580c').stroke();
      doc.rect(29, 29, 537, 784).lineWidth(0.8).strokeColor('#94a3b8').stroke();

      // Top Header
      doc.font('Helvetica-Bold').fontSize(18).fillColor('#c2410c');
      doc.text('INDIAN YOUTH FOUNDATION', 40, 45, { align: 'center' });
      doc.font('Helvetica-Bold').fontSize(11).fillColor('#0f172a');
      doc.text('BHARATIYA YUVA KRANTI', 40, 68, { align: 'center' });
      doc.font('Helvetica').fontSize(8.5).fillColor('#475569');
      doc.text('Registered Public Charitable Trust • Reg. No: 421/2019 • Section 12A & 80G Certified', 40, 83, { align: 'center' });
      doc.text('Head Office: Krishna Vihar, Pala Road, Aligarh, Uttar Pradesh - 202001 | Phone: +91 93196 98759', 40, 95, { align: 'center' });
      doc.text('Email: samasyasamadhanparishad@gmail.com | Website: bharatiyayuvakranti.org', 40, 107, { align: 'center' });

      // Saffron Divider
      doc.moveTo(40, 122).lineTo(555, 122).lineWidth(1.5).strokeColor('#ea580c').stroke();

      // Title Banner
      doc.rect(40, 130, 515, 26).fillColor('#ea580c').fill();
      doc.font('Helvetica-Bold').fontSize(11).fillColor('#ffffff');
      doc.text('OFFICIAL DONATION RECEIPT & 80G TAX EXEMPTION CERTIFICATE', 40, 137, { align: 'center', width: 515 });

      // Meta Info Bar (Receipt No & Date)
      doc.rect(40, 165, 515, 30).fillColor('#f8fafc').strokeColor('#cbd5e1').lineWidth(1).fillAndStroke();
      doc.font('Helvetica-Bold').fontSize(9).fillColor('#0f172a');
      doc.text(`Receipt No: `, 50, 175);
      doc.font('Helvetica-Bold').fillColor('#c2410c').text(receiptNumber, 115, 175);

      doc.font('Helvetica-Bold').fillColor('#0f172a').text(`Date of Issue: `, 380, 175);
      doc.font('Helvetica').fillColor('#334155').text(dateStr, 455, 175);

      // Donor Details Table Box
      let y = 205;
      const rowHeight = 22;
      const details = [
        ['Received With Thanks From:', donorName],
        ['Donor PAN (For 80G Exemption):', panNumber],
        ['Donor Email & Contact:', `${email} | ${phone}`],
        ['Donor Address:', address],
        ['Purpose / Welfare Campaign:', campaign],
        ['Mode of Payment & Ref / UTR:', `${paymentMethod} (Ref: ${txId})`],
        ['Amount Donated (in Figures):', `Rs. ${amount.toLocaleString('en-IN')}/-`],
        ['Amount Donated (in Words):', numberToWords(amount)]
      ];

      doc.rect(40, y, 515, details.length * rowHeight).strokeColor('#cbd5e1').lineWidth(1).stroke();

      details.forEach(([label, val], idx) => {
        const curY = y + (idx * rowHeight);
        if (idx % 2 === 0) {
          doc.rect(41, curY + 1, 513, rowHeight - 1).fillColor('#f1f5f9').fill();
        }
        // Label
        doc.font('Helvetica-Bold').fontSize(8.5).fillColor('#1e293b');
        doc.text(label, 50, curY + 6, { width: 180 });
        // Value
        doc.font(idx === 6 ? 'Helvetica-Bold' : 'Helvetica').fontSize(idx === 6 ? 9.5 : 8.5)
          .fillColor(idx === 6 ? '#059669' : '#0f172a');
        doc.text(val, 235, curY + 6, { width: 310 });

        if (idx > 0) {
          doc.moveTo(40, curY).lineTo(555, curY).lineWidth(0.5).strokeColor('#e2e8f0').stroke();
        }
      });

      // 80G Tax Exemption Declaration Box
      y += (details.length * rowHeight) + 15;
      doc.rect(40, y, 515, 62).fillColor('#fffbeb').strokeColor('#fde68a').lineWidth(1).fillAndStroke();
      doc.font('Helvetica-Bold').fontSize(8.5).fillColor('#92400e');
      doc.text('STATUTORY 80G INCOME TAX EXEMPTION DECLARATION', 50, y + 8);
      doc.font('Helvetica').fontSize(7.5).fillColor('#78350f');
      doc.text(
        '1. This receipt confirms that the donation received is voluntarily contributed and shall be utilized solely for the charitable objects of Indian Youth Foundation.\n' +
        '2. Donors are entitled to deduction under Section 80G(5)(vi) of the Income Tax Act, 1961 (Vide Trust Registration 421/2019).\n' +
        '3. This digital certificate is authenticated under electronic signature standards and registered in the Trust Audit Database.',
        50, y + 22, { width: 495, lineGap: 2 }
      );

      // Signatures, Seal & QR Code
      y += 80;
      // QR Code
      doc.image(qrBuffer, 50, y, { width: 75 });
      doc.font('Helvetica-Bold').fontSize(7).fillColor('#475569');
      doc.text('Scan to Verify Online', 45, y + 80, { width: 85, align: 'center' });

      // Vector Trust Seal
      drawVectorSeal(doc, 290, y + 38, 35, '#c2410c');

      // Authorized Signatory
      doc.font('Helvetica-Bold').fontSize(9).fillColor('#0f172a');
      doc.text('For INDIAN YOUTH FOUNDATION', 370, y + 10, { width: 175, align: 'center' });
      doc.font('Helvetica-Oblique').fontSize(8).fillColor('#059669');
      doc.text('[Digitally Verified by Trustees]', 370, y + 38, { width: 175, align: 'center' });
      doc.font('Helvetica-Bold').fontSize(8.5).fillColor('#0f172a');
      doc.text(approvedBy, 370, y + 54, { width: 175, align: 'center' });
      doc.font('Helvetica').fontSize(7.5).fillColor('#64748b');
      doc.text('National Executive / Authorized Signatory', 370, y + 66, { width: 175, align: 'center' });

      // Bottom Footer Bar
      doc.font('Helvetica').fontSize(7).fillColor('#94a3b8');
      doc.text('This is a computer-generated tax receipt that requires no physical signature under IT Act rules.', 40, 795, { align: 'center' });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * 2. GENERATE VOLUNTEER OFFER LETTER PDF
 */
async function generateVolunteerOfferLetterPdf(user = {}) {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', margin: 40 });
      const buffers = [];
      doc.on('data', b => buffers.push(b));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      const volunteerId = sanitize(user.memberId || 'BYK-VOL-2026-0501');
      const name = sanitize(user.name || 'Dedicated Volunteer');
      const email = sanitize(user.email || 'N/A');
      const phone = sanitize(user.phone || 'N/A');
      const city = sanitize(user.district || user.city || 'Aligarh');
      const state = sanitize(user.state || 'Uttar Pradesh');
      const dateStr = formatDate(user.verifiedAt || new Date());
      const approvedBy = sanitize(user.verifiedBy || 'National President & Board of Trustees');

      // QR Code
      const qrData = `https://bharatiyayuvakranti.org/verify/volunteer/${volunteerId}`;
      const qrBuffer = await QRCode.toBuffer(qrData, { width: 80, margin: 1 });

      // Outer Border
      doc.rect(25, 25, 545, 792).lineWidth(1.8).strokeColor('#059669').stroke();
      doc.rect(29, 29, 537, 784).lineWidth(0.8).strokeColor('#cbd5e1').stroke();

      // Header
      doc.font('Helvetica-Bold').fontSize(18).fillColor('#059669');
      doc.text('INDIAN YOUTH FOUNDATION', 40, 45, { align: 'center' });
      doc.font('Helvetica-Bold').fontSize(11).fillColor('#0f172a');
      doc.text('BHARATIYA YUVA KRANTI • VOLUNTEER WING', 40, 68, { align: 'center' });
      doc.font('Helvetica').fontSize(8.5).fillColor('#475569');
      doc.text('Registered Public Charitable Trust • Reg. No: 421/2019 • Dedicated to National Youth Service', 40, 83, { align: 'center' });
      doc.text('Head Office: Krishna Vihar, Pala Road, Aligarh, Uttar Pradesh - 202001 | Email: samasyasamadhanparishad@gmail.com', 40, 95, { align: 'center' });

      doc.moveTo(40, 110).lineTo(555, 110).lineWidth(1.5).strokeColor('#059669').stroke();

      // Ref & Date
      doc.font('Helvetica-Bold').fontSize(8.5).fillColor('#0f172a');
      doc.text(`Ref No: BYK/VOL-OFFER/2026/${volunteerId}`, 45, 120);
      doc.text(`Date: ${dateStr}`, 440, 120);

      // Recipient Box
      doc.rect(40, 138, 515, 50).fillColor('#f8fafc').strokeColor('#e2e8f0').lineWidth(1).fillAndStroke();
      doc.font('Helvetica-Bold').fontSize(9).fillColor('#0f172a');
      doc.text('TO:', 50, 145);
      doc.font('Helvetica-Bold').fontSize(9.5).fillColor('#059669').text(name, 75, 145);
      doc.font('Helvetica').fontSize(8.5).fillColor('#334155');
      doc.text(`Email: ${email} | Mobile: ${phone}`, 50, 160);
      doc.text(`Location: ${city}, ${state} | Assigned Volunteer ID: ${volunteerId}`, 50, 172);

      // Subject
      doc.font('Helvetica-Bold').fontSize(10).fillColor('#0f172a');
      doc.text('SUBJECT: OFFICIAL LETTER OF APPOINTMENT & OFFER AS REGISTERED VOLUNTEER', 40, 202, { underline: true });

      // Body Text
      let textY = 222;
      doc.font('Helvetica').fontSize(9).fillColor('#1e293b').lineGap(4);
      doc.text(`Dear ${name},`, 40, textY);

      textY += 18;
      const p1 = 'On behalf of the National Executive Council of Indian Youth Foundation (भारतीय युवा क्रांति), we are delighted to convey official approval of your volunteer application and warmly welcome you to our nationwide mission.';
      doc.text(p1, 40, textY, { width: 515, align: 'justify' });

      textY += 38;
      const p2 = `Following thorough review of your enrollment credentials, you have been officially designated as an Active Grassroots Volunteer under Volunteer ID: ${volunteerId}.`;
      doc.text(p2, 40, textY, { width: 515, align: 'justify' });

      textY += 32;
      doc.font('Helvetica-Bold').text('Key Charter of Responsibilities & Volunteer Ethics:', 40, textY);
      textY += 14;

      doc.font('Helvetica').fontSize(8.5);
      const points = [
        '1. Community & Grassroots Service: Actively participate in foundation initiatives, including child education drives, disaster relief, tree plantation, blood donation, and civic awareness.',
        '2. Non-Partisan Integrity: Adhere strictly to the humanitarian and secular ideals of the trust without political, sectarian, or commercial bias.',
        '3. Youth Mobilization: Inspire, organize, and mentor youth in your district to actively volunteer for community problem-solving.',
        '4. Identity Representation: Display your official QR-verified Volunteer ID Card during all ground campaigns and foundation events.'
      ];

      points.forEach(pt => {
        doc.text(pt, 50, textY, { width: 505, align: 'justify' });
        textY += 24;
      });

      textY += 6;
      doc.text(
        'We commend your noble spirit of altruism and dedication to nation-building. Together, we shall empower communities and uplift society.',
        40, textY, { width: 515, align: 'justify' }
      );

      // Bottom Signatures & Seal
      const signY = 660;
      doc.image(qrBuffer, 50, signY, { width: 70 });
      doc.font('Helvetica-Bold').fontSize(7).fillColor('#64748b');
      doc.text('Scan to Verify Online', 45, signY + 75, { width: 80, align: 'center' });

      drawVectorSeal(doc, 290, signY + 35, 34, '#059669');

      doc.font('Helvetica-Bold').fontSize(9).fillColor('#0f172a');
      doc.text('For INDIAN YOUTH FOUNDATION', 370, signY + 5, { width: 175, align: 'center' });
      doc.font('Helvetica-Oblique').fontSize(8).fillColor('#059669');
      doc.text('[Statutory Digital Seal & Signature]', 370, signY + 30, { width: 175, align: 'center' });
      doc.font('Helvetica-Bold').fontSize(8.5).fillColor('#0f172a');
      doc.text(approvedBy, 370, signY + 48, { width: 175, align: 'center' });
      doc.font('Helvetica').fontSize(7.5).fillColor('#64748b');
      doc.text('National Executive Committee', 370, signY + 60, { width: 175, align: 'center' });

      doc.font('Helvetica').fontSize(7).fillColor('#94a3b8');
      doc.text('This is an authentic official appointment document issued under the bylaws of Indian Youth Foundation Trust.', 40, 795, { align: 'center' });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * 3. GENERATE APPOINTMENT LETTER PDF (FOR MEMBERS)
 */
async function generateAppointmentLetterPdf(user = {}) {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', margin: 40 });
      const buffers = [];
      doc.on('data', b => buffers.push(b));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      let dbSettings = null;
      try {
        dbSettings = await Setting.findOne();
      } catch (e) {}

      const memberId = sanitize(user.memberId || 'BYK-MEM-2026-0001');
      const name = sanitize(user.name || 'Executive Member');
      const email = sanitize(user.email || 'N/A');
      const phone = sanitize(user.phone || 'N/A');
      const designation = sanitize(user.designation || 'Active Social Worker');
      const city = sanitize(user.district || user.city || 'Aligarh');
      const state = sanitize(user.state || 'Uttar Pradesh');
      const dateStr = formatDate(user.verifiedAt || new Date());
      const approvedBy = sanitize(user.verifiedBy || dbSettings?.presidentName || 'Ravi Saini (National President & Trustee)');

      // QR Code
      const qrData = `https://bharatiyayuvakranti.org/verify/member/${memberId}`;
      const qrBuffer = await QRCode.toBuffer(qrData, { width: 80, margin: 1 });

      // Outer Border
      doc.rect(25, 25, 545, 792).lineWidth(2).strokeColor('#b91c1c').stroke();
      doc.rect(29, 29, 537, 784).lineWidth(0.8).strokeColor('#cbd5e1').stroke();

      // Header
      doc.font('Helvetica-Bold').fontSize(18).fillColor('#b91c1c');
      doc.text('INDIAN YOUTH FOUNDATION', 40, 45, { align: 'center' });
      doc.font('Helvetica-Bold').fontSize(11).fillColor('#0f172a');
      doc.text('BHARATIYA YUVA KRANTI • NATIONAL EXECUTIVE COUNCIL', 40, 68, { align: 'center' });
      doc.font('Helvetica').fontSize(8.5).fillColor('#475569');
      doc.text('Registered Public Charitable Trust • Reg. No: 421/2019 • NITI Aayog Verified NGO', 40, 83, { align: 'center' });
      doc.text('Head Office: Krishna Vihar, Pala Road, Aligarh, Uttar Pradesh - 202001 | Phone: +91 93196 98759', 40, 95, { align: 'center' });

      doc.moveTo(40, 110).lineTo(555, 110).lineWidth(1.5).strokeColor('#b91c1c').stroke();

      // Ref & Date
      doc.font('Helvetica-Bold').fontSize(8.5).fillColor('#0f172a');
      doc.text(`Ref No: BYK/MEM-APPT/2026/${memberId}`, 45, 120);
      doc.text(`Date: ${dateStr}`, 440, 120);

      // Recipient Box
      doc.rect(40, 138, 515, 55).fillColor('#f8fafc').strokeColor('#e2e8f0').lineWidth(1).fillAndStroke();
      doc.font('Helvetica-Bold').fontSize(9).fillColor('#0f172a');
      doc.text('TO:', 50, 145);
      doc.font('Helvetica-Bold').fontSize(9.5).fillColor('#b91c1c').text(name, 75, 145);
      doc.font('Helvetica').fontSize(8.5).fillColor('#334155');
      doc.text(`Designation: ${designation} | Official Member ID: ${memberId}`, 50, 160);
      doc.text(`Email: ${email} | Mobile: ${phone} | Location: ${city}, ${state}`, 50, 174);

      // Subject
      doc.font('Helvetica-Bold').fontSize(10).fillColor('#0f172a');
      doc.text('SUBJECT: STATUTORY LETTER OF APPOINTMENT AS REGISTERED EXECUTIVE MEMBER', 40, 206, { underline: true });

      // Body Text
      let textY = 226;
      doc.font('Helvetica').fontSize(9).fillColor('#1e293b').lineGap(4);
      doc.text(`Dear ${name},`, 40, textY);

      textY += 18;
      const p1 = 'The Board of Trustees and the National Executive Committee of Indian Youth Foundation (भारतीय युवा क्रांति) are pleased to officially ratify and confirm your appointment as a Registered Member of the Foundation.';
      doc.text(p1, 40, textY, { width: 515, align: 'justify' });

      textY += 38;
      const p2 = `In recognition of your social contribution, public credentials, and voluntary commitment, you have been enrolled in the Official Trust Register under Member ID: ${memberId} with the designated role of "${designation}".`;
      doc.text(p2, 40, textY, { width: 515, align: 'justify' });

      textY += 34;
      doc.font('Helvetica-Bold').text('Member Privileges & Statutory Charter:', 40, textY);
      textY += 14;

      doc.font('Helvetica').fontSize(8.5);
      const points = [
        '1. Deliberative Standing: You are authorized to participate in official foundation assemblies, regional conventions, and social development consultations.',
        '2. Welfare Initiatives: You are empowered to plan, lead, and execute educational, environmental, and humanitarian programs in alignment with trust objectives.',
        '3. Public Representation: You hold official authority to represent the goals of Indian Youth Foundation before administrative and civic bodies within your jurisdiction.',
        '4. Code of Governance: You shall uphold high ethical standards, transparency, and fiduciary dedication to the trust constitution.'
      ];

      points.forEach(pt => {
        doc.text(pt, 50, textY, { width: 505, align: 'justify' });
        textY += 24;
      });

      textY += 6;
      doc.text(
        'We warmly congratulate you on your formal appointment and look forward to your valuable leadership in building an enlightened and self-reliant nation.',
        40, textY, { width: 515, align: 'justify' }
      );

      // Signatures, Seal & QR Code
      const signY = 660;
      doc.image(qrBuffer, 50, signY, { width: 70 });
      doc.font('Helvetica-Bold').fontSize(7).fillColor('#64748b');
      doc.text('Scan to Verify Online', 45, signY + 75, { width: 80, align: 'center' });

      const sealBuf = await resolveImageBuffer(dbSettings?.officialSealUrl);
      if (sealBuf) {
        doc.image(sealBuf, 260, signY + 10, { width: 60, height: 60 });
      } else {
        drawVectorSeal(doc, 290, signY + 35, 34, '#b91c1c');
      }

      const sigBuf = await resolveImageBuffer(dbSettings?.presidentSignatureUrl);
      if (sigBuf) {
        doc.image(sigBuf, 410, signY + 16, { width: 95, height: 28 });
      }

      doc.font('Helvetica-Bold').fontSize(9).fillColor('#0f172a');
      doc.text('For INDIAN YOUTH FOUNDATION', 370, signY + 5, { width: 175, align: 'center' });
      doc.font('Helvetica-Oblique').fontSize(8).fillColor('#b91c1c');
      doc.text('[Digitally Sealed & Ratified]', 370, signY + 30, { width: 175, align: 'center' });
      doc.font('Helvetica-Bold').fontSize(8.5).fillColor('#0f172a');
      doc.text(approvedBy, 370, signY + 48, { width: 175, align: 'center' });
      doc.font('Helvetica').fontSize(7.5).fillColor('#64748b');
      doc.text('National Executive / Board of Trustees', 370, signY + 60, { width: 175, align: 'center' });

      doc.font('Helvetica').fontSize(7).fillColor('#94a3b8');
      doc.text('This is an authentic statutory appointment document issued under Trust Act Reg. No. 421/2019.', 40, 795, { align: 'center' });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * 4. GENERATE DUAL-SIDED ID CARD PDF (FOR VOLUNTEER OR MEMBER)
 */
async function generateIdCardPdf(user = {}, roleType = 'volunteer') {
  return new Promise(async (resolve, reject) => {
    try {
      // Single A4 document displaying both FRONT and BACK sides side by side
      const doc = new PDFDocument({ size: 'A4', margin: 40 });
      const buffers = [];
      doc.on('data', b => buffers.push(b));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      let dbSettings = null;
      try {
        dbSettings = await Setting.findOne();
      } catch (e) {}

      const isVolunteer = (roleType || user.role || '').toLowerCase().includes('volunteer');
      const themeColor = isVolunteer ? '#059669' : '#b91c1c';
      const cardTitle = isVolunteer ? 'VOLUNTEER IDENTITY CARD' : 'EXECUTIVE MEMBER IDENTITY CARD';
      const defaultDesignation = isVolunteer ? 'Active Youth Volunteer' : 'Active Social Worker';

      const id = sanitize(user.memberId || (isVolunteer ? 'BYK-VOL-2026-0501' : 'BYK-MEM-2026-0001'));
      const name = sanitize(user.name || 'Registered Social Worker');
      const designation = sanitize(user.designation || defaultDesignation);
      const bloodGroup = sanitize(user.bloodGroup || 'O+');
      const phone = sanitize(user.phone || 'N/A');
      const email = sanitize(user.email || 'N/A');
      const location = sanitize(`${user.district || 'Aligarh'}, ${user.state || 'UP'}`);

      // QR Code
      const verifyUrl = `https://bharatiyayuvakranti.org/verify/${isVolunteer ? 'volunteer' : 'member'}/${id}`;
      const qrBuffer = await QRCode.toBuffer(verifyUrl, { width: 95, margin: 1 });

      // Title & Instruction at top
      doc.font('Helvetica-Bold').fontSize(16).fillColor(themeColor);
      doc.text('INDIAN YOUTH FOUNDATION', 40, 45, { align: 'center' });
      doc.font('Helvetica-Bold').fontSize(10).fillColor('#0f172a');
      doc.text(`OFFICIAL DUAL-SIDED DIGITAL IDENTITY BADGE (${id})`, 40, 68, { align: 'center' });
      doc.font('Helvetica').fontSize(8).fillColor('#64748b');
      doc.text('Statutory Anti-Tamper Identification Document • NITI Aayog Verified Non-Profit Trust', 40, 82, { align: 'center' });

      // CARD DIMENSIONS (Standard Badge Size: 240 x 380 points)
      const cardW = 240;
      const cardH = 380;
      const topY = 115;

      // ================= CARD FRONT (LEFT) =================
      const frontX = 45;
      doc.rect(frontX, topY, cardW, cardH).lineWidth(1.5).strokeColor(themeColor).stroke();
      // Front Header Banner
      doc.rect(frontX + 1, topY + 1, cardW - 2, 72).fillColor(themeColor).fill();
      doc.font('Helvetica-Bold').fontSize(11).fillColor('#ffffff');
      doc.text('INDIAN YOUTH FOUNDATION', frontX, topY + 12, { width: cardW, align: 'center' });
      doc.font('Helvetica-Bold').fontSize(8.5).fillColor('#fde047');
      doc.text(cardTitle, frontX, topY + 28, { width: cardW, align: 'center' });
      doc.font('Helvetica').fontSize(6.5).fillColor('#ffffff');
      doc.text('Reg. No: 421/2019 • 12A & 80G Certified Trust', frontX, topY + 44, { width: cardW, align: 'center' });
      doc.text('Head Office: Krishna Vihar, Pala Road, Aligarh', frontX, topY + 54, { width: cardW, align: 'center' });

      // Photo / Avatar Box
      const photoBoxY = topY + 90;
      doc.rect(frontX + (cardW / 2) - 35, photoBoxY, 70, 70).lineWidth(1.5).strokeColor(themeColor).stroke();
      doc.font('Helvetica-Bold').fontSize(26).fillColor(themeColor);
      doc.text(name.charAt(0).toUpperCase(), frontX + (cardW / 2) - 35, photoBoxY + 20, { width: 70, align: 'center' });

      // Verified Badge under photo
      doc.rect(frontX + (cardW / 2) - 30, photoBoxY + 74, 60, 14).fillColor('#059669').fill();
      doc.font('Helvetica-Bold').fontSize(6.5).fillColor('#ffffff');
      doc.text('✓ VERIFIED', frontX + (cardW / 2) - 30, photoBoxY + 77, { width: 60, align: 'center' });

      // Name & Designation
      doc.font('Helvetica-Bold').fontSize(11.5).fillColor('#0f172a');
      doc.text(name, frontX + 10, photoBoxY + 100, { width: cardW - 20, align: 'center' });

      doc.font('Helvetica-Bold').fontSize(8.5).fillColor(themeColor);
      doc.text(designation, frontX + 10, photoBoxY + 117, { width: cardW - 20, align: 'center' });

      // ID Box
      doc.rect(frontX + 25, photoBoxY + 135, cardW - 50, 22).fillColor('#0f172a').fill();
      doc.font('Helvetica-Bold').fontSize(8.5).fillColor('#ffffff');
      doc.text(`ID: ${id}`, frontX + 25, photoBoxY + 141, { width: cardW - 50, align: 'center' });

      // Front Footer Details
      doc.moveTo(frontX + 15, topY + 330).lineTo(frontX + cardW - 15, topY + 330).lineWidth(0.8).strokeColor('#cbd5e1').stroke();
      doc.font('Helvetica-Bold').fontSize(7.5).fillColor('#475569');
      doc.text('Blood Group: ', frontX + 15, topY + 340);
      doc.font('Helvetica-Bold').fillColor(themeColor).text(bloodGroup, frontX + 68, topY + 340);

      doc.font('Helvetica-Bold').fillColor('#475569').text('Valid Upto: ', frontX + 140, topY + 340);
      doc.font('Helvetica-Bold').fillColor('#0f172a').text('Dec 2028', frontX + 185, topY + 340);

      // ================= CARD BACK (RIGHT) =================
      const backX = 310;
      doc.rect(backX, topY, cardW, cardH).lineWidth(1.5).strokeColor(themeColor).stroke();

      // Back Top Header
      doc.rect(backX + 1, topY + 1, cardW - 2, 26).fillColor('#f8fafc').strokeColor('#e2e8f0').lineWidth(1).fillAndStroke();
      doc.font('Helvetica-Bold').fontSize(8).fillColor(themeColor);
      doc.text('OFFICIAL VERIFICATION PORTAL', backX, topY + 9, { width: cardW, align: 'center' });

      // QR Code
      doc.image(qrBuffer, backX + (cardW / 2) - 40, topY + 38, { width: 80 });
      doc.font('Helvetica-Bold').fontSize(6.5).fillColor('#475569');
      doc.text('Scan with camera to verify credentials', backX, topY + 122, { width: cardW, align: 'center' });

      // Detail Rows
      let backRowY = topY + 142;
      const bRows = [
        ['Mobile:', phone],
        ['Email:', email],
        ['Location:', location],
        ['Authority:', 'Board of Trustees']
      ];

      bRows.forEach(([lbl, val]) => {
        doc.font('Helvetica-Bold').fontSize(7.5).fillColor('#1e293b');
        doc.text(lbl, backX + 20, backRowY);
        doc.font('Helvetica').fontSize(7.5).fillColor('#0f172a');
        doc.text(val, backX + 75, backRowY, { width: cardW - 90 });
        backRowY += 16;
      });

      // Seal & Signature
      const sealBuf = await resolveImageBuffer(dbSettings?.officialSealUrl);
      if (sealBuf) {
        doc.image(sealBuf, backX + 32, topY + 248, { width: 44, height: 44 });
      } else {
        drawVectorSeal(doc, backX + 55, topY + 265, 26, themeColor);
      }

      const sigBuf = await resolveImageBuffer(dbSettings?.presidentSignatureUrl);
      if (sigBuf) {
        doc.image(sigBuf, backX + 115, topY + 250, { width: 85, height: 24 });
      }

      const presidentName = sanitize(dbSettings?.presidentName || 'National President');
      doc.font('Helvetica-Bold').fontSize(6.5).fillColor('#0f172a');
      doc.text('Authorized Signatory', backX + 115, topY + 238);
      doc.font('Helvetica-Bold').fontSize(6.5).fillColor('#0f172a');
      doc.text(presidentName, backX + 115, topY + 282, { width: cardW - 125 });

      // Warning Note at bottom of back
      doc.rect(backX + 10, topY + 308, cardW - 20, 60).fillColor('#f8fafc').strokeColor('#cbd5e1').lineWidth(0.8).fillAndStroke();
      doc.font('Helvetica').fontSize(6).fillColor('#64748b');
      doc.text(
        'PROPERTY NOTICE:\n' +
        'This identity badge is the exclusive property of Indian Youth Foundation. Any unauthorized duplication, alteration, or misuse is strictly prohibited under IT Act 2000.\n' +
        'If found, kindly return to: National Head Office, Krishna Vihar, Pala Road, Aligarh, UP - 202001.',
        backX + 14, topY + 314, { width: cardW - 28, lineGap: 1 }
      );

      // Bottom Instructions
      doc.font('Helvetica').fontSize(8).fillColor('#94a3b8');
      doc.text('Cut along the borders or print on standard PVC identity badge printer.', 40, topY + cardH + 25, { align: 'center' });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

async function generateVolunteerIdCardPdf(user = {}) {
  return generateIdCardPdf(user, 'volunteer');
}

async function generateMemberIdCardPdf(user = {}) {
  return generateIdCardPdf(user, 'member');
}

/**
 * 5. GENERATE CERTIFICATE OF APPRECIATION PDF
 */
async function generateCertificatePdf(cert = {}) {
  return new Promise(async (resolve, reject) => {
    try {
      // Landscape A4 (841.89 x 595.28 points)
      const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 30 });
      const buffers = [];
      doc.on('data', b => buffers.push(b));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      let dbSettings = null;
      try {
        dbSettings = await Setting.findOne();
      } catch (e) {}

      const certId = sanitize(cert.certificateId || cert.certificateNo || 'BYK-CERT-2026-0001');
      const recipientName = sanitize(cert.recipientName || 'Distinguished Contributor');
      const title = sanitize(cert.title || 'Certificate of Appreciation & National Service');
      const reason = sanitize(cert.reason || 'In recognition of outstanding dedication, exemplary leadership, and selfless service towards societal welfare and youth empowerment.');
      const role = sanitize(cert.roleOrDesignation || 'Active Social Contributor');
      const issueDate = formatDate(cert.issueDate || cert.createdAt);
      const issuedBy = sanitize(cert.issuedBy || dbSettings?.presidentName || 'Ravi Saini (National President & Trustee)');

      // QR Code
      const qrData = `https://bharatiyayuvakranti.org/verify/certificate/${certId}`;
      const qrBuffer = await QRCode.toBuffer(qrData, { width: 90, margin: 1 });

      const w = 841.89;
      const h = 595.28;

      // Outer Golden & Crimson Luxury Quadruple Borders
      doc.rect(18, 18, w - 36, h - 36).lineWidth(5).strokeColor('#7f1d1d').stroke();
      doc.rect(23, 23, w - 46, h - 46).lineWidth(1.2).strokeColor('#d97706').stroke();
      doc.rect(26, 26, w - 52, h - 52).lineWidth(2).strokeColor('#b45309').stroke();
      doc.rect(30, 30, w - 60, h - 60).lineWidth(0.6).dash(4, { space: 2 }).strokeColor('#cbd5e1').stroke();
      doc.undash();

      // Corner Medallions
      const corners = [
        [32, 32],
        [w - 56, 32],
        [32, h - 56],
        [w - 56, h - 56]
      ];
      corners.forEach(([cx, cy]) => {
        doc.rect(cx, cy, 24, 24).fillColor('#fef3c7').strokeColor('#b45309').lineWidth(1.2).fillAndStroke();
        doc.font('Helvetica-Bold').fontSize(10).fillColor('#b45309');
        doc.text('✦', cx, cy + 5, { width: 24, align: 'center' });
      });

      // Trust Shield in Upper Corner
      drawVectorShield(doc, w - 100, 38, 44, 52, '#b45309');

      // Top Logo (if uploaded or URL)
      const logoBuf = await resolveImageBuffer(dbSettings?.logoUrl);
      if (logoBuf) {
        doc.image(logoBuf, 56, 38, { width: 50, height: 50 });
      }

      // Organization Header
      doc.font('Helvetica-Bold').fontSize(22).fillColor('#7f1d1d');
      doc.text('INDIAN YOUTH FOUNDATION', 110, 44, { align: 'center', width: w - 220 });
      doc.font('Helvetica-Bold').fontSize(11).fillColor('#0f172a');
      doc.text('BHARATIYA YUVA KRANTI • NATIONAL HONOURS & MERIT COUNCIL', 110, 70, { align: 'center', width: w - 220 });
      doc.font('Helvetica').fontSize(8).fillColor('#475569');
      doc.text('A Registered Public Charitable Trust • Reg. No: 421/2019 • Section 12A & 80G Compliant NGO', 110, 84, { align: 'center', width: w - 220 });

      // Certificate Title Ribbon
      doc.rect(160, 104, w - 320, 36).fillColor('#7f1d1d').fill();
      doc.rect(162, 106, w - 324, 32).lineWidth(1).strokeColor('#fde047').stroke();
      doc.font('Helvetica-Bold').fontSize(15).fillColor('#ffffff');
      doc.text('CERTIFICATE OF APPRECIATION & CITATION', 160, 114, { align: 'center', width: w - 320 });

      // Certificate ID
      doc.font('Helvetica-Bold').fontSize(8.5).fillColor('#b45309');
      doc.text(`Official Conformance No: ${certId}`, 50, 148, { align: 'center', width: w - 100 });

      // Presentation Line
      doc.font('Helvetica-Oblique').fontSize(11).fillColor('#475569');
      doc.text('This certificate of honor is proudly and gratefully conferred upon', 50, 172, { align: 'center', width: w - 100 });

      // Recipient Name
      doc.font('Helvetica-Bold').fontSize(26).fillColor('#0f172a');
      doc.text(recipientName, 50, 196, { align: 'center', width: w - 100 });

      // Underline
      const nameWidth = doc.widthOfString(recipientName);
      const nameStartX = (w - nameWidth) / 2;
      doc.moveTo(nameStartX - 25, 228).lineTo(nameStartX + nameWidth + 25, 228).lineWidth(1.8).strokeColor('#d97706').stroke();

      // Designation
      doc.font('Helvetica-Bold').fontSize(11).fillColor('#059669');
      doc.text(`[ ${role} ]`, 50, 238, { align: 'center', width: w - 100 });

      // Award Title & Reason Citation
      doc.font('Helvetica-Bold').fontSize(12).fillColor('#7f1d1d');
      doc.text(`"${title}"`, 100, 260, { align: 'center', width: w - 200 });

      doc.font('Helvetica').fontSize(10).fillColor('#334155').lineGap(3);
      doc.text(reason, 110, 286, { align: 'center', width: w - 220 });

      // Authentication Bar (Date, Seal, Sign, QR)
      const bottomY = 410;

      // Left: QR Code
      doc.image(qrBuffer, 80, bottomY, { width: 75 });
      doc.font('Helvetica-Bold').fontSize(7).fillColor('#64748b');
      doc.text('Scan to Verify Online', 75, bottomY + 78, { width: 85, align: 'center' });

      // Date of Issue
      doc.font('Helvetica-Bold').fontSize(8.5).fillColor('#0f172a');
      doc.text(`Date of Conformance:`, 200, bottomY + 28);
      doc.font('Helvetica').fontSize(9).fillColor('#334155');
      doc.text(issueDate, 200, bottomY + 42);

      // Center: Trust Seal (uploaded or vector)
      const sealBuf = await resolveImageBuffer(dbSettings?.officialSealUrl);
      if (sealBuf) {
        doc.image(sealBuf, (w / 2) - 34, bottomY + 8, { width: 68, height: 68 });
      } else {
        drawVectorSeal(doc, w / 2, bottomY + 40, 42, '#7f1d1d');
      }

      // Right: Signatures
      const sigBuf = await resolveImageBuffer(dbSettings?.presidentSignatureUrl);
      if (sigBuf) {
        doc.image(sigBuf, w - 240, bottomY + 18, { width: 100, height: 32 });
      }

      doc.font('Helvetica-Bold').fontSize(9.5).fillColor('#0f172a');
      doc.text('For INDIAN YOUTH FOUNDATION', w - 300, bottomY + 8, { width: 220, align: 'center' });
      doc.font('Helvetica-Bold').fontSize(9).fillColor('#0f172a');
      doc.text(issuedBy, w - 300, bottomY + 54, { width: 220, align: 'center' });
      doc.font('Helvetica').fontSize(7.5).fillColor('#64748b');
      doc.text('National President & Board of Trustees', w - 300, bottomY + 67, { width: 220, align: 'center' });

      // Bottom Security Note
      doc.font('Helvetica').fontSize(6.8).fillColor('#94a3b8');
      doc.text('This is an authentic verified digital award certificate issued by the National Executive Council of Indian Youth Foundation.', 50, h - 36, { align: 'center', width: w - 100 });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = {
  numberToWords,
  formatDate,
  generateDonationReceiptPdf,
  generateVolunteerOfferLetterPdf,
  generateVolunteerIdCardPdf,
  generateAppointmentLetterPdf,
  generateMemberIdCardPdf,
  generateCertificatePdf
};
