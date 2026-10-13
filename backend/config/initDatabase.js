const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Setting = require('../models/Setting');
const MembershipPlan = require('../models/MembershipPlan');

const initDatabase = async () => {
  try {
    // 1. Ensure Super Admin Account exists in MongoDB
    const adminEmail = process.env.SMTP_USER || 'samasyasamadhanparishad@gmail.com';
    const existingAdmin = await User.findOne({
      $or: [
        { email: adminEmail },
        { email: 'admin@bharatiyayuvakranti.org' },
        { role: 'Admin' }
      ]
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        name: 'National Trustee & Admin',
        email: adminEmail,
        phone: '9319698759',
        password: hashedPassword,
        role: 'Admin',
        status: 'active',
        memberId: 'BYK-TRUSTEE-001',
        designation: 'National President & Trustee',
        bloodGroup: 'O+',
        dob: '1985-01-01',
        address: 'Head Office - Krishna Vihar Pala Road Aligarh, Uttar Pradesh',
        district: 'Aligarh',
        state: 'Uttar Pradesh',
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
        referralCode: 'BYK-PRESIDENT',
        feePaid: true,
        feeAmount: 0,
        idCardGenerated: true,
        appointmentLetterGenerated: true,
        verifiedAt: new Date()
      });
      console.log('✅ Real Super Admin account initialized in MongoDB.');
    }

    // 2. Ensure Official Trust Settings exist in MongoDB
    let setting = await Setting.findOne();
    if (!setting) {
      await Setting.create({
        ngoName: process.env.NGO_NAME || 'Indian Youth Foundation',
        tagline: 'सशक्त युवा, समर्थ भारत',
        registrationNumber: 'IV-4521/2020',
        section80GNumber: 'CIT(E)/DELHI/80G/2021-22/A/10452',
        section12ANumber: 'CIT(E)/DELHI/12A/2020-21/A/9874',
        panNumber: 'AAATB1234F',
        tanNumber: 'DELT09876E',
        email: 'samasyasamadhanparishad@gmail.com',
        phone: '+91 93196 98759',
        address: 'Head Office - Krishna Vihar Pala Road Aligarh, Uttar Pradesh - 202001',
        bankName: 'HDFC Bank Ltd.',
        accountNumber: '50200084729104',
        ifscCode: 'HDFC0001824',
        branch: 'Aligarh Main Branch',
        upiId: 'bharatiyauva@okhdfcbank',
        smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
        smtpPort: parseInt(process.env.SMTP_PORT || '587', 10),
        smtpUser: process.env.SMTP_USER || 'samasyasamadhanparishad@gmail.com',
        smtpPass: process.env.SMTP_PASS || '',
        adminSecretKey: process.env.X_ADMIN_SECRET_KEY || 'BYK_SUPER_ADMIN_ALIGARH_SECRET_2026'
      });
      console.log('✅ Official Trust Settings initialized in MongoDB.');
    }

    // 3. Ensure Dynamic Membership Plans exist in MongoDB
    const planCount = await MembershipPlan.countDocuments();
    if (planCount === 0) {
      await MembershipPlan.insertMany([
        {
          title: 'Yuva Samarthak (Basic)',
          titleHi: 'युवा समर्थक (साधारण सदस्यता)',
          price: 250,
          validityMonths: 12,
          benefits: [
            'Digital Identity Card with Verification QR',
            'Formal Letter of Appointment',
            'Direct access to Trust youth initiatives & events'
          ],
          benefitsHi: [
            'सत्यापन क्यूआर कोड युक्त डिजिटल पहचान पत्र',
            'आधिकारिक नियुक्ति पत्र',
            'संस्था के सामाजिक अभियानों में सीधी भागीदारी'
          ],
          isPopular: false
        },
        {
          title: 'Krantikari Sadasya (Annual)',
          titleHi: 'क्रांतिकारी सदस्य (वार्षिक सक्रिय)',
          price: 500,
          validityMonths: 12,
          benefits: [
            'Executive Dual-Sided ID Card (Print Ready)',
            'Official Sealed Appointment Letter with Reference No.',
            'Voting & Coordinator rights for district events',
            '80G Tax Exemption on membership contribution'
          ],
          benefitsHi: [
            'कार्यकारी दोतरफा पहचान पत्र (प्रिंट योग्य)',
            'संस्था मुहर एवं हस्ताक्षर युक्त नियुक्ति पत्र',
            'जिला स्तरीय आयोजनों में समन्वय का अधिकार',
            'योगदान पर धारा 80G टैक्स छूट'
          ],
          isPopular: true
        },
        {
          title: 'Sanrakshak Sadasya (Patron / Lifetime)',
          titleHi: 'संरक्षक सदस्य (आजीवन सम्मान)',
          price: 2100,
          validityMonths: 60,
          benefits: [
            'Gold Patron Lifetime Membership Credential',
            'Certificate of Honor & National Social Service',
            'Advisory Board invitation at Annual General Meeting',
            'Direct access to Central Leadership & Trustees'
          ],
          benefitsHi: [
            'स्वर्ण संरक्षक आजीवन सदस्यता पहचान पत्र',
            'राष्ट्रीय सेवा सम्मान पत्र',
            'वार्षिक सम्मेलन में सलाहकार समिति आमंत्रण',
            'संस्था के शीर्ष नेतृत्व से सीधा संवाद'
          ],
          isPopular: false
        }
      ]);
      console.log('✅ Dynamic Membership Plans initialized in MongoDB.');
    }
  } catch (error) {
    console.error('⚠️ Database init error:', error.message);
  }
};

module.exports = { initDatabase };
