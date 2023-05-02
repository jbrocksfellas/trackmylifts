function handleError(err, res) {
  console.log(err);

  res.status(500).json({ error: { code: 500, status: "Internal Server Error", message: err.message } });
}

const error = {
  notFound: (name, res) => {
    res.status(404).json({ error: { code: 404, status: "Not found", message: `${name} not found!` } });
  },
  badRequest: (message, res) => {
    res.status(400).json({
      error: {
        code: 400,
        status: statusCode(400),
        message,
      },
    });
  },
  unauthorized: (message, res) => {
    const code = 401;

    res.status(code).json({
      error: {
        code: code,
        status: statusCode(code),
        message,
      },
    });
  },
  forbidden: (message, res) => {
    const code = 403;

    res.status(code).json({
      error: {
        code: code,
        status: statusCode(code),
        message,
      },
    });
  },
};

const errorResponse = (res, { status = false, code = 400, message }) => {
  res.status(code).json({
    error: {
      status: status ? status : statusCode(code),
      code,
      message,
    },
  });
};

const statusCode = (code) => {
  const httpStatus = {
    200: "OK",
    201: "Created",
    202: "Accepted",
    203: "Non-Authoritative Information",
    204: "No Content",
    205: "Reset Content",
    206: "Partial Content",
    300: "Multiple Choices",
    301: "Moved Permanently",
    302: "Found",
    303: "See Other",
    304: "Not Modified",
    305: "Use Proxy",
    306: "Unused",
    307: "Temporary Redirect",
    400: "Bad Request",
    401: "Unauthorized",
    402: "Payment Required",
    403: "Forbidden",
    404: "Not Found",
    405: "Method Not Allowed",
    406: "Not Acceptable",
    407: "Proxy Authentication Required",
    408: "Request Timeout",
    409: "Conflict",
    410: "Gone",
    411: "Length Required",
    412: "Precondition Required",
    413: "Request Entry Too Large",
    414: "Request-URI Too Long",
    415: "Unsupported Media Type",
    416: "Requested Range Not Satisfiable",
    417: "Expectation Failed",
    418: "I'm a teapot",
    429: "Too Many Requests",
    500: "Internal Server Error",
    501: "Not Implemented",
    502: "Bad Gateway",
    503: "Service Unavailable",
    504: "Gateway Timeout",
    505: "HTTP Version Not Supported",
  };
  return httpStatus[code];
};
module.exports = { handleError, error, errorResponse };
