const jwt = require('jsonwebtoken');
const userRepository = require('../repository/user.repository');

/**
 * Protect routes by verifying JWT in Authorization Bearer header
 */
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.'
    });
  }

  try {
    const secret = process.env.JWT_SECRET || 'sahara_super_secret_jwt_key_hackathon_2026';
    const decoded = jwt.verify(token, secret);

    // Fetch user and check if still active
    const user = await userRepository.findById(decoded.id, '-passwordHash');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'The user belonging to this token no longer exists.'
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact support.'
      });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token. Please log in again.'
    });
  }
};

module.exports = { protect };
