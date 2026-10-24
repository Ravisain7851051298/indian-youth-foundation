const multer = require('multer');
const path = require('path');
const { uploadDir, ensureCategoryDir, sanitizeCategory } = require('../utils/fileCleaner');

/**
 * Intelligent categorized disk storage engine for Multer
 * Stores files into their dedicated semantic category folders:
 * - /uploads/profiles     (Profile pictures, coordinator photos, avatars, user photos)
 * - /uploads/documents    (KYC documents, Aadhaar, PAN, ID proofs, audit reports)
 * - /uploads/payments     (Payment screenshots, transaction receipts, fee proofs)
 * - /uploads/certificates (Award certificates, membership certificates)
 * - /uploads/campaigns    (Campaign banners, event posters, flyers)
 * - /uploads/gallery      (Photo & video gallery media)
 * - /uploads/blogs        (Blog & news cover images)
 * - /uploads/settings     (NGO logo, official seal, president signature, UPI QR)
 * - /uploads/complaints   (Citizen grievances, complaint evidence)
 * - /uploads/general      (Miscellaneous files)
 */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // 1. Explicit Category from Route parameter, Query string, Custom Headers, or Body
    let rawCategory = req.params?.category
      || req.query?.category
      || req.headers?.['x-upload-category']
      || req.headers?.['x-category']
      || req.body?.category;

    // 2. Fieldname detection (e.g. photoUrl, documentFront, paymentScreenshot)
    const fn = (file.fieldname || '').toLowerCase();
    if (!rawCategory || rawCategory === 'general' || rawCategory === 'file' || rawCategory === 'files') {
      if (fn.includes('photo') || fn.includes('avatar') || fn.includes('profile') || fn === 'userimage' || fn === 'userphoto') {
        rawCategory = 'profiles';
      } else if (
        fn.includes('front') ||
        fn.includes('back') ||
        fn.includes('document') ||
        fn.includes('doc') ||
        fn.includes('idproof') ||
        fn.includes('kyc') ||
        fn.includes('aadhaar') ||
        fn.includes('pan') ||
        fn.includes('audit')
      ) {
        rawCategory = 'documents';
      } else if (
        fn.includes('payment') ||
        fn.includes('screenshot') ||
        fn.includes('receipt') ||
        fn.includes('donation') ||
        fn.includes('fee') ||
        fn.includes('utr') ||
        fn.includes('slip')
      ) {
        rawCategory = 'payments';
      } else if (fn.includes('certificate') || fn.includes('award') || fn.includes('badge')) {
        rawCategory = 'certificates';
      } else if (fn.includes('logo') || fn.includes('seal') || fn.includes('signature') || fn.includes('qr')) {
        rawCategory = 'settings';
      } else if (fn.includes('complaint') || fn.includes('grievance')) {
        rawCategory = 'complaints';
      } else if (fn.includes('gallery') || fn.includes('media')) {
        rawCategory = 'gallery';
      } else if (fn.includes('campaign') || fn.includes('event')) {
        rawCategory = 'campaigns';
      } else if (fn.includes('blog') || fn.includes('news') || fn.includes('story')) {
        rawCategory = 'blogs';
      }
    }

    // 3. Intelligent detection from original filename
    const orig = (file.originalname || '').toLowerCase();
    if (!rawCategory || rawCategory === 'general' || rawCategory === 'file' || rawCategory === 'files') {
      if (/photo|avatar|profile|passport|headshot|selfie/i.test(orig)) {
        rawCategory = 'profiles';
      } else if (/payment|screenshot|receipt|slip|challan|utr|upi|txn/i.test(orig)) {
        rawCategory = 'payments';
      } else if (/aadhaar|aadhar|pan|voter|kyc|idproof|marksheet|degree|bylaw|audit|report/i.test(orig)) {
        rawCategory = 'documents';
      } else if (/certificate|award|sanad|praman/i.test(orig)) {
        rawCategory = 'certificates';
      } else if (/logo|seal|signature|stamp/i.test(orig)) {
        rawCategory = 'settings';
      } else if (/complaint|evidence|grievance/i.test(orig)) {
        rawCategory = 'complaints';
      }
    }

    // 4. Contextual detection from request URL
    const url = (req.originalUrl || req.url || '').toLowerCase();
    if (!rawCategory || rawCategory === 'general' || rawCategory === 'file' || rawCategory === 'files') {
      if (url.includes('/coordinator') || url.includes('/member') || url.includes('/volunteer') || url.includes('/user')) {
        rawCategory = file.mimetype && file.mimetype.includes('pdf') ? 'documents' : 'profiles';
      } else if (url.includes('/setting')) {
        rawCategory = 'settings';
      } else if (url.includes('/donation')) {
        rawCategory = 'payments';
      } else if (url.includes('/certificate') || url.includes('/award')) {
        rawCategory = 'certificates';
      } else if (url.includes('/complaint') || url.includes('/grievance')) {
        rawCategory = 'complaints';
      } else if (url.includes('/gallery')) {
        rawCategory = 'gallery';
      } else if (url.includes('/event') || url.includes('/campaign')) {
        rawCategory = 'campaigns';
      } else if (url.includes('/blog') || url.includes('/news')) {
        rawCategory = 'blogs';
      }
    }

    if (!rawCategory) rawCategory = 'general';

    const { category, dir } = ensureCategoryDir(rawCategory);
    file.category = category;
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const rawName = file.originalname || 'upload.png';
    const cleanName = rawName.replace(/[^a-zA-Z0-9.]/g, '_');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e5);
    const ext = path.extname(cleanName) || '.png';
    const baseName = path.basename(cleanName, ext).substring(0, 40) || 'file';
    cb(null, `${baseName}-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  // Allowed extensions for NGO operations: images, videos, PDFs, office docs
  const allowedExts = /\.(jpg|jpeg|png|webp|svg|gif|pdf|doc|docx|xls|xlsx|mp4|webm|mov|mkv|avi|3gp)$/i;
  const allowedMimes = /^(image\/(jpeg|png|webp|svg\+xml|gif)|video\/(mp4|webm|quicktime|x-msvideo|x-matroska|3gpp)|application\/(pdf|msword|vnd\.openxmlformats-officedocument\.wordprocessingml\.document|vnd\.ms-excel|vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet))$/i;

  if (file.originalname.match(allowedExts) || file.mimetype.match(allowedMimes)) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type: ${file.originalname}. Allowed: Images (JPG, PNG, WEBP), Videos (MP4, WEBM, MOV), PDFs, and Documents.`), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { 
    fileSize: 60 * 1024 * 1024 // 60MB max file size for videos and documents
  },
  fileFilter: fileFilter
});

