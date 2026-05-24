const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err.statusCode) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message
    });
  }

  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
};

module.exports = errorHandler;
