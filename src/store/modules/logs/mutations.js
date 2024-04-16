import { ABORT_PROCESS, DOWNLOAD_FILE_LOG, FETCH_LOGS, FETCH_MACRO_INFO } from './constants';

export default {
  // FETCH USER LIST
  [`${FETCH_LOGS}_REQUEST`](state) {
    state.loading = true;
  },
  [`${FETCH_LOGS}_SUCCESS`](state, payload) {
    state.loading = false;
    state.status = payload.status;
    state.logsData = payload;
  },
  [`${FETCH_LOGS}_ERROR`](state) {
    state.loading = false;
    // state.status = payload.data.status;
  },
  // FETCH MACRO INFO LIST
  [`${FETCH_MACRO_INFO}_REQUEST`](state) {
    state.loading = true;
  },
  [`${FETCH_MACRO_INFO}_SUCCESS`](state, payload) {
    state.loading = false;
    state.status = payload.status;
    state.macroinfoData = payload;
  },
  [`${FETCH_MACRO_INFO}_ERROR`](state) {
    state.loading = false;
    // state.status = payload.data.status;
  },

  // DOWNLOAD FILE
  [`${DOWNLOAD_FILE_LOG}_REQUEST`](state) {
    state.loading = true;
  },
  [`${DOWNLOAD_FILE_LOG}_SUCCESS`](state) {
    state.loading = false;
  },

  [`${DOWNLOAD_FILE_LOG}_ERROR`](state) {
    state.loading = false;
  },
  // ABORT PROCESS
  [`${ABORT_PROCESS}_REQUEST`](state) {
    state.loading = true;
  },
  [`${ABORT_PROCESS}_SUCCESS`](state) {
    state.loading = false;
  },

  [`${ABORT_PROCESS}_ERROR`](state) {
    state.loading = false;
  }
};
