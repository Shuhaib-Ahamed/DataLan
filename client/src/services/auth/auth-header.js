export default function authHeader() {
  const token = localStorage.token;
  const user = localStorage.user;

  if (user && token) {
    return { Authorization: "Bearer " + token };
  } else {
    return {};
  }
}
