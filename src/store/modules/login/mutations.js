import { LOGOUT, LOGIN, GET_USER_DATA, GET_USER_INFO, GET_SETTING } from './constants';

export default {
  [`${LOGIN}_REQUEST`](state) {
    state.loading = true;
  },
  [`${LOGIN}_SUCCESS`](state, token) {
    state.loading = false;
    state.isAuthenticated = true;
    state.token = token;
  },

  [`${LOGIN}_ERROR`](state, payload) {
    state.loading = false;
    state.errormsg = payload;
    state.error = true;
  },
  // GET USER DATA
  [`${GET_USER_DATA}_REQUEST`](state) {
    state.loading = true;
  },
  [`${GET_USER_DATA}_SUCCESS`](state, payload) {
    state.loading = false;
    state.userDetails = payload;
  },

  [`${GET_USER_DATA}_ERROR`](state, payload) {
    state.errormsg = payload;
    state.error = true;
  },
  [LOGOUT](state) {
    state.loading = false;
    state.token = '';
  },
  [`${GET_USER_INFO}_SUCCESS`](state, payload) {
    state.userInfo = payload;
  },
  [`${GET_SETTING}_SUCCESS`](state, payload) {
    state.settings = payload;
  }
};
