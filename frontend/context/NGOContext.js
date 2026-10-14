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
  footerCopyright: '© 2026 Indian Youth Foundation. All rights reserved.'
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

  // Initialize and dynamically verify active session with backend
  useEffect(() => {
    try {
      const savedUser = typeof window !== 'undefined' ? sessionStorage.getItem('byk_user') : null;
      const savedSettings = typeof window !== 'undefined' ? localStorage.getItem('byk_settings') : null;

      if (savedUser) setCurrentUser(JSON.parse(savedUser));
      if (savedSettings) setSettings(JSON.parse(savedSettings));
    } catch (e) {
      console.error('Error loading session state', e);
    }

    fetchInitialData();

    // Listen for global 401 unauthorized events to dynamically reset auth state
    const handleUnauthorized = () => {
      setCurrentUser(null);
      setToken(null);
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('byk_user');
      }
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('byk_auth_unauthorized', handleUnauthorized);
      return () => {
        window.removeEventListener('byk_auth_unauthorized', handleUnauthorized);
      };
    }
  }, []);

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
              sessionStorage.setItem('byk_user', JSON.stringify(data.user));
            }
          } else {
            setCurrentUser(null);
            if (typeof window !== 'undefined') {
              sessionStorage.removeItem('byk_user');
            }
          }
        })
        .catch(() => {});

      const [setRes, campRes, donRes, memRes, evtRes, newsRes, galRes, certRes, grvRes] = await Promise.allSettled([
        fetch('/api/settings', { credentials: 'include' }).then(r => r.json()),
        fetch('/api/campaigns', { credentials: 'include' }).then(r => r.json()),
        fetch('/api/donations', { credentials: 'include' }).then(r => r.json()),
        fetch('/api/members', { credentials: 'include' }).then(r => r.json()),
        fetch('/api/events', { credentials: 'include' }).then(r => r.json()),
        fetch('/api/news', { credentials: 'include' }).then(r => r.json()),
        fetch('/api/gallery', { credentials: 'include' }).then(r => r.json()),
        fetch('/api/certificates', { credentials: 'include' }).then(r => r.json()),
        fetch('/api/grievances', { credentials: 'include' }).then(r => r.json()),
      ]);

      if (setRes.status === 'fulfilled' && setRes.value?.settings) {
        setSettings(prev => ({ ...prev, ...setRes.value.settings }));
        if (setRes.value.settings.managementTeam?.length) {
          setTeamMembers(setRes.value.settings.managementTeam);
        }
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
    } catch (err) {
      console.warn('API fetch notice, continuing with local store:', err);
    } finally {
      setLoading(false);
    }
  };

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
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('byk_settings', JSON.stringify(updated));
    }
    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(newSettings)
      });
    } catch (e) {
      console.warn('Backend sync failed, saved locally');
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
        const campaignId = isFormData ? donationData.get('campaignId') : donationData.campaignId;
        const amount = isFormData ? Number(donationData.get('amount')) : Number(donationData.amount);
        if (campaignId) {
          setCampaigns(prev => prev.map(c => 
            c._id === campaignId || c.id === campaignId
              ? { ...c, raisedAmount: (c.raisedAmount || 0) + (amount || 0), donorCount: (c.donorCount || 0) + 1 }
              : c
          ));
        }
        return { success: true, donation: data.donation };
      }
      return { success: false, message: data.message };
    } catch (e) {
      return { success: false, message: 'Error processing donation' };
    }
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

  const addService = (srv) => setServices(prev => [{ ...srv, id: `srv_${Date.now()}` }, ...prev]);
  const deleteService = (id) => setServices(prev => prev.filter(s => s.id !== id));

  const addProgram = (prg) => setPrograms(prev => [{ ...prg, id: `prg_${Date.now()}` }, ...prev]);
  const deleteProgram = (id) => setPrograms(prev => prev.filter(p => p.id !== id));

  const addStory = (sty) => setStories(prev => [{ ...sty, id: `sty_${Date.now()}` }, ...prev]);
  const deleteStory = (id) => setStories(prev => prev.filter(s => s.id !== id));

  const addFeedback = (fb) => setFeedbacks(prev => [{ ...fb, id: `fb_${Date.now()}` }, ...prev]);
  const deleteFeedback = (id) => setFeedbacks(prev => prev.filter(f => f.id !== id));

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

  const addTeamMember = (member) => {
    const updated = [...teamMembers, member];
    setTeamMembers(updated);
    updateSettings({ managementTeam: updated });
  };

  const deleteTeamMember = (idx) => {
    const updated = teamMembers.filter((_, i) => i !== idx);
    setTeamMembers(updated);
    updateSettings({ managementTeam: updated });
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
    members,
    setMemberStatus,
    verifyMember,
    donations,
    recordDonation,
    campaigns,
    addCampaign,
    updateCampaign,
    deleteCampaign,
    services,
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
    deleteFeedback,
    events,
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
    deleteTeamMember,
    loading
  };

  return <NGOContext.Provider value={value}>{children}</NGOContext.Provider>;
}

export function useNGO() {
  const context = useContext(NGOContext);
  if (!context) throw new Error('useNGO must be used within an NGOProvider');
  return context;
}
