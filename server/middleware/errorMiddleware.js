// File: server/middleware/errorMiddleware.js
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
};

export default errorHandler;
