export const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Not Found - ${req.originalUrl}`,
  });
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  const payload = {
    success: false,
    message: err?.message || 'Server Error',
  };

  // Log detailed stack on server
  console.error('Error:', err?.stack || err);

  if (process.env.NODE_ENV !== 'production' && err?.stack) {
    payload.stack = err.stack;
  }

  res.status(statusCode).json(payload);
};
