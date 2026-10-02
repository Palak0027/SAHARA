const jwt = require('jsonwebtoken');

/**
 * Generate a signed JWT token containing userId, role, and activeRole
 * @param {string} userId - MongoDB _id
 * @param {string} role - User primary role ('donor', 'receiver', 'volunteer', 'admin')
 * @param {Array<string>} [roles] - List of unlocked roles
 * @param {string} [activeRole] - Current active mode
 * @returns {string} - Signed JWT token
 */
const generateToken = (userId, role, roles = null, activeRole = null) => {
  const secret = process.env.JWT_SECRET || 'sahara_super_secret_jwt_key_hackathon_2026';
  const expiresIn = process.env.JWT_EXPIRE || '7d';

  return jwt.sign(
    {
      id: userId,
      role: activeRole || role,
      activeRole: activeRole || role,
      roles: roles || [role]
    },
    secret,
    {
      expiresIn
    }
  );
};

module.exports = generateToken;
