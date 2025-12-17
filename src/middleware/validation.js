const Joi = require('joi');

const validateChat = (req, res, next) => {
  const schema = Joi.object({
    sessionId: Joi.string().uuid().required(),
    query: Joi.string().min(3).max(500).required(),
  });

  const { error, value } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details[0].message,
    });
  }

  req.validatedData = value;
  return next(); // Explicitly return to prevent double execution
};

const validateIngest = (req, res, next) => {
  const schema = Joi.object({
    articles: Joi.array()
      .items(
        Joi.object({
          title: Joi.string().required(),
          content: Joi.string().required(),
          source: Joi.string().optional(),
        })
      )
      .optional(),
  });

  const { error, value } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details[0].message,
    });
  }

  req.validatedData = value;
  return next(); // Explicitly return to prevent double execution
};

module.exports = { validateChat, validateIngest };
