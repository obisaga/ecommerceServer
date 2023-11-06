const errorHandler = (err, req, res, next) => {
    console.log(err);
    const statusCode = err.statusCode || 500;
    const statusMessage = err.message || "Internal server error";
    res.status(statusCode).json({ error: statusMessage });
  };

export default errorHandler