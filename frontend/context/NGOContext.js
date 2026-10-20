'use client';

import React, { createContext, useContext, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import api from '@/services/api';
import {
  loginUser,
  logoutUser,
  registerUser as registerUserThunk,
  createAdminUser,
  fetchCurrentUser,
  setUser
} from '@/store/authSlice';
import {
  fetchSettings,
  updateSettings as updateSettingsThunk,
  fetchMembers,
  fetchCampaigns,
  fetchCertificates,
  issueCertificate,
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
  toggleLanguage as toggleLanguageAction,
  INITIAL_SETTINGS,
  INITIAL_SERVICES,
  INITIAL_PROGRAMS,
  INITIAL_STORIES,
  INITIAL_FEEDBACKS
} from '@/store/ngoSlice';
import { fetchDonations, recordDonation as recordDonationThunk } from '@/store/donationSlice';

const NGOContext = createContext(null);

export function NGOProvider({ children }) {
  const dispatch = useDispatch();

  // All state is read directly from Redux Toolkit - Single Source of Truth
  const currentUser = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const authLoading = useSelector((state) => state.auth.loading);

  const settings = useSelector((state) => state.ngo.settings || INITIAL_SETTINGS);
  const members = useSelector((state) => state.ngo.members || []);
  const campaigns = useSelector((state) => state.ngo.campaigns || []);
  const services = useSelector((state) => state.ngo.services || INITIAL_SERVICES);
  const programs = useSelector((state) => state.ngo.programs || INITIAL_PROGRAMS);
  const stories = useSelector((state) => state.ngo.stories || INITIAL_STORIES);
  const feedbacks = useSelector((state) => state.ngo.feedbacks || INITIAL_FEEDBACKS);
  const events = useSelector((state) => state.ngo.events || []);
  const blogs = useSelector((state) => state.ngo.blogs || []);
  const gallery = useSelector((state) => state.ngo.gallery || []);
  const teamMembers = useSelector((state) => state.ngo.teamMembers || []);
  const certificates = useSelector((state) => state.ngo.certificates || []);
  const complaints = useSelector((state) => state.ngo.complaints || []);
  const lang = useSelector((state) => state.ngo.lang || 'en');
  const ngoLoading = useSelector((state) => state.ngo.loading);

  const donations = useSelector((state) => state.donations.donations || []);

  const loading = authLoading || ngoLoading;

  // On mount, load initial data into Redux store
  useEffect(() => {
    dispatch(fetchCurrentUser());
    dispatch(fetchSettings());
    dispatch(fetchMembers());
    dispatch(fetchCampaigns());
    dispatch(fetchCertificates());
    dispatch(fetchDonations());

    // Fetch ancillary dynamic collections
    const fetchAncillary = async () => {
      try {
        const [srvRes, evtRes, newsRes, galRes, teamRes, grvRes, fbRes] = await Promise.allSettled([
          api.get('/services'),
          api.get('/events'),
          api.get('/news'),
          api.get('/gallery'),
          api.get('/team-members'),
          api.get('/grievances'),
          api.get('/feedback')
        ]);

        if (srvRes.status === 'fulfilled' && (srvRes.value.data?.data || srvRes.value.data?.items)) {
          const list = srvRes.value.data.data || srvRes.value.data.items;
          if (Array.isArray(list) && list.length) dispatch(setServices(list));
        }
        if (evtRes.status === 'fulfilled' && evtRes.value.data?.events) {
          dispatch(setEvents(evtRes.value.data.events));
        }
        if (newsRes.status === 'fulfilled' && (newsRes.value.data?.news || newsRes.value.data?.blogs)) {
          dispatch(setBlogs(newsRes.value.data.news || newsRes.value.data.blogs));
        }
        if (galRes.status === 'fulfilled' && galRes.value.data?.gallery) {
          dispatch(setGallery(galRes.value.data.gallery));
        }
        if (teamRes.status === 'fulfilled' && (teamRes.value.data?.data || teamRes.value.data?.items)) {
          dispatch(setTeamMembers(teamRes.value.data.data || teamRes.value.data.items));
        }
        if (grvRes.status === 'fulfilled' && grvRes.value.data?.grievances) {
          dispatch(setComplaints(grvRes.value.data.grievances));
        }
        if (fbRes.status === 'fulfilled' && (fbRes.value.data?.feedbacks || fbRes.value.data?.data)) {
          dispatch(setFeedbacks(fbRes.value.data.feedbacks || fbRes.value.data.data));
        }
      } catch (e) {
        console.warn('Ancillary data load notice:', e.message);
      }
    };

    fetchAncillary();
  }, [dispatch]);

  // Auth Operations dispatched to Redux Toolkit
  const login = useCallback(
    async (identifier, password) => {
      try {
        const result = await dispatch(
          loginUser({ email: identifier, password, identifier })
        ).unwrap();
        return { success: true, user: result.user, token: result.accessToken || result.token };
      } catch (err) {
        const message = typeof err === 'string' ? err : err?.message || 'Login failed';
        return { success: false, message };
      }
    },
    [dispatch]
  );

  const logout = useCallback(async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      return { success: true };
    } catch {
      return { success: true };
    }
  }, [dispatch]);

  const registerUser = useCallback(
    async (userData) => {
      try {
        const result = await dispatch(registerUserThunk(userData)).unwrap();
        return { success: true, user: result.user, message: result.message };
      } catch (err) {
        const message = typeof err === 'string' ? err : err?.message || 'Registration failed';
        return { success: false, message };
      }
    },
    [dispatch]
  );

  const createAdminAccount = useCallback(
    async (adminData, adminSecretKey) => {
      try {
        const result = await dispatch(
          createAdminUser({ adminData, adminSecretKey })
        ).unwrap();
        return { success: true, user: result.user, message: result.message };
      } catch (err) {
        const message = typeof err === 'string' ? err : err?.message || 'Admin creation failed';
        return { success: false, message };
      }
    },
    [dispatch]
  );

  const refreshUser = useCallback(async () => {
    try {
      const res = await dispatch(fetchCurrentUser()).unwrap();
      return res?.user || res;
    } catch {
      return null;
    }
  }, [dispatch]);

  const toggleLanguage = useCallback(() => {
    dispatch(toggleLanguageAction());
  }, [dispatch]);

  const updateSettings = useCallback(
    async (newSettings) => {
      try {
        const res = await dispatch(updateSettingsThunk(newSettings)).unwrap();
        return { success: true, settings: res };
      } catch (err) {
        return { success: false, message: typeof err === 'string' ? err : err?.message };
      }
    },
    [dispatch]
  );

  const testEmailSettings = useCallback(async (payload) => {
    try {
      const res = await api.post('/settings/test-smtp', payload);
      return res.data;
    } catch (err) {
      try {
        const fallbackRes = await api.post('/settings/test-email', payload);
        return fallbackRes.data;
      } catch (fallbackErr) {
        return {
          success: false,
          message: fallbackErr.response?.data?.message || err.response?.data?.message || fallbackErr.message || 'SMTP Test failed'
        };
      }
    }
  }, []);

  const setMemberStatus = useCallback(
    async (id, status) => {
      try {
        const res = await api.put(`/members/${id}/status`, { status });
        dispatch(fetchMembers());
        return res.data;
      } catch (err) {
        return { success: false, message: err.response?.data?.message || 'Failed' };
      }
    },
    [dispatch]
  );

  const verifyMember = useCallback(
    async (id) => {
      try {
        const res = await api.put(`/members/${id}/verify`);
        dispatch(fetchMembers());
        return res.data;
      } catch (err) {
        return { success: false, message: err.response?.data?.message || 'Verification failed' };
      }
    },
    [dispatch]
  );

  const recordDonation = useCallback(
    async (donationData) => {
      try {
        const res = await dispatch(recordDonationThunk(donationData)).unwrap();
        return { success: true, donation: res };
      } catch (err) {
        return { success: false, message: typeof err === 'string' ? err : err?.message };
      }
    },
    [dispatch]
  );

  const refreshCampaigns = useCallback(() => {
    dispatch(fetchCampaigns());
  }, [dispatch]);

  const addCampaign = useCallback(
    async (data) => {
      try {
        const res = await api.post('/campaigns', data);
        dispatch(fetchCampaigns());
        return res.data;
      } catch (err) {
        return { success: false, message: err.response?.data?.message || 'Error' };
      }
    },
    [dispatch]
  );

  const updateCampaign = useCallback(
    async (id, data) => {
      try {
        const res = await api.put(`/campaigns/${id}`, data);
        dispatch(fetchCampaigns());
        return res.data;
      } catch (err) {
        return { success: false, message: err.response?.data?.message || 'Error' };
      }
    },
    [dispatch]
  );

  const deleteCampaign = useCallback(
    async (id) => {
      try {
        const res = await api.delete(`/campaigns/${id}`);
        dispatch(fetchCampaigns());
        return res.data;
      } catch (err) {
        return { success: false, message: err.response?.data?.message || 'Error' };
      }
    },
    [dispatch]
  );

  const fetchServicesData = useCallback(async () => {
    try {
      const res = await api.get('/services');
      if (res.data?.data) dispatch(setServices(res.data.data));
    } catch (e) {
      console.warn('fetchServices error:', e.message);
    }
  }, [dispatch]);

  const addService = useCallback(
    async (data) => {
      try {
        const res = await api.post('/services', data);
        fetchServicesData();
        return res.data;
      } catch (err) {
        return { success: false, message: err.response?.data?.message || 'Error' };
      }
    },
    [fetchServicesData]
  );

  const deleteService = useCallback(
    async (id) => {
      try {
        const res = await api.delete(`/services/${id}`);
        fetchServicesData();
        return res.data;
      } catch (err) {
        return { success: false, message: err.response?.data?.message || 'Error' };
      }
    },
    [fetchServicesData]
  );

  const addProgram = useCallback(
    (data) => {
      const newPrg = { id: `prg_${Date.now()}`, ...data };
      dispatch(setPrograms([newPrg, ...programs]));
      return { success: true };
    },
    [dispatch, programs]
  );

  const deleteProgram = useCallback(
    (id) => {
      dispatch(setPrograms(programs.filter((p) => p.id !== id)));
      return { success: true };
    },
    [dispatch, programs]
  );

  const addStory = useCallback(
    (data) => {
      const newSty = { id: `sty_${Date.now()}`, ...data };
      dispatch(setStories([newSty, ...stories]));
      return { success: true };
    },
    [dispatch, stories]
  );

  const deleteStory = useCallback(
    (id) => {
      dispatch(setStories(stories.filter((s) => s.id !== id)));
      return { success: true };
    },
    [dispatch, stories]
  );

  const addFeedback = useCallback(
    async (data) => {
      try {
        const res = await api.post('/feedback', data);
        const item = res.data?.feedback || res.data?.data || { id: `fb_${Date.now()}`, ...data };
        dispatch(setFeedbacks([item, ...feedbacks]));
        return { success: true };
      } catch (err) {
        const item = { id: `fb_${Date.now()}`, ...data };
        dispatch(setFeedbacks([item, ...feedbacks]));
        return { success: true };
      }
    },
    [dispatch, feedbacks]
  );

  const replyFeedback = useCallback(
    async (id, replyText) => {
      try {
        await api.put(`/feedback/${id}/reply`, { reply: replyText });
        dispatch(
          setFeedbacks(
            feedbacks.map((f) => (f._id === id || f.id === id ? { ...f, reply: replyText } : f))
          )
        );
        return { success: true };
      } catch {
        return { success: false };
      }
    },
    [dispatch, feedbacks]
  );

  const updateFeedbackStatus = useCallback(
    async (id, status) => {
      try {
        await api.put(`/feedback/${id}/status`, { status });
        dispatch(
          setFeedbacks(
            feedbacks.map((f) => (f._id === id || f.id === id ? { ...f, status } : f))
          )
        );
        return { success: true };
      } catch {
        return { success: false };
      }
    },
    [dispatch, feedbacks]
  );

  const deleteFeedback = useCallback(
    async (id) => {
      try {
        await api.delete(`/feedback/${id}`);
        dispatch(setFeedbacks(feedbacks.filter((f) => f._id !== id && f.id !== id)));
        return { success: true };
      } catch {
        dispatch(setFeedbacks(feedbacks.filter((f) => f._id !== id && f.id !== id)));
        return { success: true };
      }
    },
    [dispatch, feedbacks]
  );

  const addEvent = useCallback(
    async (data) => {
      try {
        const res = await api.post('/events', data);
        dispatch(setEvents([res.data.event || data, ...events]));
        return { success: true };
      } catch (err) {
        return { success: false, message: err.response?.data?.message || 'Error' };
      }
    },
    [dispatch, events]
  );

  const updateEvent = useCallback(
    async (id, data) => {
      try {
        await api.put(`/events/${id}`, data);
        dispatch(setEvents(events.map((e) => (e._id === id || e.id === id ? { ...e, ...data } : e))));
        return { success: true };
      } catch {
        return { success: false };
      }
    },
    [dispatch, events]
  );

  const deleteEvent = useCallback(
    async (id) => {
      try {
        await api.delete(`/events/${id}`);
        dispatch(setEvents(events.filter((e) => e._id !== id && e.id !== id)));
        return { success: true };
      } catch {
        return { success: false };
      }
    },
    [dispatch, events]
  );

  const addBlog = useCallback(
    async (data) => {
      try {
        const res = await api.post('/news', data);
        dispatch(setBlogs([res.data.news || data, ...blogs]));
        return { success: true };
      } catch (err) {
        return { success: false, message: err.response?.data?.message || 'Error' };
      }
    },
    [dispatch, blogs]
  );

  const updateBlog = useCallback(
    async (id, data) => {
      try {
        await api.put(`/news/${id}`, data);
        dispatch(setBlogs(blogs.map((b) => (b._id === id || b.id === id ? { ...b, ...data } : b))));
        return { success: true };
      } catch {
        return { success: false };
      }
    },
    [dispatch, blogs]
  );

  const deleteBlog = useCallback(
    async (id) => {
      try {
        await api.delete(`/news/${id}`);
        dispatch(setBlogs(blogs.filter((b) => b._id !== id && b.id !== id)));
        return { success: true };
      } catch {
        return { success: false };
      }
    },
    [dispatch, blogs]
  );

  const addGalleryItem = useCallback(
    async (data) => {
      try {
        const res = await api.post('/gallery', data);
        dispatch(setGallery([res.data.item || data, ...gallery]));
        return { success: true };
      } catch (err) {
        return { success: false, message: err.response?.data?.message || 'Error' };
      }
    },
    [dispatch, gallery]
  );

  const updateGalleryItem = useCallback(
    async (id, data) => {
      try {
        await api.put(`/gallery/${id}`, data);
        dispatch(setGallery(gallery.map((g) => (g._id === id || g.id === id ? { ...g, ...data } : g))));
        return { success: true };
      } catch {
        return { success: false };
      }
    },
    [dispatch, gallery]
  );

  const deleteGalleryItem = useCallback(
    async (id) => {
      try {
        await api.delete(`/gallery/${id}`);
        dispatch(setGallery(gallery.filter((g) => g._id !== id && g.id !== id)));
        return { success: true };
      } catch {
        return { success: false };
      }
    },
    [dispatch, gallery]
  );

  const addCertificate = useCallback(
    async (data) => {
      try {
        const res = await dispatch(issueCertificate(data)).unwrap();
        return { success: true, certificate: res.certificate };
      } catch (err) {
        return { success: false, message: typeof err === 'string' ? err : err?.message };
      }
    },
    [dispatch]
  );

  const addComplaint = useCallback(
    async (data) => {
      try {
        const res = await api.post('/grievances', data);
        dispatch(setComplaints([res.data.grievance || data, ...complaints]));
        return { success: true, grievance: res.data.grievance };
      } catch (err) {
        return { success: false, message: err.response?.data?.message || 'Error' };
      }
    },
    [dispatch, complaints]
  );

  const updateComplaintStatus = useCallback(
    async (id, status) => {
      try {
        await api.put(`/grievances/${id}/status`, { status });
        dispatch(
          setComplaints(
            complaints.map((c) => (c._id === id || c.id === id ? { ...c, status } : c))
          )
        );
        return { success: true };
      } catch {
        return { success: false };
      }
    },
    [dispatch, complaints]
  );

  const addTeamMember = useCallback(
    async (data) => {
      try {
        const res = await api.post('/team-members', data);
        const item = res.data?.data || res.data?.item || data;
        dispatch(setTeamMembers([item, ...teamMembers]));
        return { success: true };
      } catch (err) {
        return { success: false, message: err.response?.data?.message || 'Error' };
      }
    },
    [dispatch, teamMembers]
  );

  const updateTeamMember = useCallback(
    async (id, data) => {
      try {
        await api.put(`/team-members/${id}`, data);
        dispatch(
          setTeamMembers(
            teamMembers.map((m) => (m._id === id || m.id === id ? { ...m, ...data } : m))
          )
        );
        return { success: true };
      } catch {
        return { success: false };
      }
    },
    [dispatch, teamMembers]
  );

  const deleteTeamMember = useCallback(
    async (id) => {
      try {
        await api.delete(`/team-members/${id}`);
        dispatch(setTeamMembers(teamMembers.filter((m) => m._id !== id && m.id !== id)));
        return { success: true };
      } catch {
        return { success: false };
      }
    },
    [dispatch, teamMembers]
  );

  const uploadFile = useCallback(async (file, category = 'general') => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', category);
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data', 'x-upload-category': category }
      });
      return res.data;
    } catch (e) {
      return { success: false, message: e.response?.data?.message || 'Upload failed' };
    }
  }, []);

  const deleteFile = useCallback(async (fileUrl) => {
    try {
      if (!fileUrl) return { success: false };
      const res = await api.delete('/upload', { data: { url: fileUrl } });
      return res.data;
    } catch (e) {
      return { success: false, message: 'Delete failed' };
    }
  }, []);

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
    setMembers: (list) => dispatch(setMembers(list)),
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
    fetchServices: fetchServicesData,
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
    setEvents: (evts) => dispatch(setEvents(evts)),
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
    auditReports: [],
    teamMembers,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,
    loading
  };

  return <NGOContext.Provider value={value}>{children}</NGOContext.Provider>;
}

export function useNGO() {
  const context = useContext(NGOContext);
  if (!context) {
    throw new Error('useNGO must be used within an NGOProvider');
  }
  return context;
}
