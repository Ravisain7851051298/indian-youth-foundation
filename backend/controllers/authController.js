const authService = require('../services/authService');
const { extractToken } = require('../middlewares/auth');

/**
 * Cookie security options configuration
 */
const getAccessTokenCookieOptions = () => ({
  httpOnly: true, // Prevents JavaScript XSS attack vectors
  secure: process.env.NODE_ENV === 'production', // Transmitted only via HTTPS in production
  sameSite: 'lax', // CSRF protection
  maxAge: 15 * 60 * 1000, // 15 minutes TTL
  path: '/'
});

const getRefreshTokenCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days TTL
  path: '/'
});

const setAuthCookies = (res, accessToken, refreshToken) => {
  if (accessToken) {
    res.cookie('byk_token', accessToken, getAccessTokenCookieOptions());
    res.cookie('token', accessToken, getAccessTokenCookieOptions());
  }
  if (refreshToken) {
    res.cookie('byk_refresh_token', refreshToken, getRefreshTokenCookieOptions());
  }
};

/**
 * Creates an Admin account with X-ADMIN-SECRET-KEY
 */
const createAdmin = async (req, res) => {
  try {
    const rawSecret = req.get('x-admin-secret-key') 
      || req.get('X-Admin-Secret-Key') 
      || req.get('X-ADMIN-SECRET-KEY') 
      || req.headers['x-admin-secret-key'] 
      || req.headers['x-admin-secret-ket'] 
      || req.body?.adminSecretKey 
      || req.body?.secretKey 
      || req.query?.adminSecretKey 
      || '';

    const secretKey = rawSecret.toString().split(',')[0].trim();

    console.log('🛡️ [API /create-admin] Extracted Secret:', secretKey ? `"${secretKey}"` : 'NONE');
    console.log('🛡️ [API /create-admin] Body Keys:', Object.keys(req.body || {}));
    if (req.body?.adminSecretKey) console.log('🛡️ [API /create-admin] Body.adminSecretKey:', `"${req.body.adminSecretKey}"`);

    const result = await authService.createAdminAccount(req.body, secretKey);
    const { user, accessToken, refreshToken, token } = result;

    // Set secure HTTP-only cookies for both tokens
    setAuthCookies(res, accessToken, refreshToken);

    return res.status(201).json({
      success: true,
      message: 'Verified Administrator account created successfully with custom credentials.',
      user,
      accessToken,
      refreshToken,
      token: token || accessToken
    });
  } catch (error) {
    const status = error.message.includes('Unauthorized') ? 403 : 400;
    return res.status(status).json({ success: false, message: error.message });
  }
};

/**
 * Member / Volunteer Public Registration
 */
const register = async (req, res) => {
  try {
    const result = await authService.register(req.body);
    const { user, accessToken, refreshToken, token } = result;

    // Set secure HTTP-only cookies
    setAuthCookies(res, accessToken, refreshToken);

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully! Select your plan and submit verification payment.',
      user,
      accessToken,
      refreshToken,
      token: token || accessToken
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Sign In with Email or Phone
 */
const login = async (req, res) => {
  try {
    const identifier = req.body.email || req.body.phone || req.body.identifier;
    const { password } = req.body;
    const result = await authService.login(identifier, password);
    const { user, accessToken, refreshToken, token } = result;

    // Set secure HTTP-only cookies
    setAuthCookies(res, accessToken, refreshToken);

    return res.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      user,
      accessToken,
      refreshToken,
      token: token || accessToken
    });
  } catch (error) {
    return res.status(401).json({ success: false, message: error.message });
  }
};

/**
 * Refresh expired access token using refresh token
 */
const refresh = async (req, res) => {
  try {
    const rawRefreshToken =
      req.body?.refreshToken ||
      req.headers['x-refresh-token'] ||
      req.cookies?.byk_refresh_token ||
      req.cookies?.refreshToken;

    if (!rawRefreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token is required. Please sign in again.'
      });
    }

    const result = await authService.refreshAccessToken(rawRefreshToken);
    const { user, accessToken, refreshToken, token } = result;

    setAuthCookies(res, accessToken, refreshToken);

    return res.json({
      success: true,
      message: 'Access token refreshed successfully',
      user,
      accessToken,
      refreshToken,
      token: token || accessToken
    });
  } catch (error) {
    return res.status(401).json({ success: false, message: error.message });
  }
};

/**
 * Logout and invalidate session via space-optimized TTL blacklist
 */
const logout = async (req, res) => {
  try {
    const token = req.token || extractToken(req);
    const userId = req.user?.id;

    // Blacklist token in MongoDB with TTL
    await authService.logout(token, userId);

    // Clear HTTP-Only authentication cookies
    const clearOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    };
    res.clearCookie('byk_token', clearOptions);
    res.clearCookie('token', clearOptions);
    res.clearCookie('byk_refresh_token', clearOptions);

    return res.json({
      success: true,
      message: 'Session terminated successfully. Token revoked.'
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Verify active session
 */
const verifySession = async (req, res) => {
  return res.json({
    success: true,
    isAuthenticated: true,
    user: req.user,
    token: req.token
  });
};

/**
 * Get current authenticated user profile
 */
const getMe = async (req, res) => {
  try {
    const user = await authService.getMe(req.user.id);
    return res.json({ success: true, user, token: req.token });
  } catch (error) {
    return res.status(404).json({ success: false, message: error.message });
  }
};

/**
 * Update authenticated user profile
 */
const updateProfile = async (req, res) => {
  try {
    const user = await authService.updateProfile(req.user.id, req.body);
    return res.json({ success: true, message: 'Profile updated successfully', user });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await authService.forgotPassword(email);
    return res.json({ success: true, message: result.message });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const result = await authService.resetPassword(token, newPassword);
    return res.json({ success: true, message: result.message });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  createAdmin,
  register,
  login,
  refresh,
  logout,
  verifySession,
  getMe,
  updateProfile,
  forgotPassword,
  resetPassword
};
