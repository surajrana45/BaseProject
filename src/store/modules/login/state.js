export default {
  loading: false,
  error: false,
  errormsg: '',
  isAuthenticated: localStorage.getItem('auth_token') != null ? true : false,
  token: localStorage.getItem('auth_token') || '',
  userDetails: {},
  userInfo: { ip: '' },
  settings: {}
};
