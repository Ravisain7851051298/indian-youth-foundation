'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const NGOContext = createContext();

const INITIAL_SETTINGS = {
  ngoName: 'Indian Youth Foundation',
  ngoNameHi: 'भारतीय युवा क्रांति',
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
  email: 'samasyasamadhanparishad@gmail.com',
  phone: '+91 93196 98759',
  whatsapp: '+919319698759',
  address: 'Head Office - Krishna Vihar Pala Road Aligarh, Uttar Pradesh',
  googleMapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d113000!2d78.07!3d27.89!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3974a496c4d7e7a5%3A0x6b10b7849e79d7e0!2sAligarh%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000',
  aboutHeading: 'About Indian Youth Foundation (Bharatiya Yuva Kranti)',
  aboutSubtitle: 'A Government-Recognized Youth Social Welfare Movement Dedicated to Nation Building',
  aboutStory: 'Founded by visionary youth leaders, Indian Youth Foundation is committed to grassroots nation-building. Operating across multiple states, our volunteers organize child education initiatives, 24x7 emergency blood donor networks, rural women livelihood training, and rapid disaster relief assistance.',
  aboutMissionSummary: 'To channel youth energy towards quality education for every child, free emergency healthcare, women self-reliance, and humanitarian disaster relief.',
  aboutVisionSummary: 'An India where every young citizen is an empowered, conscious leader actively contributing to an inclusive, equitable, and poverty-free society.',
  missionStatement: 'To channel the energy and passion of Indian youth into measurable grassroots social welfare initiatives, ensuring quality education for every underprivileged child, immediate healthcare access, women empowerment, and disaster relief.',
  visionStatement: 'To foster an empowered, educated, and self-reliant nation where proactive youth leadership eliminates socioeconomic disparities and creates lasting community prosperity.',
  bankDetails: {
    accountName: 'INDIAN YOUTH FOUNDATION SANSTHA',
    accountNumber: '50200088991234',
    ifscCode: 'HDFC0001234',
    bankName: 'HDFC Bank Ltd.',
    branch: 'Aligarh Main Branch, UP'
  },
  upiId: 'bharatiyauva@okhdfcbank',
  upiQrImage: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=bharatiyauva@okhdfcbank%26pn=Indian%20Youth%20Foundation%26cu=INR',
  membershipFee: 250,
  pageViews: 18450,
  footerDescription: 'Indian Youth Foundation (Bharatiya Yuva Kranti) is a non-profit, government-registered social welfare organization certified under Section 12A & 80G of the Income Tax Act. Dedicated to quality education, youth livelihood, healthcare, emergency blood donation, and nation building.',
  footerCopyright: '© 2026 Indian Youth Foundation. All rights reserved.',
  heroSlides: [
    {
      title: 'Empowering Youth, Transforming Society, Nation First',
      subtitle: 'Indian Youth Foundation (भारतीय युवा क्रांति) is a premier 12A & 80G certified NGO mobilizing young leaders for free child literacy, emergency healthcare, and rural empowerment.',
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
  presidentMessageContent: `Dear Friends,\n\nIt is with great pride and humility that I address you as the President of Samasya Samadhan Parishadh (SSP). Since our founding 2022, our organization has been driven by a simple yet profound belief: that every individual, regardless of circumstance, deserves the opportunity to thrive.\n\nAt Samasya Samadhan Parishadh (SSP), we are not just dreamers; we are doers. We roll up our sleeves and work tirelessly to turn our vision of a better world into reality. From providing access to education and healthcare to championing environmental sustainability and social justice, our efforts are guided by a deep commitment to making a meaningful difference in the lives of others.\n\nBut we cannot do it alone. Our success is built on the support of passionate individuals like you—individuals who share our values and our vision for a brighter future. Together, we can amplify our impact and create lasting change that reverberates far beyond our borders.\n\nAs we look to the future, I am filled with hope and optimism. The challenges we face are great, but so too is our resolve to overcome them. With your continued support, I am confident that we can build a world where every person has the opportunity to flourish and thrive.\n\nThank you for your unwavering commitment to our cause. Together, we are truly making a difference.\n\nWarm regards,\n\nSamasya Samadhan Parishadh (SSP)`,
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

const INITIAL_SERVICES = [
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

const INITIAL_PROGRAMS = [
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

const INITIAL_STORIES = [
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

const INITIAL_FEEDBACKS = [
  {
    id: 'fb_1',
    name: 'Dr. Manish Sharma (Senior Physician)',
    role: 'Regular Donor',
    rating: 5,
    comment: 'The transparency and commitment of Indian Youth Foundation is commendable. The 80G tax receipt was generated instantly and every rupee is accounted for.',
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

export function NGOProvider({ children }) {
  const [lang, setLang] = useState('en'); // Defaulting to clean English
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  const [settings, setSettings] = useState(INITIAL_SETTINGS);
  const [members, setMembers] = useState([]);
  const [donations, setDonations] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [services, setServices] = useState(INITIAL_SERVICES);
  const [programs, setPrograms] = useState(INITIAL_PROGRAMS);
  const [stories, setStories] = useState(INITIAL_STORIES);
  const [feedbacks, setFeedbacks] = useState(INITIAL_FEEDBACKS);
  const [events, setEvents] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [auditReports, setAuditReports] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInitialData = async () => {
    try {
      setLoading(true);

      // Dynamically verify session from backend using secure HTTP-Only cookie
      fetch('/api/auth/me', { credentials: 'include' })
        .then(r => r.ok ? r.json() : null)
        .then(data => {
          if (data && data.success && data.user) {
            setCurrentUser(data.user);
            if (typeof window !== 'undefined') {
              const str = JSON.stringify(data.user);
              sessionStorage.setItem('byk_user', str);
              localStorage.setItem('byk_user', str);
            }
          } else {
            setCurrentUser(null);
            if (typeof window !== 'undefined') {
              sessionStorage.removeItem('byk_user');
              localStorage.removeItem('byk_user');
            }
          }
        })
        .catch(() => {});

      const [setRes, campRes, donRes, memRes, evtRes, newsRes, galRes, certRes, grvRes, fbRes, teamRes, srvRes] = await Promise.allSettled([
        fetch('/api/settings', { credentials: 'include' }).then(r => r.json()),
        fetch('/api/campaigns', { credentials: 'include' }).then(r => r.json()),
        fetch('/api/donations', { credentials: 'include' }).then(r => r.json()),
        fetch('/api/members/public', { credentials: 'include' })
          .then(r => r.json())
          .catch(() => ({ members: [] })),
        fetch('/api/events', { credentials: 'include' }).then(r => r.json()),
        fetch('/api/news', { credentials: 'include' }).then(r => r.json()),
        fetch('/api/gallery', { credentials: 'include' }).then(r => r.json()),
        fetch('/api/certificates', { credentials: 'include' }).then(r => r.json()),
        fetch('/api/grievances', { credentials: 'include' }).then(r => r.json()),
        fetch('/api/feedback', { credentials: 'include' }).then(r => r.json()),
        fetch('/api/team-members', { credentials: 'include' }).then(r => r.json()),
        fetch('/api/services', { credentials: 'include' }).then(r => r.json())
      ]);

      if (srvRes.status === 'fulfilled') {
        const srvList = srvRes.value?.data || srvRes.value?.items || [];
        if (Array.isArray(srvList) && srvList.length > 0) {
          setServices(srvList);
        }
      }

      if (setRes.status === 'fulfilled' && setRes.value?.settings) {
        setSettings(prev => ({ ...prev, ...setRes.value.settings }));
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('byk_settings', JSON.stringify(setRes.value.settings));
          } catch {}
        }
      }

      if (teamRes.status === 'fulfilled') {
        const teamList = teamRes.value?.data || teamRes.value?.items || [];
        if (Array.isArray(teamList) && teamList.length) {
          setTeamMembers(teamList);
        } else if (setRes.value?.settings?.managementTeam?.length) {
          setTeamMembers(setRes.value.settings.managementTeam);
        }
      } else if (setRes.value?.settings?.managementTeam?.length) {
        setTeamMembers(setRes.value.settings.managementTeam);
      }

      if (campRes.status === 'fulfilled' && campRes.value?.campaigns) {
        setCampaigns(campRes.value.campaigns);
      }
      if (donRes.status === 'fulfilled' && donRes.value?.donations) {
        setDonations(donRes.value.donations);
      }
      if (memRes.status === 'fulfilled' && memRes.value?.members) {
        setMembers(memRes.value.members);
      }
      if (evtRes.status === 'fulfilled' && evtRes.value?.events) {
        setEvents(evtRes.value.events);
      }
      if (newsRes.status === 'fulfilled' && newsRes.value?.news) {
        setBlogs(newsRes.value.news);
      }
      if (galRes.status === 'fulfilled' && galRes.value?.gallery) {
        setGallery(galRes.value.gallery);
      }
      if (certRes.status === 'fulfilled' && certRes.value?.certificates) {
        setCertificates(certRes.value.certificates);
      }
      if (grvRes.status === 'fulfilled' && grvRes.value?.grievances) {
        setComplaints(grvRes.value.grievances);
      }
      if (fbRes.status === 'fulfilled' && (fbRes.value?.feedbacks || fbRes.value?.data)) {
        const fetched = fbRes.value.feedbacks || fbRes.value.data;
        if (Array.isArray(fetched) && fetched.length > 0) {
          setFeedbacks(fetched);
        }
      }
    } catch (err) {
      console.warn('API fetch notice, continuing with local store:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initialize and dynamically verify active session with backend
  useEffect(() => {
    // Restore cached storage values safely on client after initial hydration
    try {
      const savedUser = sessionStorage.getItem('byk_user') || localStorage.getItem('byk_user');
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }
      const savedSettings = localStorage.getItem('byk_settings');
      if (savedSettings) {
        setSettings(prev => ({ ...prev, ...JSON.parse(savedSettings) }));
      }
    } catch (e) {
      console.warn('Storage restoration error:', e);
    }

    fetchInitialData();

    // Listen for global user updated event to sync context instantly across app
    const handleUserUpdated = (e) => {
      if (e.detail) {
        setCurrentUser(e.detail);
      }
    };

    // Listen for global 401 unauthorized events to dynamically reset auth state
    const handleUnauthorized = () => {
      setCurrentUser(null);
      setToken(null);
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('byk_user');
        localStorage.removeItem('byk_user');
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('byk_auth_unauthorized', handleUnauthorized);
      window.addEventListener('byk_user_updated', handleUserUpdated);
      return () => {
        window.removeEventListener('byk_auth_unauthorized', handleUnauthorized);
        window.removeEventListener('byk_user_updated', handleUserUpdated);
      };
    }
  }, []);

  const toggleLanguage = () => {
    const newL = lang === 'en' ? 'hi' : 'en';
    setLang(newL);
  };

  const login = async (identifier, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ identifier, email: identifier, phone: identifier, password })
      });
      const data = await res.json();
      if (data.success) {
        setCurrentUser(data.user);
        setToken(data.token);
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('byk_user', JSON.stringify(data.user));
        }
        return { success: true, user: data.user };
      } else {
        return { success: false, message: data.message };
      }
    } catch (e) {
      return { success: false, message: 'Authentication error' };
    }
  };

  const createAdminAccount = async (adminData, adminSecretKey) => {
    try {
      const cleanSecret = (adminSecretKey || adminData?.adminSecretKey || '').toString().trim();
      const payload = { ...adminData, adminSecretKey: cleanSecret };
      const res = await fetch('/api/auth/create-admin', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-secret-key': cleanSecret
        },
        credentials: 'include',
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setCurrentUser(data.user);
        setToken(data.token);
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('byk_user', JSON.stringify(data.user));
        }
        return { success: true, user: data.user, message: data.message };
      } else {
        return { success: false, message: data.message };
      }
    } catch (e) {
      return { success: false, message: 'Admin account creation error' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (e) {
      console.error('Logout error:', e);
    } finally {
      setCurrentUser(null);
      setToken(null);
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('byk_user');
      }
    }
  };

  const registerUser = async (userData) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(userData)
      });
      const data = await res.json();
      if (data.success) {
        setCurrentUser(data.user);
        setToken(data.token);
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('byk_user', JSON.stringify(data.user));
        }
        setMembers(prev => [data.user, ...prev]);
        return { success: true, user: data.user, message: data.message };
      } else {
        return { success: false, message: data.message };
      }
    } catch (e) {
      return { success: false, message: 'Registration failed' };
    }
  };

  const updateSettings = async (newSettings) => {
    // Sanitize sensitive credentials from frontend state and localStorage
    const cleanSettings = { ...newSettings };
    delete cleanSettings.smtpPass;
    delete cleanSettings.adminSecretKey;
    delete cleanSettings.smtpUser;
    delete cleanSettings.smtpHost;
    delete cleanSettings.smtpPort;

    const updated = { ...settings, ...cleanSettings };
    setSettings(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('byk_settings', JSON.stringify(updated));
    }
    try {
      const headers = { 
        'Content-Type': 'application/json'
      };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      if (newSettings?.adminSecretKey) {
        headers['x-admin-secret-key'] = newSettings.adminSecretKey;
      }
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers,
        credentials: 'include',
        body: JSON.stringify(newSettings)
      });
      const data = await res.json();
      if (data?.settings) {
        setSettings(data.settings);
        if (typeof window !== 'undefined') {
          localStorage.setItem('byk_settings', JSON.stringify(data.settings));
        }
      }
      return data;
    } catch (e) {
      console.warn('Backend sync failed, saved locally');
      return { success: true, savedLocally: true };
    }
  };

  const testEmailSettings = async (testData) => {
    try {
      const headers = { 
        'Content-Type': 'application/json'
      };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      if (testData?.adminSecretKey) {
        headers['x-admin-secret-key'] = testData.adminSecretKey;
      }
      const res = await fetch('/api/settings/test-email', {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify(testData)
      });
      const rawText = await res.text();
      let data;
      try {
        data = JSON.parse(rawText);
      } catch (jsonErr) {
        return {
          success: false,
          message: `Server Error (${res.status}): ${rawText.slice(0, 150) || res.statusText || 'Unexpected server response'}`
        };
      }
      return data;
    } catch (e) {
      return { success: false, message: e.message || 'Network error while testing SMTP' };
    }
  };

  const recordDonation = async (donationData) => {
    try {
      const isFormData = typeof FormData !== 'undefined' && donationData instanceof FormData;
      const headers = { 
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      };
      if (!isFormData) {
        headers['Content-Type'] = 'application/json';
      }
      const res = await fetch('/api/donations/verify', {
        method: 'POST',
        headers,
        credentials: 'include',
        body: isFormData ? donationData : JSON.stringify(donationData)
      });
      const data = await res.json();
      if (data.success) {
        setDonations(prev => [data.donation, ...prev]);
        return { success: true, donation: data.donation };
      }
      return { success: false, message: data.message };
    } catch (e) {
      return { success: false, message: 'Error processing donation' };
    }
  };

  const refreshCampaigns = async () => {
    try {
      const res = await fetch('/api/campaigns', { credentials: 'include' });
      const data = await res.json();
      if (data?.campaigns) {
        setCampaigns(data.campaigns);
      }
    } catch (e) {}
  };

  const setMemberStatus = async (memberId, status) => {
    setMembers(prev => prev.map(m => (m._id === memberId || m.memberId === memberId) ? { ...m, status } : m));
    try {
      await fetch(`/api/members/${memberId}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
    } catch (e) {}
  };

  const verifyMember = async (memberId, data = {}) => {
    setMembers(prev => prev.map(m => {
      if (m._id === memberId || m.memberId === memberId) {
        return { 
          ...m, 
          status: 'active', 
          feePaid: true, 
          idCardGenerated: true, 
          appointmentLetterGenerated: true,
          ...data 
        };
      }
      return m;
    }));
    try {
      await fetch(`/api/members/${memberId}/verify`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
    } catch (e) {}
  };

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services', { credentials: 'include' });
      if (res.ok) {
        const json = await res.json();
        const list = json?.data || json?.items || [];
        if (Array.isArray(list) && list.length > 0) {
          setServices(list);
          return list;
        }
      }
    } catch (e) {
      console.warn('Failed to fetch services:', e);
    }
    return services;
  };

  const addService = (srv) => setServices(prev => [{ ...srv, id: `srv_${Date.now()}` }, ...prev]);
  const deleteService = (id) => setServices(prev => prev.filter(s => s.id !== id));

  const addProgram = (prg) => setPrograms(prev => [{ ...prg, id: `prg_${Date.now()}` }, ...prev]);
  const deleteProgram = (id) => setPrograms(prev => prev.filter(p => p.id !== id));

  const addStory = (sty) => setStories(prev => [{ ...sty, id: `sty_${Date.now()}` }, ...prev]);
  const deleteStory = (id) => setStories(prev => prev.filter(s => s.id !== id));

  const addFeedback = async (fb) => {
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        credentials: 'include',
        body: JSON.stringify(fb)
      });
      const data = await res.json();
      if (data.success && data.feedback) {
        setFeedbacks(prev => [data.feedback, ...prev]);
        return { success: true, feedback: data.feedback };
      }
    } catch (e) {
      console.warn('API feedback error, fallback local:', e);
    }
    const local = { ...fb, id: `fb_${Date.now()}`, createdAt: new Date().toISOString() };
    setFeedbacks(prev => [local, ...prev]);
    return { success: true, feedback: local };
  };

  const replyFeedback = async (id, replyData) => {
    try {
      const res = await fetch(`/api/feedback/${id}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        credentials: 'include',
        body: JSON.stringify(replyData)
      });
      const data = await res.json();
      if (data.success && data.feedback) {
        setFeedbacks(prev => prev.map(f => (f._id === id || f.id === id ? data.feedback : f)));
        return { success: true, feedback: data.feedback };
      }
      return { success: false, message: data.message };
    } catch (e) {
      setFeedbacks(prev => prev.map(f => {
        if (f._id === id || f.id === id) {
          return {
            ...f,
            adminReply: replyData.reply,
            adminRepliedAt: new Date().toISOString(),
            repliedBy: replyData.repliedBy || 'Administrator',
            repliedByRole: replyData.repliedByRole || 'Admin'
          };
        }
        return f;
      }));
      return { success: true };
    }
  };

  const updateFeedbackStatus = async (id, status) => {
    try {
      const res = await fetch(`/api/feedback/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        credentials: 'include',
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success && data.feedback) {
        setFeedbacks(prev => prev.map(f => (f._id === id || f.id === id ? data.feedback : f)));
        return { success: true };
      }
    } catch (e) {}
    setFeedbacks(prev => prev.map(f => (f._id === id || f.id === id ? { ...f, status } : f)));
    return { success: true };
  };

  const deleteFeedback = async (id) => {
    try {
      await fetch(`/api/feedback/${id}`, {
        method: 'DELETE',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        credentials: 'include'
      });
    } catch (e) {}
    setFeedbacks(prev => prev.filter(f => f._id !== id && f.id !== id));
    return { success: true };
  };

  const addComplaint = async (complaintData) => {
    try {
      const res = await fetch('/api/grievances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(complaintData)
      });
      const data = await res.json();
      if (data.success) {
        setComplaints(prev => [data.grievance, ...prev]);
        return { success: true, message: data.message, grievance: data.grievance };
      }
      return { success: false, message: data.message };
    } catch (e) {
      const local = { ...complaintData, _id: `grv_${Date.now()}`, status: 'pending', createdAt: new Date() };
      setComplaints(prev => [local, ...prev]);
      return { success: true, message: 'Complaint registered successfully', grievance: local };
    }
  };

  const updateComplaintStatus = async (id, status, notes = '') => {
    setComplaints(prev => prev.map(c => c._id === id ? { ...c, status, resolutionNotes: notes } : c));
    try {
      await fetch(`/api/grievances/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status, resolutionNotes: notes })
      });
    } catch (e) {}
  };

  const addCampaign = async (camp) => {
    try {
      const isFormData = typeof FormData !== 'undefined' && camp instanceof FormData;
      const headers = {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        'x-admin-secret-key': 'iyf_admin_master_secret_2026'
      };
      if (!isFormData) headers['Content-Type'] = 'application/json';

      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers,
        credentials: 'include',
        body: isFormData ? camp : JSON.stringify(camp)
      });
      const data = await res.json();
      if (data.success && data.campaign) {
        setCampaigns(prev => [data.campaign, ...prev]);
        return data;
      } else {
        const fallback = isFormData ? Object.fromEntries(camp.entries()) : camp;
        const fallbackObj = { ...fallback, _id: `camp_${Date.now()}`, raisedAmount: 0 };
        setCampaigns(prev => [fallbackObj, ...prev]);
        return { success: true, campaign: fallbackObj };
      }
    } catch (e) {
      const fallback = typeof FormData !== 'undefined' && camp instanceof FormData ? Object.fromEntries(camp.entries()) : camp;
      const fallbackObj = { ...fallback, _id: `camp_${Date.now()}`, raisedAmount: 0 };
      setCampaigns(prev => [fallbackObj, ...prev]);
      return { success: true, campaign: fallbackObj };
    }
  };

  const updateCampaign = async (id, updatedData) => {
    try {
      const isFormData = typeof FormData !== 'undefined' && updatedData instanceof FormData;
      const headers = {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        'x-admin-secret-key': 'iyf_admin_master_secret_2026'
      };
      if (!isFormData) headers['Content-Type'] = 'application/json';

      const res = await fetch(`/api/campaigns/${id}`, {
        method: 'PUT',
        headers,
        credentials: 'include',
        body: isFormData ? updatedData : JSON.stringify(updatedData)
      });
      const data = await res.json();
      if (data.success && data.campaign) {
        setCampaigns(prev => prev.map(c => (c._id === id || c.id === id ? data.campaign : c)));
        return data;
      } else {
        const patch = isFormData ? Object.fromEntries(updatedData.entries()) : updatedData;
        setCampaigns(prev => prev.map(c => (c._id === id || c.id === id ? { ...c, ...patch } : c)));
        return { success: true };
      }
    } catch (e) {
      const patch = typeof FormData !== 'undefined' && updatedData instanceof FormData ? Object.fromEntries(updatedData.entries()) : updatedData;
      setCampaigns(prev => prev.map(c => (c._id === id || c.id === id ? { ...c, ...patch } : c)));
      return { success: true };
    }
  };

  const deleteCampaign = async (id) => {
    try {
      const res = await fetch(`/api/campaigns/${id}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          'x-admin-secret-key': 'iyf_admin_master_secret_2026'
        },
        credentials: 'include'
      });
      const data = await res.json();
      setCampaigns(prev => prev.filter(c => c._id !== id && c.id !== id));
      return data;
    } catch (e) {
      setCampaigns(prev => prev.filter(c => c._id !== id && c.id !== id));
      return { success: true };
    }
  };

  const refreshUser = async () => {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          setCurrentUser(data.user);
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('byk_user', JSON.stringify(data.user));
          }
          return data.user;
        }
      }
    } catch (e) {
      console.warn('Failed to refresh user', e);
    }
    return null;
  };

  const addEvent = async (evt) => {
    try {
      const isFormData = typeof FormData !== 'undefined' && evt instanceof FormData;
      const headers = {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        'x-admin-secret-key': 'iyf_admin_master_secret_2026'
      };
      if (!isFormData) headers['Content-Type'] = 'application/json';

      const res = await fetch('/api/events', {
        method: 'POST',
        headers,
        credentials: 'include',
        body: isFormData ? evt : JSON.stringify(evt)
      });
      const data = await res.json();
      if (data.success && data.event) {
        setEvents(prev => [data.event, ...prev]);
        return data;
      }
    } catch (e) {
      const fallback = typeof FormData !== 'undefined' && evt instanceof FormData ? Object.fromEntries(evt.entries()) : evt;
      const local = { ...fallback, _id: `evt_${Date.now()}` };
      setEvents(prev => [local, ...prev]);
      return { success: true, event: local };
    }
  };

  const updateEvent = async (id, updatedData) => {
    try {
      const isFormData = typeof FormData !== 'undefined' && updatedData instanceof FormData;
      const headers = {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        'x-admin-secret-key': 'iyf_admin_master_secret_2026'
      };
      if (!isFormData) headers['Content-Type'] = 'application/json';

      const res = await fetch(`/api/events/${id}`, {
        method: 'PUT',
        headers,
        credentials: 'include',
        body: isFormData ? updatedData : JSON.stringify(updatedData)
      });
      const data = await res.json();
      if (data.success && data.event) {
        setEvents(prev => prev.map(e => (e._id === id || e.id === id ? data.event : e)));
        return data;
      } else {
        const patch = isFormData ? Object.fromEntries(updatedData.entries()) : updatedData;
        setEvents(prev => prev.map(e => (e._id === id || e.id === id ? { ...e, ...patch } : e)));
        return { success: true };
      }
    } catch (e) {
      const patch = typeof FormData !== 'undefined' && updatedData instanceof FormData ? Object.fromEntries(updatedData.entries()) : updatedData;
      setEvents(prev => prev.map(e => (e._id === id || e.id === id ? { ...e, ...patch } : e)));
      return { success: true };
    }
  };

  const deleteEvent = async (id) => {
    try {
      const res = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          'x-admin-secret-key': 'iyf_admin_master_secret_2026'
        },
        credentials: 'include'
      });
      const data = await res.json();
      setEvents(prev => prev.filter(e => e._id !== id && e.id !== id));
      return data;
    } catch (e) {
      setEvents(prev => prev.filter(e => e._id !== id && e.id !== id));
      return { success: true };
    }
  };

  const addBlog = async (item) => {
    try {
      const isFormData = typeof FormData !== 'undefined' && item instanceof FormData;
      const headers = {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        'x-admin-secret-key': 'iyf_admin_master_secret_2026'
      };
      if (!isFormData) headers['Content-Type'] = 'application/json';

      const res = await fetch('/api/news', {
        method: 'POST',
        headers,
        credentials: 'include',
        body: isFormData ? item : JSON.stringify(item)
      });
      const data = await res.json();
      if (data.success && data.news) {
        setBlogs(prev => [data.news, ...prev]);
        return data;
      }
    } catch (e) {
      const fallback = typeof FormData !== 'undefined' && item instanceof FormData ? Object.fromEntries(item.entries()) : item;
      const local = { ...fallback, _id: `news_${Date.now()}`, date: new Date().toISOString().split('T')[0] };
      setBlogs(prev => [local, ...prev]);
      return { success: true, news: local };
    }
  };

  const updateBlog = async (id, updatedData) => {
    try {
      const isFormData = typeof FormData !== 'undefined' && updatedData instanceof FormData;
      const headers = {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        'x-admin-secret-key': 'iyf_admin_master_secret_2026'
      };
      if (!isFormData) headers['Content-Type'] = 'application/json';

      const res = await fetch(`/api/news/${id}`, {
        method: 'PUT',
        headers,
        credentials: 'include',
        body: isFormData ? updatedData : JSON.stringify(updatedData)
      });
      const data = await res.json();
      if (data.success && data.news) {
        setBlogs(prev => prev.map(b => (b._id === id || b.id === id ? data.news : b)));
        return data;
      } else {
        const patch = isFormData ? Object.fromEntries(updatedData.entries()) : updatedData;
        setBlogs(prev => prev.map(b => (b._id === id || b.id === id ? { ...b, ...patch } : b)));
        return { success: true };
      }
    } catch (e) {
      const patch = typeof FormData !== 'undefined' && updatedData instanceof FormData ? Object.fromEntries(updatedData.entries()) : updatedData;
      setBlogs(prev => prev.map(b => (b._id === id || b.id === id ? { ...b, ...patch } : b)));
      return { success: true };
    }
  };

  const deleteBlog = async (id) => {
    try {
      const res = await fetch(`/api/news/${id}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          'x-admin-secret-key': 'iyf_admin_master_secret_2026'
        },
        credentials: 'include'
      });
      const data = await res.json();
      setBlogs(prev => prev.filter(b => b._id !== id && b.id !== id));
      return data;
    } catch (e) {
      setBlogs(prev => prev.filter(b => b._id !== id && b.id !== id));
      return { success: true };
    }
  };

  const addGalleryItem = async (item) => {
    try {
      const isFormData = typeof FormData !== 'undefined' && item instanceof FormData;
      const headers = {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        'x-admin-secret-key': 'iyf_admin_master_secret_2026'
      };
      if (!isFormData) headers['Content-Type'] = 'application/json';

      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers,
        credentials: 'include',
        body: isFormData ? item : JSON.stringify(item)
      });
      const data = await res.json();
      if (data.success && (data.galleryItem || data.item)) {
        const newItem = data.galleryItem || data.item;
        setGallery(prev => [newItem, ...prev]);
        return data;
      }
    } catch (e) {
      const fallback = typeof FormData !== 'undefined' && item instanceof FormData ? Object.fromEntries(item.entries()) : item;
      const local = { ...fallback, _id: `gal_${Date.now()}` };
      setGallery(prev => [local, ...prev]);
      return { success: true, item: local };
    }
  };

  const updateGalleryItem = async (id, updatedData) => {
    try {
      const isFormData = typeof FormData !== 'undefined' && updatedData instanceof FormData;
      const headers = {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        'x-admin-secret-key': 'iyf_admin_master_secret_2026'
      };
      if (!isFormData) headers['Content-Type'] = 'application/json';

      const res = await fetch(`/api/gallery/${id}`, {
        method: 'PUT',
        headers,
        credentials: 'include',
        body: isFormData ? updatedData : JSON.stringify(updatedData)
      });
      const data = await res.json();
      if (data.success && (data.galleryItem || data.item)) {
        const item = data.galleryItem || data.item;
        setGallery(prev => prev.map(g => (g._id === id || g.id === id ? item : g)));
        return data;
      } else {
        const patch = isFormData ? Object.fromEntries(updatedData.entries()) : updatedData;
        setGallery(prev => prev.map(g => (g._id === id || g.id === id ? { ...g, ...patch } : g)));
        return { success: true };
      }
    } catch (e) {
      const patch = typeof FormData !== 'undefined' && updatedData instanceof FormData ? Object.fromEntries(updatedData.entries()) : updatedData;
      setGallery(prev => prev.map(g => (g._id === id || g.id === id ? { ...g, ...patch } : g)));
      return { success: true };
    }
  };

  const deleteGalleryItem = async (id) => {
    try {
      const res = await fetch(`/api/gallery/${id}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          'x-admin-secret-key': 'iyf_admin_master_secret_2026'
        },
        credentials: 'include'
      });
      const data = await res.json();
      setGallery(prev => prev.filter(g => g._id !== id && g.id !== id));
      return data;
    } catch (e) {
      setGallery(prev => prev.filter(g => g._id !== id && g.id !== id));
      return { success: true };
    }
  };

  const addCertificate = async (cert) => {
    try {
      const res = await fetch('/api/certificates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(cert)
      });
      const data = await res.json();
      if (data.success) {
        setCertificates(prev => [data.certificate, ...prev]);
        return { success: true, certificate: data.certificate };
      }
      return { success: false, message: data.message };
    } catch (e) {
      const local = { ...cert, _id: `cert_${Date.now()}`, certificateNo: `CERT-2026-${Math.floor(Math.random() * 1000)}` };
      setCertificates(prev => [local, ...prev]);
      return { success: true, certificate: local };
    }
  };

  const addTeamMember = async (member) => {
    try {
      const res = await api.post('/team-members', member);
      const created = res.data?.data || res.data?.item;
      if (created) {
        setTeamMembers(prev => [created, ...prev]);
        return { success: true, member: created };
      }
    } catch (e) {
      console.warn('API addTeamMember error, updating local:', e.message);
    }
    const local = { ...member, _id: `tm_${Date.now()}` };
    setTeamMembers(prev => [local, ...prev]);
    return { success: true, member: local };
  };

  const updateTeamMember = async (id, member) => {
    try {
      const res = await api.put(`/team-members/${id}`, member);
      const updated = res.data?.data || res.data?.item;
      if (updated) {
        setTeamMembers(prev => prev.map(m => (m._id === id || m.id === id ? updated : m)));
        return { success: true, member: updated };
      }
    } catch (e) {
      console.warn('API updateTeamMember error, updating local:', e.message);
    }
    setTeamMembers(prev => prev.map(m => (m._id === id || m.id === id ? { ...m, ...member } : m)));
    return { success: true };
  };

  const deleteTeamMember = async (idOrIdx) => {
    try {
      const targetId = typeof idOrIdx === 'string' ? idOrIdx : teamMembers[idOrIdx]?._id;
      if (targetId) {
        await api.delete(`/team-members/${targetId}`);
        setTeamMembers(prev => prev.filter(m => m._id !== targetId && m.id !== targetId));
        return { success: true };
      }
    } catch (e) {
      console.warn('API deleteTeamMember error, updating local:', e.message);
    }
    setTeamMembers(prev => prev.filter((_, i) => i !== idOrIdx));
    return { success: true };
  };

  const uploadFile = async (file, category = 'general') => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', category);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      return await res.json();
    } catch (e) {
      console.error('File upload failed', e);
      return { success: false, message: 'Upload failed' };
    }
  };

  const deleteFile = async (fileUrl) => {
    try {
      if (!fileUrl) return { success: false };
      const res = await fetch('/api/upload', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: fileUrl })
      });
      return await res.json();
    } catch (e) {
      console.error('File delete failed', e);
      return { success: false, message: 'Delete failed' };
    }
  };

  const value = {
    lang,
    toggleLanguage,
    currentUser,
    token,
    login,
    logout,
    registerUser,
    createAdminAccount,
    uploadFile,
    deleteFile,
    settings,
    updateSettings,
    testEmailSettings,
    members,
    setMemberStatus,
    verifyMember,
    donations,
    recordDonation,
    campaigns,
    refreshCampaigns,
    addCampaign,
    updateCampaign,
    deleteCampaign,
    services,
    fetchServices,
    addService,
    deleteService,
    programs,
    addProgram,
    deleteProgram,
    stories,
    addStory,
    deleteStory,
    feedbacks,
    addFeedback,
    replyFeedback,
    updateFeedbackStatus,
    deleteFeedback,
    events,
    setEvents,
    addEvent,
    updateEvent,
    deleteEvent,
    blogs,
    addBlog,
    updateBlog,
    deleteBlog,
    gallery,
    addGalleryItem,
    updateGalleryItem,
    deleteGalleryItem,
    refreshUser,
    certificates,
    addCertificate,
    complaints,
    addComplaint,
    updateComplaintStatus,
    auditReports,
    teamMembers,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,
    members,
    setMembers,
    loading
  };

  return <NGOContext.Provider value={value}>{children}</NGOContext.Provider>;
}

export function useNGO() {
  const context = useContext(NGOContext);
  if (!context) throw new Error('useNGO must be used within an NGOProvider');
  return context;
}
