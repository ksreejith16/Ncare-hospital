// Wrap async route handlers so thrown errors hit the error middleware.
// Saves writing try/catch in every route.
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
