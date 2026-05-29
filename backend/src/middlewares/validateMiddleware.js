export function validateScore(req, res, next) {
  const { name, score } = req.body

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ success: false, error: 'name is required' })
  }
  if (score === undefined || typeof score !== 'number' || score < 0) {
    return res.status(400).json({ success: false, error: 'score must be a non-negative number' })
  }

  req.body.name = name.trim()
  next()
}
