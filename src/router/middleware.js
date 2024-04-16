export default function authMiddleware(to, from, next) {
  const token = localStorage.getItem('auth_token');
  const expiration = localStorage.getItem('expiration');

  if (!token || !expiration || Date.now() > parseInt(expiration * 1000)) {
    // Token has expired or is not present, log the user out
    localStorage.removeItem('auth_token');
    localStorage.removeItem('expiration');
    next('/login');
  } else {
    next();
  }
}
