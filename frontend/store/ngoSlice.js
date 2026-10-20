import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const INITIAL_SETTINGS = {
  ngoName: 'Yuva Kranti Dal',
  ngoNameHi: 'युवा क्रांति दल',
  tagline: 'Empowering Youth, Transforming Society, Nation First',
  taglineHi: 'Dedicated to Youth Empowerment & Nation Building',
  logoUrl: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=120&auto=format&fit=crop&q=80',
  officialSealUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=200&auto=format&fit=crop&q=80',
  presidentSignatureUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  registrationNo: 'REG/2021/NGO/DEL/8741',
  panNo: 'AAATB4321Q',
  nitiAayogDarpanId: 'RJ/2022/0319482',
  csr1No: 'CSR00049281',
  exemption12A: 'CIT(EXEMP)/12A/2021-22/A-492',
  exemption80G: 'CIT(EXEMP)/80G/2021-22/G-881',
  email: 'ravisain75688@gmail.com',
  phone: '+91 93196 98759',
  whatsapp: '+919319698759',
  address: 'Head Office - Krishna Vihar Pala Road Aligarh, Uttar Pradesh',
  googleMapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d113000!2d78.07!3d27.89!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3974a496c4d7e7a5%3A0x6b10b7849e79d7e0!2sAligarh%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000',
  aboutHeading: 'About Yuva Kranti Dal',
  aboutSubtitle: 'A Government-Recognized Youth Social Welfare Movement Dedicated to Nation Building',
  aboutStory: 'Founded by visionary youth leaders, Yuva Kranti Dal is committed to grassroots nation-building. Operating across multiple states, our volunteers organize child education initiatives, 24x7 emergency blood donor networks, rural women livelihood training, and rapid disaster relief assistance.',
  aboutMissionSummary: 'To channel youth energy towards quality education for every child, free emergency healthcare, women self-reliance, and humanitarian disaster relief.',
  aboutVisionSummary: 'An India where every young citizen is an empowered, conscious leader actively contributing to an inclusive, equitable, and poverty-free society.',
  missionStatement: 'To channel the energy and passion of Indian youth into measurable grassroots social welfare initiatives, ensuring quality education for every underprivileged child, immediate healthcare access, women empowerment, and disaster relief.',
  visionStatement: 'To foster an empowered, educated, and self-reliant nation where proactive youth leadership eliminates socioeconomic disparities and creates lasting community prosperity.',
  bankDetails: {
    accountName: 'YUVA KRANTI DAL',
    accountNumber: '50200088991234',
    ifscCode: 'HDFC0001234',
    bankName: 'HDFC Bank Ltd.',
    branch: 'Aligarh Main Branch, UP'
  },
  upiId: 'bharatiyauva@okhdfcbank',
  upiQrImage: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=bharatiyauva@okhdfcbank%26pn=Yuva%20Kranti%20Dal%26cu=INR',
  membershipFee: 250,
  pageViews: 18450,
  smtpHost: 'smtp.gmail.com',
  smtpPort: 587,
  smtpUser: 'ravisain75688@gmail.com',
  smtpPass: 'wmth wfbo khov uugu',
  smtpFromName: 'Yuva Kranti Dal',
  adminSecretKey: 'ravi123',
  footerDescription: 'Yuva Kranti Dal is a non-profit, government-registered social welfare organization certified under Section 12A & 80G of the Income Tax Act. Dedicated to quality education, youth livelihood, healthcare, emergency blood donation, and nation building.',
  footerCopyright: '© 2026 Yuva Kranti Dal. All rights reserved.',
  heroSlides: [
    {
      title: 'Empowering Youth, Transforming Society, Nation First',
      subtitle: 'Yuva Kranti Dal (युवा क्रांति दल) is a premier 12A & 80G certified NGO mobilizing young leaders for free child literacy, emergency healthcare, and rural empowerment.',
      imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1920&auto=format&fit=crop&q=80',
      tag: 'National Youth Movement',
      ctaPrimaryText: 'Donate Online (Instant 80G)',
      ctaPrimaryLink: '/donation',
      ctaSecondaryText: 'Join as Member (Get ID Card)',
      ctaSecondaryLink: '/members',
      highlight: 'Over 25,000+ Underprivileged Beneficiaries Across India',
    },
    {
      title: '100% Transparent Giving with Section 80G Tax Exemption',
      subtitle: 'Your contribution funds school books, student scholarships, emergency blood delivery, and women vocational centers. Claim 50% tax deduction with instant receipts.',
      imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1920&auto=format&fit=crop&q=80',
      tag: '50% Income Tax Exemption',
      ctaPrimaryText: 'Contribute to a Campaign',
      ctaPrimaryLink: '/campaigns',
      ctaSecondaryText: 'Inspect Legal Certificates',
      ctaSecondaryLink: '/certificates',
      highlight: 'Instant 80G Form 10BD Eligible Receipts Generated',
    },
    {
      title: '24/7 Voluntary Blood Network & Emergency Relief Helpline',
      subtitle: 'Connecting critical hospital patients with verified voluntary donors across districts in real time. Over 1,800 emergency units arranged with zero donor charges.',
      imageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=1920&auto=format&fit=crop&q=80',
      tag: 'Emergency Relief Care',
      ctaPrimaryText: 'Emergency Blood Support',
      ctaPrimaryLink: '/complaints',
      ctaSecondaryText: 'Apply as Volunteer',
      ctaSecondaryLink: '/volunteer',
      highlight: 'Zero Administrative Fee Deductions • Real Ground Relief',
    },
  ],
  newsTickerText: 'समस्या समाधान परिषद (SSP) में आपका स्वागत है • निःशुल्क सदस्यता एवं समाज सेवा अभियान • हेल्पलाइन: +919319698759',
  homeAboutTitle: 'About Us',
  homeAboutStory: 'Samasya Samadhan Parishadh (SSP) is a passionate advocate for positive change, dedicated to making a tangible difference in the world. Since our inception [Year], we have been driven by a singular mission: to empower individuals and communities to thrive through sustainable development initiatives, education, healthcare access, and environmental stewardship.',
  homeOurValues: 'At Samasya Samadhan Parishadh (SSP), our core values of compassion, integrity, and inclusivity guide everything we do. We believe in the power of collaboration and collective action to address pressing global challenges and create lasting impact.',
  homeOurImpact: 'Through strategic partnerships, grassroots initiatives, and the dedication of our team, we have achieved significant milestones in [mention specific areas of impact]. Our work has touched the lives of [number] individuals and continues to inspire positive change worldwide.',
  homeJoinUs: 'Join us in our mission to create a brighter, more equitable world for all. Together, we can make a difference.',
  presidentMessageTitle: 'President Message',
  presidentPhotoUrl: '',
  presidentMessageContent: 'Dear Friends,\n\nIt is with great pride and humility that I address you as the President of Samasya Samadhan Parishadh (SSP). Since our founding 2022, our organization has been driven by a simple yet profound belief: that every individual, regardless of circumstance, deserves the opportunity to thrive.',
  youtubeVideos: [
    {
      title: 'समस्या समाधान परिषद (SSP) के राष्ट्रीय अध्यक्ष श्री...',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    {
      title: 'समस्या समाधान परिषद (SSP) के सामाजिक कार्य...',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    }
  ],
  objectives: [
    {
      title: 'SOCIAL WELFARE',
      imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600',
      link: '/services'
    },
    {
      title: 'HEALTH & RESEARCH',
      imageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=600',
      link: '/services'
    },
    {
      title: 'EDUCATION & TRAINING',
      imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600',
      link: '/services'
    },
    {
      title: 'HUMAN RIGHTS',
      imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600',
      link: '/who-we-are'
    },
    {
      title: 'ANTI CRIME',
      imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600',
      link: '/complaints'
    }
  ]
};

export const INITIAL_SERVICES = [
  {
    id: 'srv_1',
    title: 'Youth Skill Development & Livelihood',
    titleEn: 'Youth Skill & Livelihood Training',
    description: 'Providing vocational digital training, tailoring labs, and career guidance to empower underprivileged youth.',
    icon: 'Briefcase',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'srv_2',
    title: 'Shiksha Kranti - Free Children Education',
    titleEn: 'Free Education & Book Banks',
    description: 'Distributing school kits, uniforms, and running evening remedial tuition centers for slum children.',
    icon: 'BookOpen',
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'srv_3',
    title: 'Emergency Blood Helpline & Medical Relief',
    titleEn: 'Blood Donation & Medical Relief',
    description: '24x7 emergency voluntary blood donor network and free medical diagnostic camps for rural communities.',
    icon: 'Heart',
    image: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'srv_4',
    title: 'Green Mission - Environmental Conservation',
    titleEn: 'Environment & Tree Plantation Mission',
    description: 'Planting 5,000+ native trees annually with community geotagging and plastic-free cleanliness drives.',
    icon: 'Trees',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'srv_5',
    title: 'Women Empowerment & Self-Defense',
    titleEn: 'Women Empowerment & Self-Defense',
    description: 'Self-defense workshops for girls, vocational sewing centers, and menstrual hygiene health kits.',
    icon: 'Shield',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'srv_6',
    title: 'Disaster Relief & Annapurna Food Support',
    titleEn: 'Disaster Relief & Food Distribution',
    description: 'Immediate relief kits, dry ration packets, and warm winter blankets during emergencies and cold waves.',
    icon: 'Gift',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_PROGRAMS = [
  {
    id: 'prg_1',
    title: 'Project Shiksha - Educating 1,000 Slum Children',
    badge: 'Ongoing Initiative',
    description: 'Comprehensive support covering school fees, textbooks, stationery kits, and daily tutoring support.',
    beneficiaries: '1,500+ Students',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'prg_2',
    title: 'Yuva Shakti - Livelihood & Career Incubation',
    badge: 'Skill India Partner',
    description: '3-month intensive vocational training courses in computer operations, accounting, and communication.',
    beneficiaries: '350+ Youth Placed',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'prg_3',
    title: 'Life Saver Emergency Blood Network',
    badge: '24x7 Emergency Help',
    description: 'Automated donor matching providing immediate blood units to emergency patients and thalassemia children.',
    beneficiaries: '2,800+ Units Donated',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_STORIES = [
  {
    id: 'sty_1',
    title: 'From Traffic Signals to Board Examination Topper',
    beneficiary: 'Rahul Kumar (Age 16)',
    date: 'July 15, 2026',
    category: 'Education Impact',
    summary: 'Spotted selling toys at traffic intersections in 2022, Rahul enrolled in our evening learning center. Today, he scored 82% in his Class 10 State Board examination.',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'sty_2',
    title: '45 Rural Women Become Micro-Entrepreneurs',
    beneficiary: 'Bagru Women Self-Help Group',
    date: 'August 28, 2026',
    category: 'Women Livelihood',
    summary: 'After completing our free tailoring and handicrafts workshop, 45 rural women established a cooperative and now earn over ₹8,000 monthly.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_FEEDBACKS = [
  {
    id: 'fb_1',
    name: 'Dr. Manish Sharma (Senior Physician)',
    role: 'Regular Donor',
    rating: 5,
    comment: 'The transparency and commitment of Yuva Kranti Dal is commendable. The 80G tax receipt was generated instantly and every rupee is accounted for.',
    date: 'August 10, 2026'
  },
  {
    id: 'fb_2',
    name: 'Suman Lata (Educator)',
    role: 'Volunteer',
    rating: 5,
    comment: 'Volunteering with this foundation gave me a meaningful platform to teach slum children. The organization channels youth energy in the right direction.',
    date: 'September 02, 2026'
  },
  {
    id: 'fb_3',
    name: 'Rajeev Khandelwal (Industrialist)',
    role: 'CSR Partner',
    rating: 5,
    comment: 'All statutory compliances (12A, 80G, NITI Aayog) are well maintained. Our corporate CSR contribution delivered great ground-level results.',
    date: 'September 20, 2026'
  }
];

// 1. Fetch Settings
export const fetchSettings = createAsyncThunk(
  'ngo/fetchSettings',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/settings');
      if (res.data?.success && res.data?.settings) {
        return res.data.settings;
      }
      return rejectWithValue('Failed to load settings');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Error fetching settings');
    }
  }
);

// 2. Update Settings
export const updateSettings = createAsyncThunk(
  'ngo/updateSettings',
  async (newSettings, { rejectWithValue }) => {
    try {
      const res = await api.put('/settings', newSettings);
      if (res.data?.success) {
        return res.data.settings;
      }
      return rejectWithValue(res.data?.message || 'Failed to update settings');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Error updating settings');
    }
  }
);

// 3. Fetch Certificates
export const fetchCertificates = createAsyncThunk(
  'ngo/fetchCertificates',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/certificates');
      if (res.data?.success) {
        return res.data.certificates;
      }
      return rejectWithValue('Failed to load certificates');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Error fetching certificates');
    }
  }
);

// 4. Issue Certificate (Admin)
export const issueCertificate = createAsyncThunk(
  'ngo/issueCertificate',
  async (certData, { rejectWithValue }) => {
    try {
      const res = await api.post('/certificates', certData);
      if (res.data?.success) {
        return res.data;
      }
      return rejectWithValue(res.data?.message || 'Failed to issue certificate');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Error issuing certificate');
    }
  }
);

// 5. Fetch Email Audit Logs (Admin)
export const fetchEmailLogs = createAsyncThunk(
  'ngo/fetchEmailLogs',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/email-logs');
      if (res.data?.success) {
        return res.data.logs;
      }
      return rejectWithValue('Failed to load email logs');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Error fetching email logs');
    }
  }
);

