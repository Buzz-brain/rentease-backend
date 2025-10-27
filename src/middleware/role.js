/**
 * Middleware to check user role
 * Usage: role('landlord'), role(['student', 'admin'])
 */
function role(required) {
  return function (req, res, next) {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const roles = Array.isArray(required) ? required : [required];
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: insufficient role' });
    }
    next();
  };
}

module.exports = role;