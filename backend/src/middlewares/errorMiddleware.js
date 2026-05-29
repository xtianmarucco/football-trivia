export function errorMiddleware(err, _req, res, _next) {
  console.error(err)
  const status = err.status || 500
  res.status(status).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  })
}
