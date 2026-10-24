const path = require('path');
const fs = require('fs');

const uploadDir = path.resolve(__dirname, '..', 'uploads');

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Supported category folders
const VALID_CATEGORIES = new Set([
  'profiles',
  'documents',
  'payments',
  'certificates',
  'campaigns',
  'gallery',
  'blogs',
  'settings',
  'complaints',
  'general',
  // Backward compatibility aliases
  'avatars',
  'applications',
  'news'
]);

// Map common aliases to canonical folder names
const CATEGORY_ALIASES = {
  // Profiles category aliases (profile pictures, avatars, coordinator photos, team photos)
  profile: 'profiles',
  profiles: 'profiles',
  avatar: 'profiles',
  avatars: 'profiles',
  user: 'profiles',
  users: 'profiles',
  photo: 'profiles',
  photos: 'profiles',
  photourl: 'profiles',
  userimage: 'profiles',
  team: 'profiles',
  memberphoto: 'profiles',
  coordinatorphoto: 'profiles',

  // Documents category aliases (KYC, idproofs, aadhaar, pan, voter, certificates of reg, bylaws)
  document: 'documents',
  documents: 'documents',
  doc: 'documents',
  docs: 'documents',
  documentfront: 'documents',
  documentback: 'documents',
  front: 'documents',
  back: 'documents',
  idproof: 'documents',
  idproofs: 'documents',
  kyc: 'documents',
  idprooffront: 'documents',
  idproofback: 'documents',
  application: 'documents',
  applications: 'documents',
  membership: 'documents',
  audit: 'documents',
  audits: 'documents',
  orgdocument: 'documents',
  orgdocuments: 'documents',

  // Payments category aliases (payment screenshots, donation proofs, fees, transaction receipts)
  payment: 'payments',
  payments: 'payments',
  paymentscreenshot: 'payments',
  screenshot: 'payments',
  screenshots: 'payments',
  receipt: 'payments',
  receipts: 'payments',
  donation: 'payments',
  donations: 'payments',
  fee: 'payments',
  fees: 'payments',
  utr: 'payments',
  transaction: 'payments',

  // Certificates category aliases
  certificate: 'certificates',
  certificates: 'certificates',
  award: 'certificates',
  awards: 'certificates',
  badge: 'certificates',

  // Campaigns & Events category aliases
  campaign: 'campaigns',
  campaigns: 'campaigns',
  event: 'campaigns',
  events: 'campaigns',
  program: 'campaigns',
  programs: 'campaigns',

  // Gallery category aliases
  gallery: 'gallery',
  galleries: 'gallery',
  media: 'gallery',
  video: 'gallery',
  videos: 'gallery',

  // Blogs & News category aliases
  blog: 'blogs',
  blogs: 'blogs',
  news: 'blogs',
  story: 'blogs',
  stories: 'blogs',

  // Settings category aliases (NGO logo, official seal, president signature, upi qr)
  setting: 'settings',
  settings: 'settings',
  logo: 'settings',
  seal: 'settings',
  signature: 'settings',
  officialseal: 'settings',
  presidentsignature: 'settings',
  qr: 'settings',
  qrcode: 'settings',
  upiqr: 'settings',
  upiqrimage: 'settings',

  // Complaints / Grievances category aliases
  complaint: 'complaints',
  complaints: 'complaints',
  grievance: 'complaints',
  grievances: 'complaints',

  // Fallback
  general: 'general'
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
 * Scans an object or document and returns a Set of file URL paths stored in uploads
 * @param {object} doc Mongoose document or plain object
 * @returns {Set<string>}
 */
function extractFileUrls(doc) {
  const urls = new Set();
  if (!doc) return urls;
  const data = (doc && typeof doc.toObject === 'function') ? doc.toObject() : doc;

  function scan(val) {
    if (!val) return;
    if (typeof val === 'string') {
      const trimmed = val.trim();
      if (trimmed.includes('/uploads/') || trimmed.startsWith('uploads/') || /^[a-z0-9_-]+\/[a-z0-9_.-]+\.[a-z0-9]+$/i.test(trimmed)) {
        urls.add(trimmed);
      }
    } else if (Array.isArray(val)) {
      val.forEach(scan);
    } else if (typeof val === 'object') {
      for (const key of Object.keys(val)) {
        if (key === '_id' || key === '__v') continue;
        scan(val[key]);
      }
    }
  }

  scan(data);
  return urls;
}

/**
 * Recursively scans any object/document and deletes any uploaded files found
 * @param {object} doc Mongoose document or plain object
 * @returns {Promise<number>} number of files deleted
 */
async function deleteDocumentFiles(doc) {
  if (!doc) return 0;
  const urlsToDelete = extractFileUrls(doc);

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
  extractFileUrls,
  deleteDocumentFiles
};
