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
  
  // SMTP Email Settings for Admin
  smtpHost: { type: String, default: 'smtp.gmail.com' },
  smtpPort: { type: Number, default: 587 },
  smtpUser: { type: String, default: 'samasyasamadhanparishad@gmail.com' },
  smtpPass: { type: String, default: '' },

  // Admin Master Secret Key
  adminSecretKey: { type: String, default: 'iyf_admin_master_secret_2026' },

  pageViews: { type: Number, default: 18450 }
}, {
  timestamps: true
});

module.exports = mongoose.model('Setting', settingSchema);
