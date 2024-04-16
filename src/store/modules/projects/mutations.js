import {
  FETCH_PROJECT_LIST,
  ADD_NEW_PROJECT,
  DELETE_PROJECT,
  GET_MASTER_ACCESS,
  SET_ACCESS,
  MASTER_ACCESS_POST,
  GET_DOWNLOAD_LIST,
  ADD_EXCEL_FILE,
  DOWNLOAD_FILE,
  FETCH_ARCHIVED_LIST
} from './constants';

export default {
  // FETCH PROJECT LIST
  [`${FETCH_PROJECT_LIST}_REQUEST`](state) {
    state.loading = true;
  },
  [`${FETCH_PROJECT_LIST}_SUCCESS`](state, payload) {
    state.loading = false;
    state.status = payload.status;
    state.projectlist = payload;
  },
  [`${FETCH_PROJECT_LIST}_ERROR`](state) {
    state.loading = false;
    // state.status = payload.data.status;
  },
  // FETCH MASTER ACCESS
  [`${GET_MASTER_ACCESS}_REQUEST`](state) {
    state.masterAccessloading = true;
  },
  [`${GET_MASTER_ACCESS}_SUCCESS`](state, payload) {
    // console.log(payload);
    state.masterAccessloading = false;
    state.status = payload.status;
    state.masterAccessList = payload;
  },

  [`${GET_MASTER_ACCESS}_ERROR`](state) {
    state.masterAccessloading = false;
    // state.status = payload.data.status;
  },
  // ADD NEW USER
  [`${ADD_NEW_PROJECT}_REQUEST`](state) {
    state.message = '';
    state.loading = true;
    state.fetched = false;
  },
  [`${ADD_NEW_PROJECT}_SUCCESS`](state) {
    state.message = '';
    state.loading = false;
    state.fetched = true;
  },

  [`${ADD_NEW_PROJECT}_ERROR`](state, payload) {
    state.loading = false;
    state.message = payload;
  },
  // ADD NEW USER
  [`${DELETE_PROJECT}_REQUEST`](state) {
    state.loading = true;
  },

  [`${DELETE_PROJECT}_SUCCESS`](state) {
    state.loading = false;
  },

  [`${DELETE_PROJECT}_ERROR`](state) {
    state.loading = false;
    // state.status = payload.data.status;
  },
  // ADD NEW USER
  [`${MASTER_ACCESS_POST}_REQUEST`](state) {
    state.loadingpost = true;
    state.fetched = false;
  },

  [`${MASTER_ACCESS_POST}_SUCCESS`](state) {
    state.loadingpost = true;
    state.fetched = true;
  },

  [`${MASTER_ACCESS_POST}_ERROR`](state) {
    state.loadingpost = false;
    // state.status = payload.data.status;
  },

  [`${SET_ACCESS}_REQUEST`](state, payload) {
    state.masterAccessList = payload;
  },

  // FETCH DOWNLOAD LIST
  [`${GET_DOWNLOAD_LIST}_REQUEST`](state) {
    state.downloadList = [];
    state.fetched = false;
    state.loading = true;
  },
  [`${GET_DOWNLOAD_LIST}_SUCCESS`](state, payload) {
    state.loading = false;
    state.fetched = true;
    state.status = payload.status;
    state.downloadList = payload;
  },

  [`${GET_DOWNLOAD_LIST}_ERROR`](state) {
    state.loading = false;
    // state.status = payload.data.status;
    state.fetched = true;
  },
  // UPLOAD EXCEL
  [`${ADD_EXCEL_FILE}_REQUEST`](state) {
    state.excelerrMsg = '';
    state.excelloading = true;
  },

  [`${ADD_EXCEL_FILE}_SUCCESS`](state) {
    state.excelloading = false;
  },

  [`${ADD_EXCEL_FILE}_ERROR`](state, payload) {
    state.excelerrMsg = payload;
    state.excelloading = false;
    // state.status = payload.data.status;
  },
  // DOWNLOAD EXCEL
  [`${DOWNLOAD_FILE}_REQUEST`](state) {
    state.loading = true;
  },
  [`${DOWNLOAD_FILE}_SUCCESS`](state) {
    state.loading = false;
  },

  [`${DOWNLOAD_FILE}_ERROR`](state) {
    state.loading = false;
  },
  // FETCH DOWNLOAD LIST
  [`${FETCH_ARCHIVED_LIST}_REQUEST`](state) {
    state.archiveddata = [];
    state.loading = true;
  },
  [`${FETCH_ARCHIVED_LIST}_SUCCESS`](state, payload) {
    state.loading = false;
    state.status = payload.status;
    state.archiveddata = payload;
  },

  [`${FETCH_ARCHIVED_LIST}_ERROR`](state) {
    state.loading = false;
    // state.status = payload.data.status;
  }
};
