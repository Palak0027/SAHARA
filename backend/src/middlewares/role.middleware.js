/**
 * Role-based authorization middleware
 * Checks if user possesses any of the allowed roles
 * @param  {...string} allowedRoles - e.g. 'donor', 'receiver', 'admin', 'volunteer'
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: User authentication required.'
      });
    }

    const userRoles = req.user.roles && req.user.roles.length > 0
      ? req.user.roles
      : [req.user.role];

    const hasPermission =
      allowedRoles.includes(req.user.activeRole) ||
      allowedRoles.includes(req.user.role) ||
      userRoles.some((r) => allowedRoles.includes(r));

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Access restricted to [${allowedRoles.join(', ')}] roles only.`
      });
    }

    next();
  };
};

module.exports = { authorize };
