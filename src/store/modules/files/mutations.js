import { UPDATE_FILE, FETCH_FILE_LIST, ADD_NEW_FILE, DELETE_FILE } from './constants';

export default {
  [`${UPDATE_FILE}_REQUEST`](state) {
    state.loading = true;
  },
  [`${UPDATE_FILE}_SUCCESS`](state, payload) {
    state.loading = false;
    state.status = payload.status;
    state.message = payload.result;
  },

  [`${UPDATE_FILE}_ERROR`](state) {
    state.loading = false;
    // state.status = payload.data.status;
    // state.message = payload.data.result.message;
  },
  // FETCH USER LIST
  [`${FETCH_FILE_LIST}_REQUEST`](state) {
    state.loading = true;
  },
  [`${FETCH_FILE_LIST}_SUCCESS`](state, payload) {
    console.log(payload);
    state.loading = false;
    // state.status = payload.status;
    state.fileList = payload;
  },

  [`${FETCH_FILE_LIST}_ERROR`](state) {
    state.loading = false;
    // state.status = payload.data.status;
  },
  // ADD NEW USER
  [`${ADD_NEW_FILE}_REQUEST`](state) {
    state.loading = true;
    state.fetched = false;
  },
  [`${ADD_NEW_FILE}_SUCCESS`](state) {
    state.loading = false;
    state.fetched = true;
  },

  [`${ADD_NEW_FILE}_ERROR`](state, payload) {
    console.log('lllll', payload);
    state.loading = false;
    state.message = payload;
  },
  // ADD NEW USER
  [`${DELETE_FILE}_REQUEST`](state) {
    state.loading = true;
  },
  [`${DELETE_FILE}_SUCCESS`](state) {
    state.loading = false;
  },

  [`${DELETE_FILE}_ERROR`](state) {
    state.loading = false;
    // state.status = payload.data.status;
  }
};
