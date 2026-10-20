"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  FiEdit2,
  FiImage,
  FiPlus,
  FiTrash2,
  FiX,
  FiSearch,
  FiRefreshCw,
  FiEye,
  FiCalendar,
  FiAlertCircle,
  FiCheckCircle,
  FiUploadCloud,
  FiUsers,
  FiPhone,
  FiMail,
  FiMapPin,
  FiClock,
  FiVideo,
  FiPlay,
  FiExternalLink,
  FiFilter
} from "react-icons/fi";
import { CONTENT_COLLECTIONS } from "@/constants/dashboard";
import api from "@/services/api";
import { getContentImageUrl } from "@/lib/authApi";
import { getYoutubeEmbedUrl, getYoutubeThumbnail, isVideoItem } from "@/lib/youtube";

export function getItemCategory(item) {
  if (!item) return "";
  if (item.category && typeof item.category === "string" && item.category.trim()) return item.category.trim();
  if (Array.isArray(item.tags) && item.tags.length > 0 && item.tags[0]) return String(item.tags[0]).trim();
  if (typeof item.tags === "string" && item.tags.trim()) return item.tags.trim();
  if (item.statementType) return item.statementType;
  if (item.certificateType) return item.certificateType;
  return "";
}

export default function ContentCollection({ resource }) {
  const config = CONTENT_COLLECTIONS[resource] || CONTENT_COLLECTIONS.blogs;
  const endpoint = config.endpoint || resource;

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Gallery Filters
  const [galleryCategory, setGalleryCategory] = useState("All");
  const [galleryMediaType, setGalleryMediaType] = useState("All");
  const [galleryPreviewItem, setGalleryPreviewItem] = useState(null);

  // Service Filters & Inspect Modal
  const [serviceCategory, setServiceCategory] = useState("All");
  const [viewServiceModalItem, setViewServiceModalItem] = useState(null);

  // Blog Filters & Inspect Modal
  const [blogCategory, setBlogCategory] = useState("All");
  const [viewBlogModalItem, setViewBlogModalItem] = useState(null);

  const [initialFormSnapshot, setInitialFormSnapshot] = useState("");
  const [initialImgsCount, setInitialImgsCount] = useState(0);

  // Event Enhanced View
  const [viewEventModalItem, setViewEventModalItem] = useState(null);
  const [activeEventImageIdx, setActiveEventImageIdx] = useState(0);

  // Modal State
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteModalItem, setDeleteModalItem] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [attendeesModalItem, setAttendeesModalItem] = useState(null);
  const [attendeeSearch, setAttendeeSearch] = useState("");
  const [removingAttendeeId, setRemovingAttendeeId] = useState(null);

  // Form Fields
  const [form, setForm] = useState({});
  const [existingImages, setExistingImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [newFilePreviews, setNewFilePreviews] = useState([]);
  const [formError, setFormError] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/${endpoint}`);
      const data = res.data?.data || res.data?.items || res.data?.gallery || res.data?.galleries || res.data?.events || res.data?.news || res.data?.campaigns || res.data?.certificates || [];
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to load ${config.title}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [resource, endpoint]);

  function getEmptyForm() {
    const base = { title: "", description: "", content: "", date: "" };
    if (config?.customFields) {
      config.customFields.forEach((f) => {
        base[f.name] = f.type === "select" && f.options?.length ? f.options[0] : "";
      });
    }
    return base;
  }

  function openCreateForm() {
    setEditingItem(null);
    const empty = getEmptyForm();
    setForm(empty);
    setInitialFormSnapshot(JSON.stringify(empty));
    setInitialImgsCount(0);
    setExistingImages([]);
    setNewFiles([]);
    setNewFilePreviews([]);
    setFormError("");
    setFormOpen(true);
  }

  function openEditForm(item) {
    setEditingItem(item);
    const initialForm = {
      title: item.title || item.name || item.headline || "",
      description: item.description || item.content || item.summary || item.caption || item.bio || "",
      content: item.content || item.description || item.summary || item.caption || item.bio || "",
      date: item.date ? item.date.slice(0, 10) : "",
    };
    if (config?.customFields) {
      config.customFields.forEach((f) => {
        let val = item[f.name];
        if (f.name === "category" && (!val || val === "")) {
          val = getItemCategory(item);
        }
        if (Array.isArray(val)) {
          val = val.join(', ');
        }
        initialForm[f.name] = val ?? (f.type === "select" && f.options?.length ? f.options[0] : "");
      });
    }
    setForm(initialForm);

    // Extract existing image(s)
    let imgs = [];
    if (Array.isArray(item.images) && item.images.length) {
      imgs = item.images;
    } else if (item.bannerImage) {
      imgs = [item.bannerImage];
    } else if (item.image) {
      imgs = [item.image];
    } else if (item.imageUrl) {
      imgs = [item.imageUrl];
    } else if (item.url) {
      imgs = [item.url];
    }
    const cleanImgs = imgs.filter(Boolean);
    setExistingImages(cleanImgs);
    setInitialFormSnapshot(JSON.stringify(initialForm));
    setInitialImgsCount(cleanImgs.length);
    setNewFiles([]);
    setNewFilePreviews([]);
    setFormError("");
    setFormOpen(true);
  }

  const isCollectionFormDirty = () => {
    if (!formOpen) return false;
    const filesChanged = newFiles.length > 0;
    const existingImagesChanged = existingImages.length !== initialImgsCount;
    const fieldsChanged = initialFormSnapshot ? JSON.stringify(form) !== initialFormSnapshot : false;
    if (!editingItem) {
      return Boolean(form.title?.trim() || filesChanged);
    }
    return fieldsChanged || filesChanged || existingImagesChanged;
  };

  function closeForm() {
    setFormOpen(false);
    setEditingItem(null);
    setForm(getEmptyForm());
    setExistingImages([]);
    setNewFiles([]);
    setNewFilePreviews([]);
    setFormError("");
  }

  function handleFileSelection(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const maxAllowed = config.maxImages || (resource === 'events' ? 5 : 10);
    const currentTotal = existingImages.length + newFiles.length;
    const remainingSlots = maxAllowed - currentTotal;

    if (remainingSlots <= 0) {
      toast.error(`Maximum ${maxAllowed} images allowed`);
      return;
    }

    const filesToAdd = files.slice(0, remainingSlots);
    setNewFiles((prev) => [...prev, ...filesToAdd]);

    const previews = filesToAdd.map((file) => URL.createObjectURL(file));
    setNewFilePreviews((prev) => [...prev, ...previews]);

    if (files.length > remainingSlots) {
      toast(`Only ${remainingSlots} photo(s) added (Max ${maxAllowed} allowed).`);
    }
    e.target.value = "";
  }

  function removeExistingImage(index) {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  }

  function removeNewFile(index) {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
    setNewFilePreviews((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title?.trim()) {
      setFormError("Title is required");
      return;
    }

    try {
      setSubmitting(true);
      setFormError("");

      // 1. Upload any new files first to get URLs
      const uploadedUrls = [];
      for (const file of newFiles) {
        const formData = new FormData();
        formData.append("file", file);
        const upRes = await api.post("/upload", formData);
        if (upRes.data?.success && upRes.data?.url) {
          uploadedUrls.push(upRes.data.url);
        }
      }

      // Combine existing images with newly uploaded
      const finalImages = [...existingImages, ...uploadedUrls];
      const textContent = (form.description || form.content || form.caption || form.summary || "").trim();
      const textTitle = (form.title || form.name || form.headline || "").trim();

      const itemCat = form.category || getItemCategory(editingItem) || (resource === "blogs" ? "News" : "");
      const payload = {
        ...form,
        title: textTitle,
        titleHi: form.titleHi || textTitle,
        content: textContent,
        contentHi: form.contentHi || textContent,
        description: textContent,
        date: form.date || new Date().toISOString().split("T")[0],
        images: finalImages,
        image: finalImages[0] || "",
        imageUrl: finalImages[0] || "",
        bannerImage: finalImages[0] || form.bannerImage || "",
        url: finalImages[0] || form.url || form.videoUrl || "",
        caption: textContent,
        author: form.author || "संपादक, युवा क्रांति दल"
      };

      if (resource === "gallery" || resource === "galleries") {
        const isVid =
          form.mediaType === "video" ||
          Boolean(form.videoUrl) ||
          isVideoItem({ url: form.videoUrl || form.url || "" });

        payload.mediaType = isVid ? "video" : "photo";
        if (isVid) {
          payload.videoUrl = form.videoUrl || form.url || "";
          payload.url = form.videoUrl || form.url || finalImages[0] || "";
          payload.imageUrl = finalImages[0] || getYoutubeThumbnail(payload.videoUrl) || "";
        } else {
          payload.url = finalImages[0] || form.url || "";
          payload.imageUrl = finalImages[0] || form.url || "";
          payload.videoUrl = "";
        }
      }

      if (resource === "blogs" || itemCat) {
        payload.category = itemCat;
        payload.tags = Array.isArray(form.tags) && form.tags.length > 0 ? form.tags : [itemCat];
      }

      if (editingItem) {
        const id = editingItem._id || editingItem.id;
        await api.put(`/${endpoint}/${id}`, payload);
        toast.success(`${config.title} updated successfully!`);
      } else {
        await api.post(`/${endpoint}`, payload);
        toast.success(`${config.title} created successfully!`);
      }

      closeForm();
      loadData();
    } catch (err) {
      setFormError(err.response?.data?.message || err.message || "Failed to save item");
      toast.error(err.response?.data?.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteConfirm() {
    if (!deleteModalItem) return;
    try {
      setDeleting(true);
      const id = deleteModalItem._id || deleteModalItem.id;
      await api.delete(`/${endpoint}/${id}`);
      toast.success(`${config.title} deleted successfully!`);
      setDeleteModalItem(null);
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete item");
    } finally {
      setDeleting(false);
    }
  }

  async function handleRemoveAttendee(itemId, attendeeId) {
    try {
      setRemovingAttendeeId(attendeeId);
      await api.delete(`/${endpoint}/${itemId}/attendees/${attendeeId}`);
      toast.success("Attendee removed");
      setAttendeesModalItem((prev) => ({
        ...prev,
        attendees: (prev.attendees || []).filter((a) => (a._id || a.id) !== attendeeId)
      }));
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to remove attendee");
    } finally {
      setRemovingAttendeeId(null);
    }
  }

  const filteredItems = items.filter((item) => {
    const q = searchQuery.toLowerCase();
    const title = (item.title || item.name || "").toLowerCase();
    const desc = (item.description || item.content || item.summary || item.caption || item.bio || "").toLowerCase();
    const cat = getItemCategory(item).toLowerCase();
    const loc = (item.location || "").toLowerCase();
    const addr = (item.locationAddress || "").toLowerCase();
    const tagsStr = Array.isArray(item.tags) ? item.tags.join(" ").toLowerCase() : "";
    const matchesSearch = title.includes(q) || desc.includes(q) || cat.includes(q) || loc.includes(q) || addr.includes(q) || tagsStr.includes(q);

    if (!matchesSearch) return false;

    if (resource === "gallery" || resource === "galleries") {
      if (galleryCategory !== "All" && cat !== galleryCategory.toLowerCase()) {
        return false;
      }
      const isVid = isVideoItem(item);
      if (galleryMediaType === "Photos" && isVid) return false;
      if (galleryMediaType === "Videos" && !isVid) return false;
    }

    if (resource === "services") {
      if (serviceCategory !== "All" && cat !== serviceCategory.toLowerCase() && !cat.includes(serviceCategory.toLowerCase())) {
        return false;
      }
    }

    if (resource === "blogs") {
      if (blogCategory !== "All" && cat !== blogCategory.toLowerCase() && !cat.includes(blogCategory.toLowerCase())) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="space-y-4">
      {/* Top Header Card */}
      <div className="bg-white p-4 rounded-b-2xl border-b border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-black tracking-tight">{config.title}</h1>
          <p className="text-xs text-slate-700 mt-1">{config.description}</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition cursor-pointer"
            title="Refresh"
          >
            <FiRefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-red-600" : ""}`} />
          </button>
          <button
            onClick={openCreateForm}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/25 transition cursor-pointer"
          >
            <FiPlus className="w-4 h-4" />
            <span>Add New {config.addLabel || "Item"}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white mx-3 p-2.5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder={`Search ${config.title.toLowerCase()} by title, keyword, address...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-red-500 text-black placeholder:text-slate-400"
          />
        </div>

        {/* Gallery-Specific Filters: Category Options & Media Format */}
        {(resource === "gallery" || resource === "galleries") && (
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs">
              <FiFilter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={galleryCategory}
                onChange={(e) => setGalleryCategory(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-black bg-slate-50 focus:outline-red-500"
              >
                <option value="All">All Categories</option>
                <option value="Child Education">Child Education</option>
                <option value="Healthcare & Blood Donation">Healthcare &amp; Blood</option>
                <option value="Food & Ration Drives">Food &amp; Ration Drives</option>
                <option value="Women Empowerment">Women Empowerment</option>
                <option value="Disaster Relief">Disaster Relief</option>
                <option value="Youth & Community">Youth &amp; Community</option>
                <option value="Tree Plantation & Green India">Green India &amp; Trees</option>
                <option value="Sports & Cultural">Sports &amp; Cultural</option>
                <option value="General">General</option>
              </select>
            </div>

            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl text-xs font-bold">
              {["All", "Photos", "Videos"].map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setGalleryMediaType(fmt)}
                  className={`px-3 py-1 rounded-lg transition cursor-pointer ${galleryMediaType === fmt ? "bg-white text-red-600 shadow-2xs font-extrabold" : "text-slate-600 hover:text-black"
                    }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Services-Specific Filter: Category Options */}
        {resource === "services" && (
          <div className="flex items-center gap-1.5 text-xs">
            <FiFilter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={serviceCategory}
              onChange={(e) => setServiceCategory(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-black bg-slate-50 focus:outline-red-500 cursor-pointer"
            >
              <option value="All">All Categories</option>
              <option value="Education">Education & Child Welfare</option>
              <option value="Healthcare">Healthcare & Emergency</option>
              <option value="Youth">Youth Livelihood & Careers</option>
              <option value="Women">Women Empowerment</option>
              <option value="Disaster">Disaster Relief & Food</option>
              <option value="Environment">Environment & Sanitation</option>
            </select>
          </div>
        )}

        {/* Blogs-Specific Filter: Category Options */}
        {resource === "blogs" && (
          <div className="flex items-center gap-1.5 text-xs">
            <FiFilter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={blogCategory}
              onChange={(e) => setBlogCategory(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-black bg-slate-50 focus:outline-red-500 cursor-pointer"
            >
              <option value="All">All Categories</option>
              <option value="News">News</option>
              <option value="Blog">Blog</option>
              <option value="Announcement">Announcement</option>
              <option value="Field Story">Field Story</option>
              <option value="Press Release">Press Release</option>
            </select>
          </div>
        )}

        <div className="bg-red-500 rounded-xl px-4 py-1.5 flex items-center text-xs font-bold text-white shrink-0 self-end md:self-auto">
          Records: <span className="ml-1.5">{filteredItems.length}</span>
        </div>
      </div>

      {/* Items Table / Cards */}
      <div className="bg-white mx-3 rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-700 text-xs space-y-2">
            <FiRefreshCw className="w-6 h-6 animate-spin mx-auto text-red-600" />
            <p>Loading {config.title.toLowerCase()}...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-12 text-center text-slate-700 text-xs space-y-3">
            <FiAlertCircle className="w-8 h-8 mx-auto text-slate-400" />
            <p className="font-semibold text-black">No {config.title.toLowerCase()} found matching criteria.</p>
            <button
              onClick={openCreateForm}
              className="px-4 py-2 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 font-bold text-xs transition cursor-pointer"
            >
              Create your first record
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-black font-extrabold">
                <tr>
                  <th className="py-3 px-3.5">Image / Media</th>
                  <th className="py-3 px-3.5">Title / Name</th>
                  {resource === "services" ? (
                    <>
                      <th className="py-3 px-3.5">Category</th>
                      <th className="py-3 px-3.5">Key Highlights</th>
                      <th className="py-3 px-3.5">Status</th>
                    </>
                  ) : (
                    config.customFields?.slice(0, 2).map((f) => (
                      <th key={f.name} className="py-3 px-3.5">{f.label}</th>
                    ))
                  )}
                  {config.dateField && <th className="py-3 px-3.5">Date</th>}
                  <th className="py-3 px-3.5 text-right sticky right-0 bg-slate-50 z-20 shadow-[-6px_0_10px_-2px_rgba(0,0,0,0.06)]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-black">
                {filteredItems.map((item) => {
                  const id = item._id || item.id;
                  const thumb = item.bannerImage || (Array.isArray(item.images) && item.images[0]) || item.image || item.imageUrl || item.url;
                  const isVid = isVideoItem(item);
                  const ytThumb = isVid ? getYoutubeThumbnail(item.videoUrl || item.url) : null;
                  const displayThumb = ytThumb || (thumb ? getContentImageUrl(thumb) : null);

                  return (
                    <tr key={id} className="group hover:bg-slate-50/80 transition">
                      <td className="py-3 px-3.5">
                        <div className="relative inline-block">
                          {displayThumb ? (
                            <img
                              src={displayThumb}
                              alt={item.title || "Item"}
                              className="w-12 h-12 object-cover rounded-xl border border-slate-200"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 text-xs font-bold border border-slate-200">
                              {isVid ? <FiVideo className="w-5 h-5 text-purple-600" /> : "N/A"}
                            </div>
                          )}
                          {isVid && (
                            <span className="absolute bottom-1 right-1 p-0.5 rounded bg-purple-600 text-white text-[9px]">
                              <FiPlay className="w-2.5 h-2.5" />
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-3.5">
                        <div className="font-extrabold text-black text-sm">{item.title || item.name}</div>
                        <div className="text-[11px] text-slate-600 line-clamp-1 mt-0.5">
                          {item.description || item.content || item.summary || item.caption || item.bio}
                        </div>

                        {/* Extra metadata tags for Events, Gallery, and Blogs */}
                        <div className="flex flex-wrap items-center gap-1.5 mt-1">
                          {resource === "events" && Array.isArray(item.images) && item.images.length > 1 && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-red-50 text-red-700 font-bold border border-red-200">
                              📷 {item.images.length} Photos
                            </span>
                          )}
                          {resource === "events" && item.locationAddress && (
                            <span className="inline-flex items-center gap-1 text-[10px] text-slate-500 max-w-55 truncate">
                              <FiMapPin className="w-3 h-3 text-red-500 shrink-0" />
                              <span className="truncate">{item.locationAddress}</span>
                            </span>
                          )}
                          {(resource === "gallery" || resource === "galleries") && (
                            <>
                              <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold border ${isVid ? "bg-purple-50 text-purple-700 border-purple-200" : "bg-blue-50 text-blue-700 border-blue-200"
                                }`}>
                                {isVid ? <FiVideo className="w-3 h-3" /> : <FiImage className="w-3 h-3" />}
                                {isVid ? "Video" : "Photo"}
                              </span>
                              {item.category && (
                                <span className="inline-block px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600 font-bold border border-slate-200">
                                  {item.category}
                                </span>
                              )}
                            </>
                          )}
                          {resource === "blogs" && (
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
                                🏷️ {getItemCategory(item) || "News"}
                              </span>
                              {Array.isArray(item.tags) && item.tags.filter(t => t && String(t).toLowerCase() !== (getItemCategory(item) || "").toLowerCase()).map((tag, idx) => (
                                <span key={idx} className="inline-block px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600 font-medium border border-slate-200">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                      {resource === "services" ? (
                        <>
                          <td className="py-3 px-3.5 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-red-50 text-red-700 border border-red-200">
                              {item.category || "Social Welfare"}
                            </span>
                          </td>
                          <td className="py-3 px-3.5">
                            <div className="flex flex-wrap gap-1 max-w-xs">
                              {Array.isArray(item.features) && item.features.length > 0 ? (
                                item.features.slice(0, 2).map((feat, idx) => (
                                  <span key={idx} className="inline-block px-2 py-0.5 rounded-md text-[10px] bg-slate-100 text-slate-700 font-medium border border-slate-200 truncate max-w-32.5" title={feat}>
                                    ✓ {feat}
                                  </span>
                                ))
                              ) : typeof item.features === "string" && item.features ? (
                                <span className="text-[11px] text-slate-600 line-clamp-1">{item.features}</span>
                              ) : (
                                <span className="text-slate-400 text-[11px]">-</span>
                              )}
                              {Array.isArray(item.features) && item.features.length > 2 && (
                                <span className="text-[10px] text-red-600 font-bold self-center">
                                  +{item.features.length - 2} more
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-3.5 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              (item.status || "Active").toLowerCase() === "active"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}>
                              ● {item.status || "Active"}
                            </span>
                          </td>
                        </>
                      ) : resource === "blogs" ? (
                        <>
                          <td className="py-3 px-3.5 whitespace-nowrap">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                              {getItemCategory(item) || "News"}
                            </span>
                          </td>
                          <td className="py-3 px-3.5 text-slate-800 font-semibold whitespace-nowrap">
                            {item.author || "संपादक, युवा क्रांति दल"}
                          </td>
                        </>
                      ) : (
                        config.customFields?.slice(0, 2).map((f) => (
                          <td key={f.name} className="py-3 px-3.5 text-slate-800 font-semibold">
                            {f.name === "category" ? (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-red-50 text-red-700 border border-red-200">
                                {getItemCategory(item) || "-"}
                              </span>
                            ) : (
                              String(item[f.name] ?? "-")
                            )}
                          </td>
                        ))
                      )}
                      {config.dateField && (
                        <td className="py-3 px-3.5 text-slate-700 font-medium whitespace-nowrap">
                          {item.date ? new Date(item.date).toLocaleDateString("en-IN") : "-"}
                        </td>
                      )}
                      <td className="py-3 px-3.5 text-right whitespace-nowrap sticky right-0 bg-white group-hover:bg-slate-50 z-10 shadow-[-6px_0_10px_-2px_rgba(0,0,0,0.06)]">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Blogs: Inspect Modal Button */}
                          {resource === "blogs" && (
                            <button
                              type="button"
                              onClick={() => setViewBlogModalItem(item)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-200 shadow-2xs transition cursor-pointer"
                              title="Inspect Article Details"
                            >
                              <FiEye className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Inspect</span>
                            </button>
                          )}

                          {/* Services: Inspect Modal Button */}
                          {resource === "services" && (
                            <button
                              type="button"
                              onClick={() => setViewServiceModalItem(item)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs shadow-2xs transition cursor-pointer"
                              title="Inspect Service Details"
                            >
                              <FiEye className="w-3.5 h-3.5 text-slate-600" />
                              <span>Inspect</span>
                            </button>
                          )}

                          {/* Events: Inspect Modal Button */}
                          {resource === "events" && (
                            <>
                              <button
                                type="button"
                                onClick={() => {
                                  setViewEventModalItem(item);
                                  setActiveEventImageIdx(0);
                                }}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs shadow-2xs transition cursor-pointer"
                                title="Inspect Event Details"
                              >
                                <FiEye className="w-3.5 h-3.5 text-slate-600" />
                                <span>Inspect</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setAttendeesModalItem(item)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 font-bold text-xs shadow-2xs transition cursor-pointer"
                                title="View Joined Users"
                              >
                                <FiUsers className="w-3.5 h-3.5" />
                                <span>{item.attendees?.length || item.attendeeCount || 0} Joined</span>
                              </button>
                            </>
                          )}

                          {/* Gallery: Preview Button */}
                          {(resource === "gallery" || resource === "galleries") && (
                            <button
                              type="button"
                              onClick={() => setGalleryPreviewItem(item)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs shadow-2xs transition cursor-pointer"
                              title="Preview Media"
                            >
                              <FiEye className="w-3.5 h-3.5 text-slate-600" />
                              <span>Preview</span>
                            </button>
                          )}

                          <button
                            onClick={() => openEditForm(item)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-black hover:border-slate-300 font-bold text-xs shadow-2xs transition cursor-pointer"
                            title="Edit Record"
                          >
                            <FiEdit2 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => setDeleteModalItem(item)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 font-bold text-xs shadow-2xs transition cursor-pointer"
                            title="Delete Record"
                          >
                            <FiTrash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Form Modal */}
      {formOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-slate-200 shadow-2xl relative max-h-[90vh] overflow-y-auto text-black">
            <button
              onClick={closeForm}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-black hover:bg-slate-100 transition cursor-pointer"
            >
              <FiX className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-black text-black mb-1">
              {editingItem ? `Edit ${config.itemLabel || "Item"}` : `Add New ${config.itemLabel || "Item"}`}
            </h2>
            <p className="text-xs text-slate-600 mb-6">
              Fill in the details below. Images display with preview and remove option.
            </p>

            {formError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl flex items-center gap-2">
                <FiAlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs text-black">
              {/* Title */}
              <div>
                <label className="font-extrabold text-black block mb-1">Title / Headline *</label>
                <input
                  type="text"
                  required
                  placeholder={`Enter ${config.itemLabel} title...`}
                  value={form.title || ""}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-red-500 font-medium text-black bg-white"
                />
              </div>

              {/* Custom Fields */}
              {config.customFields?.map((f) => (
                <div key={f.name}>
                  <label className="font-extrabold text-black block mb-1">{f.label}</label>
                  {f.type === "select" ? (
                    <select
                      value={form[f.name] || ""}
                      onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-red-500 font-medium text-black bg-white"
                    >
                      {f.options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={f.type || "text"}
                      placeholder={f.placeholder || ""}
                      value={form[f.name] ?? ""}
                      onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-red-500 font-medium text-black bg-white"
                    />
                  )}
                </div>
              ))}

              {/* Date Field */}
              {config.dateField && (
                <div>
                  <label className="font-extrabold text-black block mb-1">Date</label>
                  <input
                    type="date"
                    value={form.date || ""}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-red-500 font-medium text-black bg-white"
                  />
                </div>
              )}

              {/* Description */}
              <div>
                <label className="font-extrabold text-black block mb-1">Description / Content *</label>
                <textarea
                  rows={4}
                  required
                  placeholder={`Describe this ${config.itemLabel}...`}
                  value={form.description || form.content || ""}
                  onChange={(e) => setForm({ ...form, description: e.target.value, content: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-red-500 font-medium text-black bg-white"
                />
              </div>

              {/* Images & Media Section with Display Preview & Remove Image */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-black text-xs">
                    Media Attachments (Display Image &amp; Remove Option)
                  </span>
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs cursor-pointer shadow-sm transition">
                    <FiUploadCloud className="w-3.5 h-3.5" />
                    <span>Upload Image(s)</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileSelection}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Previews List */}
                {existingImages.length === 0 && newFilePreviews.length === 0 ? (
                  <div className="text-center py-6 text-slate-500 text-xs">
                    No images attached. Click "Upload Image(s)" to attach photos.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    {/* Existing Images */}
                    {existingImages.map((imgUrl, idx) => (
                      <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-300 bg-white shadow-xs">
                        <img
                          src={getContentImageUrl(imgUrl)}
                          alt={`Attachment ${idx + 1}`}
                          className="w-full h-24 object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(idx)}
                          className="absolute top-1.5 right-1.5 p-1 rounded-md bg-rose-600 text-white hover:bg-rose-700 transition cursor-pointer shadow-md"
                          title="Remove Image"
                        >
                          <FiTrash2 className="w-3.5 h-3.5" />
                        </button>
                        <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded font-bold">
                          Saved
                        </span>
                      </div>
                    ))}

                    {/* New Upload Previews */}
                    {newFilePreviews.map((previewUrl, idx) => (
                      <div key={`new-${idx}`} className="relative group rounded-xl overflow-hidden border border-red-300 bg-white shadow-xs">
                        <img
                          src={previewUrl}
                          alt={`New preview ${idx + 1}`}
                          className="w-full h-24 object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeNewFile(idx)}
                          className="absolute top-1.5 right-1.5 p-1 rounded-md bg-rose-600 text-white hover:bg-rose-700 transition cursor-pointer shadow-md"
                          title="Remove Image"
                        >
                          <FiTrash2 className="w-3.5 h-3.5" />
                        </button>
                        <span className="absolute bottom-1 left-1 bg-red-600 text-white text-[9px] px-1.5 py-0.5 rounded font-bold">
                          New
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-4 py-2.5 text-slate-700 font-bold hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !isCollectionFormDirty() || !form.title?.trim()}
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl shadow-md transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  title={!isCollectionFormDirty() ? "No changes to update" : "Save record"}
                >
                  {submitting ? "Saving..." : editingItem ? (isCollectionFormDirty() ? "Update Record" : "No Changes to Update") : "Save Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full border border-slate-200 shadow-2xl text-center space-y-4 text-black">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto text-xl border border-rose-200">
              <FiTrash2 className="w-6 h-6" />
            </div>
            <h3 className="font-black text-lg text-black">Delete {config.itemLabel || "Record"}?</h3>
            <p className="text-xs text-slate-600">
              Are you sure you want to permanently delete{" "}
              <strong>"{deleteModalItem.title || deleteModalItem.name}"</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModalItem(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDeleteConfirm}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition cursor-pointer disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Attendees / Joined Users Modal for Events */}
      {attendeesModalItem && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          onClick={() => setAttendeesModalItem(null)}
        >
          <div
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-slate-200 shadow-2xl relative text-black space-y-4 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setAttendeesModalItem(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-black hover:bg-slate-100 transition cursor-pointer"
            >
              <FiX className="w-5 h-5" />
            </button>

            <div className="shrink-0 pr-8">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold mb-2">
                <FiUsers className="w-3.5 h-3.5 text-red-600" />
                <span>Event Participants &amp; Registrations</span>
              </span>
              <h3 className="font-black text-xl text-black">
                {attendeesModalItem.title || attendeesModalItem.name}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Total Registrations: <strong className="text-red-600 font-black">{attendeesModalItem.attendees?.length || 0}</strong> • {attendeesModalItem.date ? new Date(attendeesModalItem.date).toLocaleDateString('en-IN') : 'Scheduled'} {attendeesModalItem.location ? `(${attendeesModalItem.location})` : ''}
              </p>
              {attendeesModalItem.locationAddress && (
                <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                  Venue: {attendeesModalItem.locationAddress}
                </p>
              )}
            </div>

            {/* Search Filter for Attendees */}
            <div className="relative shrink-0">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search registered attendees by name, phone, or email..."
                value={attendeeSearch}
                onChange={(e) => setAttendeeSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-red-500 text-black placeholder:text-slate-400 bg-slate-50"
              />
            </div>

            {/* Attendees List */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
              {((attendeesModalItem.attendees || []).filter((att) => {
                const q = attendeeSearch.toLowerCase();
                return (
                  (att.name || '').toLowerCase().includes(q) ||
                  (att.phone || '').toLowerCase().includes(q) ||
                  (att.email || '').toLowerCase().includes(q)
                );
              })).length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs space-y-2 bg-slate-50 rounded-2xl border border-slate-200">
                  <FiUsers className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="font-bold text-black">No attendees registered yet</p>
                  <p className="text-[11px]">When users join from the website or public events page, their details will display here.</p>
                </div>
              ) : (
                (attendeesModalItem.attendees || [])
                  .filter((att) => {
                    const q = attendeeSearch.toLowerCase();
                    return (
                      (att.name || '').toLowerCase().includes(q) ||
                      (att.phone || '').toLowerCase().includes(q) ||
                      (att.email || '').toLowerCase().includes(q)
                    );
                  })
                  .map((att, idx) => {
                    const attId = att._id || att.id || idx;
                    const cleanPhone = (att.phone || '').replace(/[^0-9]/g, '');

                    return (
                      <div
                        key={attId}
                        className="p-3.5 rounded-2xl border border-slate-200 hover:border-red-300 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-black text-sm text-black">{att.name}</span>
                            <span className="text-[10px] text-slate-400">
                              {att.registeredAt ? new Date(att.registeredAt).toLocaleDateString('en-IN') : 'Recent'}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-600 text-[11px]">
                            <span className="flex items-center gap-1 font-mono font-bold text-slate-800">
                              <FiPhone className="w-3 h-3 text-red-600" />
                              <span>{att.phone}</span>
                            </span>
                            {att.email && (
                              <span className="flex items-center gap-1">
                                <FiMail className="w-3 h-3 text-slate-400" />
                                <span>{att.email}</span>
                              </span>
                            )}
                          </div>

                          {att.message && (
                            <p className="text-[11px] text-slate-500 italic bg-white p-2 rounded-lg border border-slate-100 mt-1">
                              "{att.message}"
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                          {cleanPhone && (
                            <a
                              href={`https://wa.me/${cleanPhone}`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-[11px] font-bold transition flex items-center gap-1"
                            >
                              <span>WhatsApp</span>
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveAttendee(attendeesModalItem._id || attendeesModalItem.id, attId)}
                            disabled={removingAttendeeId === attId}
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                            title="Remove Attendee"
                          >
                            <FiTrash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setAttendeesModalItem(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- ENHANCED EVENT INSPECTION MODAL ----------------- */}
      {viewEventModalItem && (() => {
        const evt = viewEventModalItem;
        const allImages = Array.isArray(evt.images) && evt.images.length
          ? evt.images
          : evt.bannerImage ? [evt.bannerImage] : evt.image ? [evt.image] : evt.imageUrl ? [evt.imageUrl] : [];
        const currentActiveImg = allImages[activeEventImageIdx] || allImages[0];
        const attendeesCount = evt.attendees?.length || evt.attendeeCount || 0;

        return (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-3xl w-full border border-slate-200 shadow-2xl relative max-h-[90vh] overflow-y-auto text-black space-y-5">
              <button
                onClick={() => setViewEventModalItem(null)}
                className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-black hover:bg-slate-100 transition cursor-pointer"
              >
                <FiX className="w-5 h-5" />
              </button>

              {/* Title & Badges Header */}
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-red-100 text-red-700">
                    Foundation Event
                  </span>
                  {evt.date && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
                      <FiCalendar className="w-3.5 h-3.5 text-red-600" />
                      <span>{new Date(evt.date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}</span>
                    </span>
                  )}
                  {evt.time && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
                      <FiClock className="w-3.5 h-3.5 text-blue-600" />
                      <span>{evt.time}</span>
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                    <FiUsers className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{attendeesCount} Joined</span>
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-black tracking-tight">{evt.title || evt.name}</h2>
              </div>

              {/* Location & Detailed Venue Address Block */}
              {(evt.location || evt.locationAddress) && (
                <div className="p-4 rounded-2xl bg-red-50/60 border border-red-100 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    <FiMapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-red-700 block">
                      Venue &amp; Location Address
                    </span>
                    <p className="text-xs font-bold text-black mt-0.5">
                      {evt.locationAddress || evt.location}
                    </p>
                    {evt.locationAddress && evt.location && (
                      <p className="text-[11px] text-slate-600 font-medium mt-0.5">City / District: {evt.location}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Multi-Image Gallery Showcase */}
              {allImages.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                      <FiImage className="w-3.5 h-3.5 text-red-600" />
                      Event Photos ({allImages.length} Uploaded)
                    </span>
                    {allImages.length > 1 && (
                      <span className="text-[11px] font-bold text-slate-500">
                        Viewing {activeEventImageIdx + 1} of {allImages.length}
                      </span>
                    )}
                  </div>

                  {/* Main Large Image */}
                  <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 aspect-video relative shadow-inner">
                    <img
                      src={getContentImageUrl(currentActiveImg)}
                      alt="Event View"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Thumbnail Selector */}
                  {allImages.length > 1 && (
                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                      {allImages.map((img, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setActiveEventImageIdx(idx)}
                          className={`w-16 h-12 rounded-xl overflow-hidden border-2 transition shrink-0 cursor-pointer ${activeEventImageIdx === idx ? "border-red-600 ring-2 ring-red-300 scale-102" : "border-slate-200 opacity-70 hover:opacity-100"
                            }`}
                        >
                          <img
                            src={getContentImageUrl(img)}
                            alt={`Thumb ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Event Description / Agenda */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="text-[11px] font-extrabold text-black block">Event Agenda &amp; Details:</span>
                <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed font-medium">
                  {evt.description || evt.content || evt.summary || "No description provided."}
                </p>
              </div>

              {/* Attendees Quick Inspection Strip */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-black text-black block">Registered Participants</span>
                  <p className="text-[11px] text-slate-600 font-medium">
                    {attendeesCount} volunteer{attendeesCount === 1 ? "" : "s"} &amp; community members registered.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setAttendeesModalItem(evt);
                    setViewEventModalItem(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition shadow-xs cursor-pointer flex items-center gap-1.5 shrink-0"
                >
                  <FiUsers className="w-3.5 h-3.5" />
                  <span>View Full Roster</span>
                </button>
              </div>

              {/* Modal Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setViewEventModalItem(null);
                    openEditForm(evt);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
                >
                  <FiEdit2 className="w-3.5 h-3.5 text-slate-600" />
                  <span>Edit Event</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewEventModalItem(null)}
                  className="px-5 py-2 rounded-xl bg-black hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ----------------- GALLERY PREVIEW MODAL (PHOTO / VIDEO) ----------------- */}
      {galleryPreviewItem && (() => {
        const item = galleryPreviewItem;
        const isVid = isVideoItem(item);
        const ytId = isVid ? getYoutubeVideoId(item.videoUrl || item.url) : null;
        const ytEmbed = isVid ? getYoutubeEmbedUrl(item.videoUrl || item.url, true) : null;
        const mediaSrc = getContentImageUrl(item.url || item.imageUrl || item.videoUrl);

        return (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 max-w-2xl w-full border border-slate-200 shadow-2xl relative max-h-[90vh] overflow-y-auto text-black space-y-4">
              <button
                onClick={() => setGalleryPreviewItem(null)}
                className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-black hover:bg-slate-100 transition cursor-pointer z-10"
              >
                <FiX className="w-5 h-5" />
              </button>

              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${isVid ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"
                    }`}>
                    {isVid ? "Video Archive" : "Field Photo"}
                  </span>
                  {item.category && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                      {item.category}
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-black text-black">{item.title}</h2>
              </div>

              {/* Media Player or Photo */}
              <div className="rounded-2xl overflow-hidden bg-black border border-slate-200">
                {isVid ? (
                  ytId ? (
                    <div className="aspect-video">
                      <iframe
                        src={ytEmbed}
                        title={item.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="w-full h-full border-0"
                      />
                    </div>
                  ) : (
                    <video
                      src={mediaSrc}
                      controls
                      autoPlay
                      className="w-full max-h-[60vh] object-contain"
                    />
                  )
                ) : (
                  <img
                    src={mediaSrc}
                    alt={item.title}
                    className="w-full max-h-[60vh] object-contain mx-auto"
                  />
                )}
              </div>

              {/* Caption / Description */}
              {(item.caption || item.description) && (
                <p className="text-xs text-slate-700 font-medium whitespace-pre-line leading-relaxed">
                  {item.caption || item.description}
                </p>
              )}

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                {mediaSrc && (
                  <a
                    href={mediaSrc}
                    target="_blank"
                    rel="noreferrer"
                    className="text-red-600 font-bold hover:underline flex items-center gap-1 text-[11px]"
                  >
                    <span>Open Raw File in New Tab</span>
                    <FiExternalLink className="w-3 h-3" />
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setGalleryPreviewItem(null)}
                  className="px-5 py-2 rounded-xl bg-black text-white font-bold text-xs hover:bg-slate-800 transition cursor-pointer ml-auto"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Services Enhanced Inspect Modal */}
      {viewServiceModalItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-xl w-full border border-slate-200 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setViewServiceModalItem(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-black hover:bg-slate-100 transition cursor-pointer z-10"
            >
              <FiX className="w-5 h-5" />
            </button>

            {/* Banner Photo */}
            {(viewServiceModalItem.bannerImage || viewServiceModalItem.image || (Array.isArray(viewServiceModalItem.images) && viewServiceModalItem.images[0])) ? (
              <div className="w-full h-48 sm:h-56 rounded-2xl overflow-hidden mb-4 border border-slate-200 relative bg-slate-100">
                <img
                  src={getContentImageUrl(viewServiceModalItem.bannerImage || viewServiceModalItem.image || viewServiceModalItem.images[0])}
                  alt={viewServiceModalItem.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/95 text-red-600 backdrop-blur-sm shadow-sm">
                    {viewServiceModalItem.category || "Social Service"}
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold backdrop-blur-sm shadow-sm ${
                    (viewServiceModalItem.status || "Active").toLowerCase() === "active"
                      ? "bg-emerald-500/90 text-white"
                      : "bg-amber-500/90 text-white"
                  }`}>
                    ● {viewServiceModalItem.status || "Active"}
                  </span>
                </div>
              </div>
            ) : null}

            <div className="space-y-4">
              <div>
                <span className="text-[11px] font-bold text-red-600 uppercase tracking-wider">
                  Service Initiative #{viewServiceModalItem.order || 1}
                </span>
                <h2 className="text-xl font-black text-black mt-0.5 leading-snug">
                  {viewServiceModalItem.title}
                </h2>
              </div>

              <div>
                <h4 className="text-xs font-extrabold text-black uppercase tracking-wider mb-1.5">Description & Scope</h4>
                <p className="text-xs text-slate-700 font-medium leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                  {viewServiceModalItem.description || viewServiceModalItem.content || "No detailed description provided."}
                </p>
              </div>

              {/* Key Highlights / Features */}
              {Array.isArray(viewServiceModalItem.features) && viewServiceModalItem.features.length > 0 && (
                <div>
                  <h4 className="text-xs font-extrabold text-black uppercase tracking-wider mb-2">Key Highlights & Offerings</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {viewServiceModalItem.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 p-2.5 rounded-xl bg-red-50/50 border border-red-100 text-xs text-slate-800">
                        <FiCheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="font-semibold">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                <a
                  href="/services"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold transition"
                >
                  <FiExternalLink className="w-3.5 h-3.5" />
                  <span>View on Public Site</span>
                </a>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const itm = viewServiceModalItem;
                      setViewServiceModalItem(null);
                      openEditForm(itm);
                    }}
                    className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition cursor-pointer"
                  >
                    Edit Service
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewServiceModalItem(null)}
                    className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold transition cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Blogs Enhanced Inspect Modal */}
      {viewBlogModalItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-xl w-full border border-slate-200 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setViewBlogModalItem(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-black hover:bg-slate-100 transition cursor-pointer z-10"
            >
              <FiX className="w-5 h-5" />
            </button>

            {/* Banner Photo */}
            {(viewBlogModalItem.bannerImage || viewBlogModalItem.image || viewBlogModalItem.imageUrl || (Array.isArray(viewBlogModalItem.images) && viewBlogModalItem.images[0])) ? (
              <div className="w-full h-48 sm:h-56 rounded-2xl overflow-hidden mb-4 border border-slate-200 relative bg-slate-100">
                <img
                  src={getContentImageUrl(viewBlogModalItem.bannerImage || viewBlogModalItem.image || viewBlogModalItem.imageUrl || viewBlogModalItem.images[0])}
                  alt={viewBlogModalItem.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white backdrop-blur-sm shadow-sm flex items-center gap-1.5">
                    🏷️ {getItemCategory(viewBlogModalItem) || "News"}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-black/75 text-white backdrop-blur-sm shadow-sm">
                    ✍️ {viewBlogModalItem.author || "संपादक"}
                  </span>
                </div>
              </div>
            ) : null}

            <div className="space-y-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Category: {getItemCategory(viewBlogModalItem) || "News"}
                  </span>
                  {viewBlogModalItem.date && (
                    <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                      <FiCalendar className="w-3.5 h-3.5 text-slate-400" />
                      {new Date(viewBlogModalItem.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-black text-black mt-1 leading-snug">
                  {viewBlogModalItem.title}
                </h2>
              </div>

              {/* Tags Array Display */}
              {Array.isArray(viewBlogModalItem.tags) && viewBlogModalItem.tags.length > 0 && (
                <div>
                  <h4 className="text-xs font-extrabold text-black uppercase tracking-wider mb-1.5">Tags</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {viewBlogModalItem.tags.map((tg, idx) => (
                      <span key={idx} className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        #{tg}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-xs font-extrabold text-black uppercase tracking-wider mb-1.5">Article Content</h4>
                <p className="text-xs text-slate-700 font-medium leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200 whitespace-pre-line">
                  {viewBlogModalItem.content || viewBlogModalItem.description || viewBlogModalItem.summary || "No content provided."}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                <a
                  href={`/blogs/${viewBlogModalItem._id || viewBlogModalItem.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold transition"
                >
                  <FiExternalLink className="w-3.5 h-3.5" />
                  <span>View on Public Site</span>
                </a>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const itm = viewBlogModalItem;
                      setViewBlogModalItem(null);
                      openEditForm(itm);
                    }}
                    className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition cursor-pointer"
                  >
                    Edit Article
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewBlogModalItem(null)}
                    className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold transition cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
