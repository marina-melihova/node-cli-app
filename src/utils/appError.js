class AppError extends Error {
  constructor(message) {
    super(message);
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

process.on('unhandledRejection', err => {
  throw err;
});

process.on('uncaughtException', err => {
  console.log(err.toString());
  if (!err.isOperational) process.exit(1);
});

export default AppError;
