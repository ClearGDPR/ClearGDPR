/**
 * Use these errors in your business logic to have proper status codes
 * in the HTTP responses
 */

class BadRequest extends Error {
  static get StatusCode() {
    return 400;
  }
  get httpStatusCode() {
    return BadRequest.StatusCode;
  }
}

class ValidationError extends BadRequest {}

class Unauthorized extends Error {
  static get StatusCode() {
    return 401;
  }
  get httpStatusCode() {
    return Unauthorized.StatusCode;
  }
}

class Forbidden extends Error {
  static get StatusCode() {
    return 403;
  }
  get httpStatusCode() {
    return 403;
  }
}

class NotFound extends Error {
  static get StatusCode() {
    return 404;
  }
  get httpStatusCode() {
    return NotFound.StatusCode;
  }
}

const apiErrorHandler = (err, req, res, next) => {
  const statusCode = err.httpStatusCode || 500;
  res.status(statusCode).json({ error: err.message || String(err) });
};

module.exports = {
  apiErrorHandler,
  BadRequest,
  Unauthorized,
  Forbidden,
  NotFound,
  ValidationError
};
