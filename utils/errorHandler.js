exports.errorHandler = (cb) => (req, res, next) =>
  Promise.resolve(cb(req, res, next)).catch((error) =>
    res.status(500).send({
      success: false,
      message: error && error.message ? error.message : "Internal Server Error",
    })
  );
