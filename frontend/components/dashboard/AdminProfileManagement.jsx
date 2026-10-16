"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  FiCamera,
  FiCheckCircle,
  FiEdit2,
  FiKey,
  FiMail,
  FiPhone,
  FiShield,
  FiTrash2,
  FiUser,
  FiX,
  FiSave
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNGO } from "@/context/NGOContext";
import { updateUserProfile, uploadAndUpdateAvatar } from "@/store/authSlice";
import { getContentImageUrl } from "@/lib/authApi";

export default function AdminProfileManagement() {
  const dispatch = useDispatch();
  const { currentUser, setCurrentUser } = useNGO();
  const reduxUser = useSelector((state) => state.auth?.user);
  const effectiveUser = reduxUser || currentUser;

  const [form, setForm] = useState({
    name: effectiveUser?.name || "",
    email: effectiveUser?.email || "",
    phone: effectiveUser?.phone || "",
    photoUrl: effectiveUser?.photoUrl || ""
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (effectiveUser) {
      setForm((prev) => ({
        ...prev,
        name: effectiveUser.name || prev.name,
        email: effectiveUser.email || prev.email,
        phone: effectiveUser.phone || prev.phone,
        photoUrl: effectiveUser.photoUrl !== undefined ? effectiveUser.photoUrl : prev.photoUrl
      }));
    }
  }, [effectiveUser]);

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));

      const resultAction = await dispatch(uploadAndUpdateAvatar({ file, category: 'avatars' }));
      if (uploadAndUpdateAvatar.fulfilled.match(resultAction)) {
        const updated = resultAction.payload;
        setForm((prev) => ({ ...prev, photoUrl: updated.photoUrl }));
        if (setCurrentUser) setCurrentUser(updated);
        toast.success("Avatar uploaded and saved in real-time!");
      } else {
        toast.error(resultAction.payload || "Avatar upload failed");
      }
    } catch (err) {
      toast.error("Avatar upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    setAvatarFile(null);
    setAvatarPreview("");
    setForm((prev) => ({ ...prev, photoUrl: "" }));
    try {
      setSaving(true);
      const resultAction = await dispatch(updateUserProfile({ photoUrl: "" }));
      if (updateUserProfile.fulfilled.match(resultAction)) {
        const updated = resultAction.payload;
        if (setCurrentUser) setCurrentUser(updated);
        toast.success("Profile photo removed successfully!");
      }
    } catch (err) {
      toast.error("Failed to remove avatar");
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const resultAction = await dispatch(updateUserProfile(form));
      if (updateUserProfile.fulfilled.match(resultAction)) {
        const updated = resultAction.payload;
        toast.success("Admin profile updated successfully!");
        if (setCurrentUser) {
          setCurrentUser(updated);
        }
      } else {
        toast.error(resultAction.payload || "Failed to update profile");
      }
    } catch (err) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border-b border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold mb-2">
            <FiShield className="w-3.5 h-3.5" />
            <span>Administrator Credentials</span>
          </div>
          <h1 className="text-2xl font-black text-black tracking-tight">Trustee Administrator Profile</h1>
          <p className="text-xs text-slate-700 mt-1">
            Manage your personal administrative contact details, profile photograph, and account security.
          </p>
        </div>
      </div>

      <div className="max-w-2xl bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm text-black">
        <form onSubmit={handleSave} className="space-y-6 text-xs text-black">
          {/* Avatar with Display Preview & Remove Image */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-6 pb-6 border-b border-slate-100">
            <div className="relative w-24 h-24 shrink-0">
              <img
                src={avatarPreview || getContentImageUrl(form.photoUrl || effectiveUser?.photoUrl) || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300"}
                alt={form.name || effectiveUser?.name || "Admin"}
                className="w-24 h-24 rounded-2xl object-cover border-2 border-red-500 shadow-md"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300";
                }}
              />
              <label className="absolute -bottom-2 -right-2 p-2 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg cursor-pointer transition">
                <FiCamera className="w-3.5 h-3.5" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-extrabold text-black">Trustee Profile Photograph</h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                {uploading ? "Uploading photo..." : "Upload your official profile picture displayed on the admin bar."}
              </p>
              {(avatarPreview || form.photoUrl) && (
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white border border-rose-200 text-xs font-bold transition cursor-pointer"
                >
                  <FiTrash2 className="w-3.5 h-3.5" />
                  <span>Remove Avatar</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-extrabold text-black block mb-1">Full Legal Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-red-500 font-medium text-black bg-white"
              />
            </div>

            <div>
              <label className="font-extrabold text-black block mb-1">Registered Email</label>
              <input
                type="email"
                disabled
                value={form.email}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-100 font-medium text-slate-700 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="font-extrabold text-black block mb-1">Contact Phone</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-red-500 font-medium text-black bg-white"
              />
            </div>

            <div>
              <label className="font-extrabold text-black block mb-1">Assigned Role</label>
              <input
                type="text"
                disabled
                value={currentUser?.role || "Admin"}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-100 font-bold text-red-700 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl shadow-md transition cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              <FiSave className="w-4 h-4" />
              <span>{saving ? "Saving Changes..." : "Save Profile"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
