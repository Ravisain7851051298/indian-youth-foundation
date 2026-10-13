const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_SECRET_KEY = process.env.X_ADMIN_SECRET_KEY;

const verifyToken = (req, res, next) => {
  // Check if X-Admin-Secret-Key header is provided for direct admin access
  const adminSecretHeader = req.headers['x-admin-secret-key'];
  if (adminSecretHeader && adminSecretHeader === ADMIN_SECRET_KEY) {
    req.user = { id: 'admin_master', role: 'Admin', name: 'Master Administrator', email: 'admin@bharatiyayuvakranti.org' };
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Authentication token required. Please sign in to proceed.'
    });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Authentication session expired or invalid. Please sign in again.'
    });
  }
};

const requireRole = (roles = []) => {
  return (req, res, next) => {
    // Check if admin secret key was verified
    const adminSecretHeader = req.headers['x-admin-secret-key'];
    if (adminSecretHeader && adminSecretHeader === ADMIN_SECRET_KEY) {
      return next();
    }

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized access. Authentication credentials required.'
      });
    }

    const userRole = (req.user.role || '').toLowerCase();
    const normalizedRoles = roles.map(r => r.toLowerCase());

    if (!normalizedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Insufficient permissions for role '${req.user.role}'. Required role: ${roles.join(', ')}.`
      });
    }
    next();
  };
};

const verifyAdminSecret = (req, res, next) => {
  const secret = req.headers['x-admin-secret-key'] || req.query.adminSecretKey || req.body?.adminSecretKey;
  if (secret && secret === ADMIN_SECRET_KEY) {
    req.isAdminSecretVerified = true;
    return next();
  }
  return res.status(403).json({
    success: false,
    message: 'Unauthorized: Invalid or missing X-Admin-Secret-Key header.'
  });
};

module.exports = {
  JWT_SECRET,
  ADMIN_SECRET_KEY,
  verifyToken,
  requireRole,
  verifyAdminSecret
};
