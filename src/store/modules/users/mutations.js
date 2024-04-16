import {
  ENABLE_DISABLE_USER,
  FETCH_USERS_LIST,
  ADD_NEW_USER,
  DELETE_USER,
  FETCH_USERS_ONLY_LIST,
  LOGOUT_APP
} from './constants';

export default {
  [`${ENABLE_DISABLE_USER}_REQUEST`](state) {
    state.loading = true;
  },
  [`${ENABLE_DISABLE_USER}_SUCCESS`](state, payload) {
    state.loading = false;
    state.status = payload.status;
    state.message = payload.result;
  },

  [`${ENABLE_DISABLE_USER}_ERROR`](state) {
    state.loading = false;
    // state.status = payload.data.status;
    // state.message = payload.data.result.message;
  },
  // FETCH USER LIST
  [`${FETCH_USERS_LIST}_REQUEST`](state) {
    state.loading = true;
  },
  [`${FETCH_USERS_LIST}_SUCCESS`](state, payload) {
    state.loading = false;
    state.status = payload.status;
    state.userlist = payload;
  },

  [`${FETCH_USERS_LIST}_ERROR`](state) {
    state.loading = false;
    // state.status = payload.data.status;
  },
  // ADD NEW USER
  [`${ADD_NEW_USER}_REQUEST`](state) {
    state.loading = true;
    state.fetched = false;
  },
  [`${ADD_NEW_USER}_SUCCESS`](state) {
    state.loading = false;
    state.fetched = true;
  },

  [`${ADD_NEW_USER}_ERROR`](state, payload) {
    state.loading = false;
    state.message = payload;
  },
  // ADD NEW USER
  [`${DELETE_USER}_REQUEST`](state) {
    state.loading = true;
  },
  [`${DELETE_USER}_SUCCESS`](state) {
    state.loading = false;
  },

  [`${DELETE_USER}_ERROR`](state) {
    state.loading = false;
    // state.status = payload.data.status;
  },
  // FETCH USER ONLY
  [`${FETCH_USERS_ONLY_LIST}_REQUEST`](state) {
    state.loading = true;
  },
  [`${FETCH_USERS_ONLY_LIST}_SUCCESS`](state, payload) {
    state.loading = false;
    state.useronlydata = payload;
  },

  [`${FETCH_USERS_ONLY_LIST}_ERROR`](state) {
    state.loading = false;
    // state.status = payload.data.status;
  },
  // LOGOUT
  [`${LOGOUT_APP}_REQUEST`](state) {
    state.loading = true;
  },
  [`${LOGOUT_APP}_SUCCESS`](state) {
    state.loading = false;
  },

  [`${LOGOUT_APP}_ERROR`](state) {
    state.loading = false;
    // state.status = payload.data.status;
  }
};