/**
 * Middleware that seamlessly accepts optional file upload(s) in the same API request.
 * Automatically handles both JSON and multipart/form-data.
 * Sets req.body.photoUrl, req.body.documentFront, req.body.documentBack, req.body.paymentScreenshot, etc.
 */
const handleOptionalFileUpload = (req, res, next) => {
  upload.any()(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ success: false, message: 'Uploaded file exceeds 60MB limit' });
        }
        return res.status(400).json({ success: false, message: `Upload error: ${err.message}` });
      }
      return res.status(400).json({ success: false, message: err.message || 'File upload rejected' });
    }

    if (req.files && req.files.length > 0) {
      // Safeguard: Deduplicate files in the same request (e.g. if form appended same file under 'file' & 'photo')
      const uniqueFiles = [];
      const seenFingerprints = new Set();

      req.files.forEach((f) => {
        const fingerprint = `${f.originalname || ''}_${f.size || 0}`;
        if (seenFingerprints.has(fingerprint)) {
          // Unlink redundant duplicate copy from disk immediately
          try {
            if (f.path && fs.existsSync(f.path)) {
              fs.unlinkSync(f.path);
            }
          } catch (e) {
            console.error('Error unlinking duplicate uploaded file:', e);
          }
        } else {
          seenFingerprints.add(fingerprint);
          uniqueFiles.push(f);
        }
      });

      req.files = uniqueFiles;
      req.file = uniqueFiles[0];

      req.files.forEach((f) => {
        const cat = f.category || 'general';
        const fileUrl = `/uploads/${cat}/${f.filename}`;
        const fname = (f.fieldname || '').toLowerCase();

        if (fname.includes('photo') || fname.includes('avatar') || fname === 'userimage' || fname === 'profile') {
          req.body.photoUrl = fileUrl;
        } else if (fname.includes('front') || fname === 'documentfront' || fname === 'idprooffront') {
          req.body.documentFront = fileUrl;
          if (!req.body.idProofUrl) req.body.idProofUrl = fileUrl;
          if (!req.body.idProofDocument) req.body.idProofDocument = fileUrl;
        } else if (fname.includes('back') || fname === 'documentback' || fname === 'idproofback') {
          req.body.documentBack = fileUrl;
        } else if (fname.includes('payment') || fname.includes('screenshot') || fname === 'receipt') {
          req.body.paymentScreenshot = fileUrl;
        } else if (fname.includes('idproof') || fname.includes('document')) {
          if (!req.body.documentFront) req.body.documentFront = fileUrl;
          if (!req.body.idProofUrl) req.body.idProofUrl = fileUrl;
          if (!req.body.idProofDocument) req.body.idProofDocument = fileUrl;
        } else {
          if (!req.body.fileUrl) req.body.fileUrl = fileUrl;
        }
      });

      // Backward compatibility fallback for single file upload without specific fieldname
      if (req.files.length === 1) {
        const defaultUrl = `/uploads/${req.file.category || 'general'}/${req.file.filename}`;
        if (!req.body.idProofUrl && !req.body.idProofDocument && !req.body.documentFront) {
          req.body.idProofUrl = defaultUrl;
          req.body.idProofDocument = defaultUrl;
          req.body.documentFront = defaultUrl;
        }
        if (!req.body.paymentScreenshot && !req.body.screenshot) {
          req.body.paymentScreenshot = defaultUrl;
        }
        if (!req.body.fileUrl) {
          req.body.fileUrl = defaultUrl;
        }
      }
    }
    next();
  });
};

module.exports = {
  upload,
  uploadDir,
  handleOptionalFileUpload
};
