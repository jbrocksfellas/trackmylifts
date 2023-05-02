"use client";

function extractError(err) {
  if (err.name === "AxiosError") {
    const data = err.response.data;
    const code = err.response.status;
    const statusText = err.response.statusText;

    return { code, status: code, statusText, message: data.error.message };
  }

  return { code: 1, status: 1, statusText: "Invalid", message: err.message };
}

export { extractError };
