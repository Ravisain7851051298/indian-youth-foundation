const TokenBlacklist = require('../models/TokenBlacklist');

class TokenBlacklistRepository {
  /**
   * Adds a token to the blacklist with TTL
   */
  async blacklistToken({ token, userId = null, userEmail = '', reason = 'logout', expiresAt }) {
    try {
      return await TokenBlacklist.findOneAndUpdate(
        { token },
        {
          token,
          userId,
          userEmail,
          reason,
          expiresAt
        },
        { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
      );
    } catch (error) {
      // In case of duplicate key race condition, return existing
      if (error.code === 11000) {
        return await TokenBlacklist.findOne({ token });
      }
      throw error;
    }
  }

  /**
   * Checks if a token is in the blacklist
   */
  async isBlacklisted(token) {
    if (!token) return false;
    const record = await TokenBlacklist.findOne({ token }).lean();
    return !!record;
  }

  /**
   * Revokes all active tokens for a given user (optional security helper)
   */
  async revokeUserSessions(userId, userEmail, expiresAt, reason = 'security_invalidation') {
    if (!userId) return null;
    return await TokenBlacklist.create({
      token: `revoked_all_${userId}_${Date.now()}`,
      userId,
      userEmail,
      reason,
      expiresAt
    });
  }
}

module.exports = new TokenBlacklistRepository();
