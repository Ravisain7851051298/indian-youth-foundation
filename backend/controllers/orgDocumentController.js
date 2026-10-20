const OrganizationDocument = require('../models/OrganizationDocument');
const Setting = require('../models/Setting');

// Default verified organization documents seed
const SEED_DOCUMENTS = [
  {
    title: 'Section 12A Tax Exemption Registration Certificate',
    titleHi: 'आयकर धारा 12ए कर छूट पंजीकरण प्रमाण पत्र',
    category: '12A Registration',
    documentNumber: 'CIT(EXEMP)/12A/2021-22/A-492',
    issuingAuthority: 'Office of Commissioner of Income Tax (Exemptions), Govt. of India',
    issueDate: new Date('2021-08-15'),
    validity: 'Permanent / Perpetual Registration',
    fileUrl: '/uploads/documents/12a-certificate-sample.pdf',
    fileType: 'pdf',
    fileSize: '1.4 MB',
    description: 'Statutory registration granting perpetual tax exemption on all charitable organization income and contributions.',
    status: 'Verified',
    order: 1
  },
  {
    title: 'Section 80G Donor Tax Deduction Approval Order',
    titleHi: 'आयकर धारा 80जी दानदाता 50% कर छूट स्वीकृति आदेश',
    category: '80G Exemption',
    documentNumber: 'CIT(EXEMP)/80G/2021-22/G-881',
    issuingAuthority: 'Income Tax Department, Ministry of Finance, Govt. of India',
    issueDate: new Date('2021-09-01'),
    validity: 'Perpetual (AY 2022-23 Onwards)',
    fileUrl: '/uploads/documents/80g-certificate-sample.pdf',
    fileType: 'pdf',
    fileSize: '1.2 MB',
    description: 'Enables individual and corporate donors to claim 50% tax deductions under Section 80G of the Income Tax Act on all contributions.',
    status: 'Verified',
    order: 2
  },
  {
    title: 'NITI Aayog NGO Darpan Unique Accreditation ID',
    titleHi: 'नीति आयोग एनजीओ दर्पण मान्यता प्रमाण पत्र',
    category: 'NITI Aayog Darpan',
    documentNumber: 'RJ/2022/0319482',
    issuingAuthority: 'NITI Aayog, Government of India',
    issueDate: new Date('2022-03-19'),
    validity: 'Active & Verified on Govt. Portal',
    fileUrl: '/uploads/documents/niti-aayog-certificate.pdf',
    fileType: 'pdf',
    fileSize: '950 KB',
    description: 'National NGO Darpan unique identifier certifying eligibility for Central & State Government grant partnerships.',
    status: 'Verified',
    order: 3
  },
  {
    title: 'Official Trust Deed & Foundation Registration Order',
    titleHi: 'संस्था न्यास विलेख एवं पंजीकरण प्रमाण पत्र',
    category: 'Trust Registration',
    documentNumber: 'REG/421/2019/DEL',
    issuingAuthority: 'Office of Sub-Registrar of Trusts, Government of India',
    issueDate: new Date('2019-06-10'),
    validity: 'Perpetual Legal Entity',
    fileUrl: '/uploads/documents/trust-deed-registration.pdf',
    fileType: 'pdf',
    fileSize: '2.8 MB',
    description: 'Founding statutory charter and trust deed establishing Yuva Kranti Dal (युवा क्रांति दल).',
    status: 'Verified',
    order: 4
  },
  {
    title: 'Ministry of Corporate Affairs (MCA) CSR-1 Registration',
    titleHi: 'कॉर्पोरेट कार्य मंत्रालय सीएसआर-1 पंजीकरण',
    category: 'CSR-1 Filing',
    documentNumber: 'CSR00049281',
    issuingAuthority: 'Ministry of Corporate Affairs, Office of the Registrar of Companies',
    issueDate: new Date('2022-05-12'),
    validity: 'Perpetual CSR Eligible Partner',
    fileUrl: '/uploads/documents/csr1-registration-mca.pdf',
    fileType: 'pdf',
    fileSize: '820 KB',
    description: 'Certifies Yuva Kranti Dal as an authorized implementing agency for corporate CSR grants and funding partnerships.',
    status: 'Verified',
    order: 5
  },
  {
    title: 'National Permanent Account Number (PAN) Card',
    titleHi: 'राष्ट्रीय स्थायी खाता संख्या (पैन) कार्ड',
    category: 'PAN Card',
    documentNumber: 'AAATB4321Q',
    issuingAuthority: 'Income Tax Department, Government of India',
    issueDate: new Date('2019-07-02'),
    validity: 'Permanent Entity Identifier',
    fileUrl: '/uploads/documents/pan-card-organization.pdf',
    fileType: 'pdf',
    fileSize: '650 KB',
    description: 'Official Permanent Account Number card issued in the name of Yuva Kranti Dal Sanstha.',
    status: 'Verified',
    order: 6
  }
];