// 6. Fetch Members
export const fetchMembers = createAsyncThunk(
  'ngo/fetchMembers',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/members/public').catch(() => api.get('/members'));
      if (res.data?.success || res.data?.members) {
        return res.data.members || [];
      }
      return rejectWithValue('Failed to load members');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Error fetching members');
    }
  }
);

// 7. Fetch Campaigns
export const fetchCampaigns = createAsyncThunk(
  'ngo/fetchCampaigns',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/campaigns');
      if (res.data?.success || res.data?.campaigns) {
        return res.data.campaigns || [];
      }
      return rejectWithValue('Failed to load campaigns');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Error fetching campaigns');
    }
  }
);

const ngoSlice = createSlice({
  name: 'ngo',
  initialState: {
    settings: INITIAL_SETTINGS,
    certificates: [],
    emailLogs: [],
    members: [],
    campaigns: [],
    services: INITIAL_SERVICES,
    programs: INITIAL_PROGRAMS,
    stories: INITIAL_STORIES,
    feedbacks: INITIAL_FEEDBACKS,
    events: [],
    blogs: [],
    gallery: [],
    teamMembers: [],
    complaints: [],
    lang: 'en',
    loading: false,
    error: null,
    successMessage: null
  },
  reducers: {
    setSettings: (state, action) => {
      state.settings = { ...state.settings, ...action.payload };
    },
    setMembers: (state, action) => {
      state.members = action.payload;
    },
    setCampaigns: (state, action) => {
      state.campaigns = action.payload;
    },
    setServices: (state, action) => {
      state.services = action.payload;
    },
    setPrograms: (state, action) => {
      state.programs = action.payload;
    },
    setStories: (state, action) => {
      state.stories = action.payload;
    },
    setFeedbacks: (state, action) => {
      state.feedbacks = action.payload;
    },
    setEvents: (state, action) => {
      state.events = action.payload;
    },
    setBlogs: (state, action) => {
      state.blogs = action.payload;
    },
    setGallery: (state, action) => {
      state.gallery = action.payload;
    },
    setTeamMembers: (state, action) => {
      state.teamMembers = action.payload;
    },
    setComplaints: (state, action) => {
      state.complaints = action.payload;
    },
    toggleLanguage: (state) => {
      state.lang = state.lang === 'en' ? 'hi' : 'en';
    },
    clearNGOStatus: (state) => {
      state.error = null;
      state.successMessage = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.settings = { ...state.settings, ...action.payload };
      })
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.settings = { ...state.settings, ...action.payload };
        state.successMessage = 'Settings saved successfully';
      })
      .addCase(fetchCertificates.fulfilled, (state, action) => {
        state.certificates = action.payload;
      })
      .addCase(issueCertificate.fulfilled, (state, action) => {
        if (action.payload?.certificate) {
          state.certificates.unshift(action.payload.certificate);
        }
        state.successMessage = action.payload?.message || 'Certificate issued!';
      })
      .addCase(fetchEmailLogs.fulfilled, (state, action) => {
        state.emailLogs = action.payload;
      })
      .addCase(fetchMembers.fulfilled, (state, action) => {
        state.members = action.payload;
      })
      .addCase(fetchCampaigns.fulfilled, (state, action) => {
        state.campaigns = action.payload;
      });
  }
});

export const {
  setSettings,
  setMembers,
  setCampaigns,
  setServices,
  setPrograms,
  setStories,
  setFeedbacks,
  setEvents,
  setBlogs,
  setGallery,
  setTeamMembers,
  setComplaints,
  toggleLanguage,
  clearNGOStatus
} = ngoSlice.actions;

export default ngoSlice.reducer;
