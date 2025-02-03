const validate = (schema, property = "body") => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property], { abortEarly: false });
    if (error) {
      return res.status(400).json({
        errors: error.details.map((detail) => ({
          message: detail.message,
          field: detail.path[0],
        })),
      });
    }
    next();
  };
};

export default validate;