const seedDefaultsIfNeeded = async () => {
  try {
    const count = await OrganizationDocument.countDocuments();
    if (count === 0) {
      await OrganizationDocument.insertMany(SEED_DOCUMENTS);
    }
  } catch (err) {
    console.warn('Organization documents seed notice:', err.message);
  }
};

/**
 * Get all organization certificates & statutory documents
 */
const getAllOrgDocuments = async (req, res) => {
  try {
    await seedDefaultsIfNeeded();

    const isAdmin = req.user && (req.user.role === 'Admin' || req.user.role === 'admin' || req.user.role === 'manager');
    const filter = {};

    if (!isAdmin) {
      filter.status = 'Verified';
    } else if (req.query.status && req.query.status !== 'all') {
      filter.status = req.query.status;
    }

    if (req.query.category && req.query.category !== 'all') {
      filter.category = req.query.category;
    }

    const documents = await OrganizationDocument.find(filter).sort({ order: 1, createdAt: -1 });

    return res.json({
      success: true,
      data: documents,
      documents,
      total: documents.length
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve organization certificates',
      error: error.message
    });
  }
};

/**
 * Create new organization certificate / document (Admin only)
 */
const createOrgDocument = async (req, res) => {
  try {
    const {
      title,
      titleHi,
      category,
      documentNumber,
      issuingAuthority,
      issueDate,
      validity,
      fileUrl,
      fileType,
      fileSize,
      description,
      status,
      order
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Document title is required' });
    }
    if (!fileUrl || !fileUrl.trim()) {
      return res.status(400).json({ success: false, message: 'Document file (PDF or image) is required' });
    }

    // Auto-detect fileType if not passed
    const detectedType = fileType || (/\.pdf(\?|$)/i.test(fileUrl) ? 'pdf' : 'image');

    const document = new OrganizationDocument({
      title: title.trim(),
      titleHi: (titleHi || '').trim(),
      category: category || 'Statutory / Legal',
      documentNumber: (documentNumber || '').trim(),
      issuingAuthority: (issuingAuthority || '').trim(),
      issueDate: issueDate ? new Date(issueDate) : new Date(),
      validity: (validity || 'Perpetual / Ongoing').trim(),
      fileUrl: fileUrl.trim(),
      fileType: detectedType,
      fileSize: fileSize || '',
      description: (description || '').trim(),
      status: status || 'Verified',
      order: Number(order) || 0
    });

    await document.save();

    return res.status(201).json({
      success: true,
      message: 'Organization certificate / document uploaded successfully!',
      data: document,
      document
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Failed to save organization document',
      error: error.message
    });
  }
};

/**
 * Update organization certificate / document (Admin only)
 */
const updateOrgDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (updateData.fileUrl && !updateData.fileType) {
      updateData.fileType = /\.pdf(\?|$)/i.test(updateData.fileUrl) ? 'pdf' : 'image';
    }

    const document = await OrganizationDocument.findByIdAndUpdate(
      id,
      updateData,
      { returnDocument: 'after', runValidators: true }
    );

    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    return res.json({
      success: true,
      message: 'Organization document updated successfully',
      data: document,
      document
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Failed to update organization document',
      error: error.message
    });
  }
};

/**
 * Delete organization certificate / document (Admin only)
 */
const deleteOrgDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const document = await OrganizationDocument.findByIdAndDelete(id);

    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    const { deleteDocumentFiles } = require('../utils/fileCleaner');
    await deleteDocumentFiles(document);

    return res.json({
      success: true,
      message: 'Organization certificate deleted successfully',
      id
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Failed to delete organization document',
      error: error.message
    });
  }
};

module.exports = {
  getAllOrgDocuments,
  createOrgDocument,
  updateOrgDocument,
  deleteOrgDocument
};
