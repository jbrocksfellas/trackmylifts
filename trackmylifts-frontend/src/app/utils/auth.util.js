function getAccessToken() {
  return localStorage.getItem("token");
}

function saveAccessToken(token) {
  return localStorage.setItem("token", token);
}

function removeAccessToken() {
  return localStorage.removeItem("token");
}

export { getAccessToken, saveAccessToken, removeAccessToken };
