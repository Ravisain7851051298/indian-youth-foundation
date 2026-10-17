const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  key: { type: String, default: 'global_ngo_settings', unique: true },
  ngoName: { type: String, default: 'Indian Youth Foundation' },
  ngoNameHi: { type: String, default: 'भारतीय युवा क्रांति' },
  tagline: { type: String, default: 'Empowering Youth, Transforming Society, Nation First' },
  taglineHi: { type: String, default: 'Dedicated to Youth Empowerment & Nation Building' },
  logoUrl: { type: String, default: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=120&auto=format&fit=crop&q=80' },
  officialSealUrl: { type: String, default: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=200&auto=format&fit=crop&q=80' },
  presidentSignatureUrl: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80' },
  registrationNo: { type: String, default: '421/2019' },
  panNo: { type: String, default: 'AAATB4321Q' },
  nitiAayogDarpanId: { type: String, default: 'RJ/2022/0319482' },
  csr1No: { type: String, default: 'CSR00049281' },
  exemption12A: { type: String, default: 'CIT(EXEMP)/12A/2021-22/A-492' },
  exemption80G: { type: String, default: 'CIT(EXEMP)/80G/2021-22/G-881' },
  email: { type: String, default: 'samasyasamadhanparishad@gmail.com' },
  phone: { type: String, default: '+91 93196 98759' },
  whatsapp: { type: String, default: '+919319698759' },
  facebook: { type: String, default: 'https://facebook.com' },
  twitter: { type: String, default: 'https://x.com' },
  instagram: { type: String, default: 'https://instagram.com' },
  youtube: { type: String, default: 'https://youtube.com' },
  linkedin: { type: String, default: 'https://linkedin.com' },
  telegram: { type: String, default: '' },
  address: { type: String, default: 'Head Office - Krishna Vihar Pala Road Aligarh, Uttar Pradesh' },
  googleMapEmbed: { 
    type: String, 
    default: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d113000!2d78.07!3d27.89!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3974a496c4d7e7a5%3A0x6b10b7849e79d7e0!2sAligarh%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000' 
  },
  bankDetails: {
    accountName: { type: String, default: 'INDIAN YOUTH FOUNDATION SANSTHA' },
    accountNumber: { type: String, default: '50200088991234' },
    ifscCode: { type: String, default: 'HDFC0001234' },
    bankName: { type: String, default: 'HDFC Bank Ltd.' },
    branch: { type: String, default: 'Aligarh Main Branch, UP' }
  },
  upiId: { type: String, default: 'bharatiyauva@okhdfcbank' },
  upiQrImage: { type: String, default: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=bharatiyauva@okhdfcbank%26pn=Indian%20Youth%20Foundation%26cu=INR' },
  membershipFee: { type: Number, default: 250 },
  aboutHeading: { type: String, default: 'About Indian Youth Foundation (Bharatiya Yuva Kranti)' },
  aboutSubtitle: { type: String, default: 'A Government-Recognized Youth Social Welfare Movement Dedicated to Nation Building' },
  aboutStory: { type: String, default: 'Founded by visionary youth leaders, Indian Youth Foundation is committed to grassroots nation-building. Operating across multiple states, our volunteers organize child education initiatives, 24x7 emergency blood donor networks, rural women livelihood training, and rapid disaster relief assistance.' },
  missionStatement: { type: String, default: 'To channel the energy and passion of Indian youth into measurable grassroots social welfare initiatives, ensuring quality education for every underprivileged child, immediate healthcare access, women empowerment, and disaster relief.' },
  visionStatement: { type: String, default: 'To foster an empowered, educated, and self-reliant nation where proactive youth leadership eliminates socioeconomic disparities and creates lasting community prosperity.' },
  
  // CMS Pages: Who We Are
  whoWeAreHeading: { type: String, default: 'Who We Are — The Pulse of Indian Youth Foundation' },
  whoWeAreSubtitle: { type: String, default: 'A Catalyst for Grassroots Youth Empowerment, Civil Welfare & Nation Building' },
  whoWeAreStory: { 
    type: String, 
    default: 'Founded by passionate young patriots and grassroots social activists, Indian Youth Foundation (भारतीय युवा क्रांति) was born from a deep conviction: that India\'s greatest reservoir of untapped power is its youth. Guided by the ethos of "Nation First, Society Always", we bridge the chasm between compassionate intent and concrete ground action.\n\nFrom running evening community literacy circles for slum children and maintaining an agile 24x7 emergency blood donor network across districts, to providing women self-reliance tailoring skills and mounting rapid relief during natural disasters, our youth task force stands on the frontlines of humanitarian transformation.\n\nWe operate with unwavering corporate governance, complete CBDT statutory transparency, zero administrative overhead leakage, and an uncompromising dedication to human dignity.' 
  },
  whoWeAreVision: { 
    type: String, 
    default: 'To foster an empowered, educated, and self-reliant India where proactive youth leadership eliminates socioeconomic disparities, champions community brotherhood, and builds a prosperous nation.' 
  },
  whoWeAreMission: { 
    type: String, 
    default: 'To channel the vibrant energy, intellect, and civic dedication of Indian youth into measurable grassroots social welfare initiatives, ensuring quality education for every underprivileged child, immediate healthcare access, women economic self-reliance, and disaster relief.' 
  },
  whoWeAreValues: { 
    type: String, 
    default: 'Nation First: Every action is dedicated to national strength and social harmony.\nIntegrity & Transparency: 100% statutory adherence, audited accounts, and public receipts.\nYouth Leadership: Placing young changemakers in driving seats of community solutions.\nEmpathy in Action: Rapid, unconditional grassroots aid for every vulnerable citizen.' 
  },
  whoWeAreBannerUrl: { 
    type: String, 
    default: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&auto=format&fit=crop&q=80' 
  },

  // CMS Pages: Privacy Policy
  privacyPolicyTitle: { type: String, default: 'Privacy Policy & Data Security' },
  privacyPolicySubtitle: { type: String, default: 'Indian Youth Foundation (Bharatiya Yuva Kranti) is dedicated to maintaining full transparency, safeguarding donor privacy, and protecting personal data.' },
  privacyLastUpdated: { type: String, default: 'October 2026' },
  privacyPolicyContent: { 
    type: String, 
    default: '## 1. Information We Collect\nWhen you interact with Indian Youth Foundation through donations, membership registrations, volunteer drives, or contact inquiries, we collect information necessary to fulfill our statutory non-profit functions:\n- Personal Identity: Full name, date of birth, gender, blood group, and residential address.\n- Contact Information: Verified mobile phone number, WhatsApp contact, and email address.\n- Statutory Tax Data (for 80G Receipts): Permanent Account Number (PAN Card No.) and postal address, mandatory under the Income Tax Act, 1961 (Form 10BD reporting).\n- Payment Transaction Data: Unique transaction ID, payment method (UPI, Netbanking, Debit/Credit Card), timestamp, and donation amount. We do NOT store credit card numbers, CVVs, or net banking passwords on our servers.\n\n## 2. How We Use Your Information\nAll personal and financial details collected by the Foundation are used strictly for legitimate charitable administration:\n- Generating and delivering instant, digitally signed Section 80G tax exemption donation receipts.\n- Issuing verified digital membership ID cards, appointment letters, and appreciation certificates.\n- Reporting donor contribution records to the Income Tax Department via Form 10BD for donor tax deductions.\n- Communicating program updates, emergency blood donation appeals, and humanitarian relief bulletins.\n- Investigating grievances, feedback, and community service inquiries submitted to the administration.\n\n## 3. Payment Gateway Security & Encryption\nOnline payments on this portal are processed via Reserve Bank of India (RBI) authorized payment gateways (including Razorpay & UPI rails) utilizing industry-grade 256-bit SSL encryption. Indian Youth Foundation adheres to PCI-DSS compliance standards ensuring seamless, tamper-proof electronic transactions.\n\n## 4. Non-Disclosure & Data Confidentiality\nWe enforce a strict non-disclosure policy. Indian Youth Foundation does never rent, sell, trade, or commercially share our donor or member records with any third-party marketing agency. Information is disclosed solely when mandated by Indian law or competent regulatory bodies (e.g., Income Tax Department, NITI Aayog).\n\n## 5. Your Rights & Grievance Redressal\nDonors and registered members maintain the right to review their records, request correction of inaccurate details, or download their cumulative donation statements. For questions or grievance escalation, reach out directly to our official grievance contacts.' 
  },

  // CMS Pages: Terms & Conditions
  termsTitle: { type: String, default: 'Terms & Conditions of Service' },
  termsSubtitle: { type: String, default: 'Rules, guidelines, and legal agreements governing the use of the Indian Youth Foundation website, online donations, and member services.' },
  termsEffectiveDate: { type: String, default: 'October 2026' },
  termsContent: { 
    type: String, 
    default: '## 1. Acceptance of Terms\nBy accessing, browsing, registering as a member, or donating on this website, you agree to be legally bound by these Terms and Conditions and our Privacy Policy. If you do not accept these terms, you should discontinue using this portal.\n\n## 2. Online Donations & 80G Tax Receipts\n- All donations contributed through this portal are applied directly towards humanitarian relief, child education, healthcare assistance, and community welfare programs.\n- Donations are eligible for 50% income tax deduction under Section 80G of the Indian Income Tax Act, 1961.\n- To receive a valid Section 80G tax certificate, donors must provide their valid Indian Permanent Account Number (PAN) and postal address during payment.\n- Official digitally verified donation receipts bearing unique receipt numbers and QR codes are issued immediately upon successful transaction completion.\n\n## 3. Non-Refundable Donation Policy\nAs donations are voluntary charitable contributions committed promptly towards ongoing social causes and emergency supplies, they are generally non-refundable. However, in verified instances of technical error (such as erroneous double deductions through the payment gateway), a written refund request can be filed within 7 calendar days accompanied by transaction proof.\n\n## 4. Code of Conduct for Members & Volunteers\n- Every registered Member and Volunteer must conduct themselves in alignment with the national ideals and peaceful constitution of the Foundation.\n- Official Member ID Cards, Appointment Letters, and certificates issued by the Foundation remain the intellectual property of Indian Youth Foundation.\n- Members are strictly prohibited from using foundation identification, seals, or letterheads for personal commercial exploitation, unauthorized political lobbying, or illegal activities. Any misuse results in immediate termination of membership and criminal prosecution.\n\n## 5. Protection of Official Logo, Seals & Signatures\nAll trademarks, logos, official stamps/seals, digital signatures of executive trustees, website graphics, and software workflows displayed across this portal are exclusively owned by Indian Youth Foundation. Unauthorized reproduction, modification, or counterfeit duplication is actionable under Indian Copyright and Intellectual Property laws.\n\n## 6. Governing Law & Legal Jurisdiction\nThese Terms and Conditions are governed by and construed in accordance with the laws of the Republic of India. In the event of any dispute or arbitration, the courts having jurisdiction in Aligarh, Uttar Pradesh shall have exclusive jurisdiction.' 
  },

  // SMTP Email Settings for Admin
  smtpHost: { type: String, default: 'smtp.gmail.com' },
  smtpPort: { type: Number, default: 587 },
  smtpUser: { type: String, default: 'samasyasamadhanparishad@gmail.com' },
  smtpPass: { type: String, default: '' },
  smtpFromName: { type: String, default: 'Indian Youth Foundation' },

  // Signatory & President Details
  presidentName: { type: String, default: 'Ravi Saini (National President & Trustee)' },

  // Admin Master Secret Key
  adminSecretKey: { type: String, default: 'iyf_admin_master_secret_2026' },

  // Admin-managed Hero Carousel Slides
  heroSlides: [
    {
      title: { type: String, default: '' },
      subtitle: { type: String, default: '' },
      imageUrl: { type: String, default: '' },
      tag: { type: String, default: '' },
      ctaPrimaryText: { type: String, default: '' },
      ctaPrimaryLink: { type: String, default: '' },
      ctaSecondaryText: { type: String, default: '' },
      ctaSecondaryLink: { type: String, default: '' },
      highlight: { type: String, default: '' }
    }
  ],

  // Homepage Ticker / Marquee
  newsTickerText: { 
    type: String, 
    default: 'समस्या समाधान परिषद (SSP) में आपका स्वागत है • निःशुल्क सदस्यता एवं समाज सेवा अभियान • हेल्पलाइन: +919319698759' 
  },

  // Homepage About Us text sections
  homeAboutTitle: { type: String, default: 'About Us' },
  homeAboutStory: { 
    type: String, 
    default: 'Samasya Samadhan Parishadh (SSP) is a passionate advocate for positive change, dedicated to making a tangible difference in the world. Since our inception [Year], we have been driven by a singular mission: to empower individuals and communities to thrive through sustainable development initiatives, education, healthcare access, and environmental stewardship.' 
  },
  homeOurValues: { 
    type: String, 
    default: 'At Samasya Samadhan Parishadh (SSP), our core values of compassion, integrity, and inclusivity guide everything we do. We believe in the power of collaboration and collective action to address pressing global challenges and create lasting impact.' 
  },
  homeOurImpact: { 
    type: String, 
    default: 'Through strategic partnerships, grassroots initiatives, and the dedication of our team, we have achieved significant milestones in [mention specific areas of impact]. Our work has touched the lives of [number] individuals and continues to inspire positive change worldwide.' 
  },
  homeJoinUs: { 
    type: String, 
    default: 'Join us in our mission to create a brighter, more equitable world for all. Together, we can make a difference.' 
  },

  // President Message
  presidentMessageTitle: { type: String, default: 'President Message' },
  presidentPhotoUrl: { type: String, default: '' },
  presidentMessageContent: {
    type: String,
    default: `Dear Friends,

It is with great pride and humility that I address you as the President of Samasya Samadhan Parishadh (SSP). Since our founding 2022, our organization has been driven by a simple yet profound belief: that every individual, regardless of circumstance, deserves the opportunity to thrive.

At Samasya Samadhan Parishadh (SSP), we are not just dreamers; we are doers. We roll up our sleeves and work tirelessly to turn our vision of a better world into reality. From providing access to education and healthcare to championing environmental sustainability and social justice, our efforts are guided by a deep commitment to making a meaningful difference in the lives of others.

But we cannot do it alone. Our success is built on the support of passionate individuals like you—individuals who share our values and our vision for a brighter future. Together, we can amplify our impact and create lasting change that reverberates far beyond our borders.

As we look to the future, I am filled with hope and optimism. The challenges we face are great, but so too is our resolve to overcome them. With your continued support, I am confident that we can build a world where every person has the opportunity to flourish and thrive.

Thank you for your unwavering commitment to our cause. Together, we are truly making a difference.

Warm regards,

Samasya Samadhan Parishadh (SSP)`
  },

  // YouTube Videos List
  youtubeVideos: [
    {
      title: { type: String, default: '' },
      url: { type: String, default: '' }
    }
  ],

  // Objectives List
  objectives: [
    {
      title: { type: String, default: '' },
      imageUrl: { type: String, default: '' },
      link: { type: String, default: '' }
    }
  ],

  pageViews: { type: Number, default: 18450 }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.smtpHost;
      delete ret.smtpPort;
      delete ret.smtpUser;
      delete ret.smtpPass;
      delete ret.adminSecretKey;
      return ret;
    }
  },
  toObject: {
    transform: function(doc, ret) {
      delete ret.smtpHost;
      delete ret.smtpPort;
      delete ret.smtpUser;
      delete ret.smtpPass;
      delete ret.adminSecretKey;
      return ret;
    }
  }
});

module.exports = mongoose.model('Setting', settingSchema);
