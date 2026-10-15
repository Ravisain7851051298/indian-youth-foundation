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
  FiUploadCloud
} from "react-icons/fi";
import { CONTENT_COLLECTIONS } from "@/constants/dashboard";
import api from "@/services/api";
import { getContentImageUrl } from "@/lib/authApi";

export default function ContentCollection({ resource }) {
  const config = CONTENT_COLLECTIONS[resource] || CONTENT_COLLECTIONS.blogs;
  const endpoint = config.endpoint || resource;

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteModalItem, setDeleteModalItem] = useState(null);
  const [deleting, setDeleting] = useState(false);

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
    setForm(getEmptyForm());
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
        initialForm[f.name] = item[f.name] ?? (f.type === "select" && f.options?.length ? f.options[0] : "");
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
    setExistingImages(imgs.filter(Boolean));
    setNewFiles([]);
    setNewFilePreviews([]);
    setFormError("");
    setFormOpen(true);
  }

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

    setNewFiles((prev) => [...prev, ...files]);

    const previews = files.map((file) => URL.createObjectURL(file));
    setNewFilePreviews((prev) => [...prev, ...previews]);
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
        author: form.author || "संपादक, भारतीय युवा क्रांति"
      };

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

  const filteredItems = items.filter((item) => {
    const q = searchQuery.toLowerCase();
    const title = (item.title || item.name || "").toLowerCase();
    const desc = (item.description || item.content || item.summary || "").toLowerCase();
    return title.includes(q) || desc.includes(q);
  });

  return (
    <div className="space-y-4">
      {/* Top Header Card */}
      <div className="bg-white p-4 rounded-b-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
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
      <div className="bg-white mx-3 p-1 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder={`Search ${config.title.toLowerCase()}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-red-500 text-black placeholder:text-slate-400"
          />
        </div>
        <div className="bg-red-500 rounded-xl px-5 py-2 flex items-center text-xs font-bold text-white pr-3">
          Total Records: <span className="ml-2">{filteredItems.length}</span>
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
            <p className="font-semibold text-black">No {config.title.toLowerCase()} found.</p>
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
                  {config.customFields?.slice(0, 2).map((f) => (
                    <th key={f.name} className="py-3 px-3.5">{f.label}</th>
                  ))}
                  {config.dateField && <th className="py-3 px-3.5">Date</th>}
                  <th className="py-3 px-3.5 text-right sticky right-0 bg-slate-50 z-20 shadow-[-6px_0_10px_-2px_rgba(0,0,0,0.06)]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-black">
                {filteredItems.map((item) => {
                  const id = item._id || item.id;
                  const thumb = item.bannerImage || (Array.isArray(item.images) && item.images[0]) || item.image || item.imageUrl || item.url;
                  return (
                    <tr key={id} className="group hover:bg-slate-50/80 transition">
                      <td className="py-3 px-3.5">
                        {thumb ? (
                          <img
                            src={getContentImageUrl(thumb)}
                            alt={item.title || "Item"}
                            className="w-12 h-12 object-cover rounded-xl border border-slate-200"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 text-xs font-bold border border-slate-200">
                            N/A
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-3.5">
                        <div className="font-extrabold text-black text-sm">{item.title || item.name}</div>
                        <div className="text-[11px] text-slate-600 line-clamp-1 mt-0.5">
                          {item.description || item.content || item.summary || item.bio}
                        </div>
                      </td>
                      {config.customFields?.slice(0, 2).map((f) => (
                        <td key={f.name} className="py-3 px-3.5 text-slate-800 font-semibold">
                          {String(item[f.name] ?? "-")}
                        </td>
                      ))}
                      {config.dateField && (
                        <td className="py-3 px-3.5 text-slate-700 font-medium whitespace-nowrap">
                          {item.date ? new Date(item.date).toLocaleDateString("en-IN") : "-"}
                        </td>
                      )}
                      <td className="py-3 px-3.5 text-right whitespace-nowrap sticky right-0 bg-white group-hover:bg-slate-50 z-10 shadow-[-6px_0_10px_-2px_rgba(0,0,0,0.06)]">
                        <div className="flex items-center justify-end gap-1.5">
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
                  disabled={submitting}
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl shadow-md transition cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {submitting ? "Saving..." : editingItem ? "Update Record" : "Save Record"}
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
    </div>
  );
}
