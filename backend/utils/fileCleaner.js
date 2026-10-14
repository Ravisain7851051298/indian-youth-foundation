const path = require('path');
const fs = require('fs');

const uploadDir = path.resolve(__dirname, '..', 'uploads');

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Supported category folders
const VALID_CATEGORIES = new Set([
  'avatars',
  'applications',
  'payments',
  'documents',
  'certificates',
  'campaigns',
  'gallery',
  'news',
  'settings',
  'general'
]);

// Map common aliases to canonical folder names
const CATEGORY_ALIASES = {
  profile: 'avatars',
  avatar: 'avatars',
  user: 'avatars',
  users: 'avatars',
  team: 'avatars',
  member: 'applications',
  members: 'applications',
  membership: 'applications',
  volunteer: 'applications',
  volunteers: 'applications',
  idproof: 'applications',
  payment: 'payments',
  payments: 'payments',
  screenshot: 'payments',
  receipt: 'payments',
  donation: 'payments',
  donations: 'payments',
  document: 'documents',
  documents: 'documents',
  audit: 'documents',
  audits: 'documents',
  grievance: 'documents',
  complaint: 'documents',
  certificate: 'certificates',
  certificates: 'certificates',
  campaign: 'campaigns',
  campaigns: 'campaigns',
  event: 'campaigns',
  events: 'campaigns',
  gallery: 'gallery',
  news: 'news',
  setting: 'settings',
  settings: 'settings',
  logo: 'settings'
};

/**
 * Sanitize and validate category folder name
 */
function sanitizeCategory(rawCategory) {
  if (!rawCategory || typeof rawCategory !== 'string') {
    return 'general';
  }
  const clean = rawCategory.toLowerCase().trim().replace(/[^a-z0-9_-]/g, '');
  if (CATEGORY_ALIASES[clean]) {
    return CATEGORY_ALIASES[clean];
  }
  if (VALID_CATEGORIES.has(clean)) {
    return clean;
  }
  return 'general';
}

/**
 * Ensures a categorized folder exists inside the uploads directory
 */
function ensureCategoryDir(category) {
  const safeCategory = sanitizeCategory(category);
  const targetDir = path.join(uploadDir, safeCategory);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  return { category: safeCategory, dir: targetDir };
}

/**
 * Pre-creates all standard category folders on application startup
 */
function ensureAllCategoryDirs() {
  VALID_CATEGORIES.forEach(cat => {
    const dir = path.join(uploadDir, cat);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

/**
 * Deletes a file given its URL or relative path inside uploads
 * @param {string} fileUrl e.g. "/uploads/payments/rec-123.png" or "payments/rec-123.png"
 * @returns {Promise<boolean>} true if deleted, false if not found or skipped
 */
async function deleteFileByUrl(fileUrl) {
  if (!fileUrl || typeof fileUrl !== 'string') return false;

  // Skip external URLs (e.g. cloudinary, unsplash, qrserver)
  if (fileUrl.startsWith('http://') || fileUrl.startsWith('https://')) {
    const uploadsIndex = fileUrl.indexOf('/uploads/');
    if (uploadsIndex === -1) {
      return false;
    }
    fileUrl = fileUrl.substring(uploadsIndex);
  }

  // Normalize path removing leading /uploads or uploads/
  let relativePath = fileUrl.replace(/^[/\\]*uploads[/\\]*/i, '');
  if (!relativePath) return false;

  // Resolve absolute path and prevent directory traversal
  const targetPath = path.resolve(uploadDir, relativePath);

  // Security guard: target must strictly be inside uploadDir
  if (!targetPath.startsWith(uploadDir)) {
    console.warn(`⚠️ [FileCleaner] Path traversal attempt blocked: "${fileUrl}" -> "${targetPath}"`);
    return false;
  }

  try {
    const exists = await fs.promises.access(targetPath, fs.constants.F_OK).then(() => true).catch(() => false);
    if (exists) {
      await fs.promises.unlink(targetPath);
      console.log(`🗑️ [FileCleaner] Deleted file: ${relativePath}`);
      return true;
    }
  } catch (err) {
    console.error(`⚠️ [FileCleaner] Failed to delete file at "${targetPath}":`, err.message);
  }
  return false;
}

/**
 * Recursively scans any object/document and deletes any uploaded files found
 * @param {object} doc Mongoose document or plain object
 * @returns {Promise<number>} number of files deleted
 */
async function deleteDocumentFiles(doc) {
  if (!doc) return 0;

  const data = (doc && typeof doc.toObject === 'function') ? doc.toObject() : doc;
  const urlsToDelete = new Set();

  function scan(val) {
    if (!val) return;
    if (typeof val === 'string') {
      // Check if it looks like an uploads path
      if (val.includes('/uploads/') || val.startsWith('uploads/') || /^[a-z0-9_-]+\/[a-z0-9_.-]+\.[a-z0-9]+$/i.test(val)) {
        urlsToDelete.add(val);
      }
    } else if (Array.isArray(val)) {
      val.forEach(scan);
    } else if (typeof val === 'object') {
      for (const key of Object.keys(val)) {
        // Skip mongo internal properties
        if (key === '_id' || key === '__v') continue;
        scan(val[key]);
      }
    }
  }

  scan(data);

  let deletedCount = 0;
  for (const url of urlsToDelete) {
    const success = await deleteFileByUrl(url);
    if (success) deletedCount++;
  }
  return deletedCount;
}

module.exports = {
  uploadDir,
  VALID_CATEGORIES,
  sanitizeCategory,
  ensureCategoryDir,
  ensureAllCategoryDirs,
  deleteFileByUrl,
  deleteDocumentFiles
};
