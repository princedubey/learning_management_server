export const validateSchema = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body)
  if (error) {
    const cleanMessage = error.details
      .map(detail => detail.message.replace(/\"/g, ''))
      .join(', ')

    return res.status(400).json({
      success: false,
      message: cleanMessage,
    })
  }
  next()
}
