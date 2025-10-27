/**
 * Global error handler middleware for Express
 * Place after all routes: app.use(errorHandler)
 */
function errorHandler(err, req, res, next) {
  console.error('Error:', err);
  if (res.headersSent) return next(err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
}

module.exports = errorHandler;