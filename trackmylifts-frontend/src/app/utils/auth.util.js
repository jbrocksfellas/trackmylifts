import jwtDecode from "jwt-decode";

function getAccessToken() {
  return localStorage.getItem("token");
}

function saveAccessToken(token) {
  localStorage.setItem("token", token);
}

function removeAccessToken() {
  localStorage.removeItem("token");
}

function logOut() {
  removeAccessToken();
  removeUser();
}

function getUser() {
  try {
    const user = JSON.parse(localStorage.getItem("user"));

    return user;
  } catch (err) {
    return null;
  }
}

function saveUser(user) {
  localStorage.setItem("user", JSON.stringify(user));
}

function removeUser() {
  localStorage.removeItem("user");
}

function getTokenExpiry() {
  const accessToken = getAccessToken();
  const decoded = jwtDecode(accessToken);

  return decoded.exp;
}

export { getAccessToken, saveAccessToken, removeAccessToken, saveUser, getUser, getTokenExpiry, logOut };
