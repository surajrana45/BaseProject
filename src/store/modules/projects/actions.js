import { notification } from 'ant-design-vue';
import { downloadfile } from '@/utils/funtions';
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
import Api from '../../../services/api';
export default {
  deleteProject({ dispatch, commit }, payload) {
    return new Promise((resolve, reject) => {
      commit(`${DELETE_PROJECT}_REQUEST`);
      Api()({
        url: `${process.env.VUE_APP_MAIN_BASE_URL}/MasterList?isArchive=${payload.isArchived}&masterId=${payload.id}`,
        data: payload,
        method: 'PUT'
      })
        .then((resp) => {
          const msg = resp.data.data;
          commit(`${DELETE_PROJECT}_SUCCESS`, msg);
          if (payload.isArchived) {
            dispatch('projectProvider');
          } else {
            dispatch('getArchivedList');
          }

          notification['success']({
            message: msg
          });
        })
        .catch((err) => {
          commit(`${DELETE_PROJECT}_ERROR`, err.response);
          console.log(err.response);
          reject(err);
        });
    });
  },
  addNewProject({ dispatch, commit }, payload) {
    return new Promise((resolve, reject) => {
      commit(`${ADD_NEW_PROJECT}_REQUEST`);
      Api()({
        url: `${process.env.VUE_APP_MAIN_BASE_URL}/UploadExcelMaster`,
        data: payload,
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        method: 'POST'
      })
        .then((resp) => {
          const msg = resp.data.data;
          commit(`${ADD_NEW_PROJECT}_SUCCESS`, msg);
          dispatch('projectProvider');
          notification['success']({
            message: msg
          });
        })
        .catch((err) => {
          const errObj = err.response.data;
          commit(`${ADD_NEW_PROJECT}_ERROR`, errObj.data.message);
          console.log(err.response);
          reject(err);
        });
    });
  },
  projectProvider({ commit }) {
    commit(`${FETCH_PROJECT_LIST}_REQUEST`);
    let promise = Api().get(`${process.env.VUE_APP_MAIN_BASE_URL}/MasterList`);
    return promise
      .then((res) => {
        const items = res.data.data;
        commit(`${FETCH_PROJECT_LIST}_SUCCESS`, items);
        return items;
      })
      .catch((error) => {
        console.log('error', error);
        const errObj = error.response;
        commit(`${FETCH_PROJECT_LIST}_ERROR`, error);
        notification['error']({
          message: errObj
        });
        this.isBusy;
        return [];
      });
  },
  setAccess({ commit }, payload) {
    commit(`${SET_ACCESS}_REQUEST`, payload);
  },
  getMasterAccess({ commit }, payload) {
    commit(`${GET_MASTER_ACCESS}_REQUEST`);
    let promise = Api().get(`${process.env.VUE_APP_MAIN_BASE_URL}/MasterAccessList/${payload}`);
    return promise
      .then((res) => {
        const items = res.data.data;
        commit(`${GET_MASTER_ACCESS}_SUCCESS`, items.users);
      })
      .catch((error) => {
        const errObj = error.response.data;
        notification['success']({
          message: errObj.data.message
        });
      });
  },
  // MASTER ACCESS POST
  masterAccessPost({ commit }, payload) {
    return new Promise((resolve, reject) => {
      commit(`${MASTER_ACCESS_POST}_REQUEST`);
      Api()({
        url: `${process.env.VUE_APP_MAIN_BASE_URL}/MasterAccess`,
        data: payload,
        method: 'POST'
      })
        .then((resp) => {
          const msg = resp.data.data;
          commit(`${MASTER_ACCESS_POST}_SUCCESS`, msg);
          notification['success']({
            message: msg
          });
        })
        .catch((err) => {
          const errObj = err.response.data;
          commit(`${MASTER_ACCESS_POST}_ERROR`, errObj.data.message);
          console.log(err.response);
          reject(err);
        });
    });
  },
  getDownloadList({ commit }, payload) {
    if (payload.isfirsttime) {
      commit(`${GET_DOWNLOAD_LIST}_REQUEST`);
    }
    let promise = Api().get(`${process.env.VUE_APP_MAIN_BASE_URL}/Download?id=${payload.id}`);
    return promise
      .then((res) => {
        const items = res.data.data;
        commit(`${GET_DOWNLOAD_LIST}_SUCCESS`, items);
      })
      .catch((error) => {
        const errObj = error.response.data;
        commit(`${GET_DOWNLOAD_LIST}_SUCCESS`, errObj);
        notification['error']({
          message: errObj.data.message
        });
      });
  },
  // DOWNLOAD FILE
  downloadexcel({ commit }, payload) {
    commit(`${DOWNLOAD_FILE}_REQUEST`);
    let promise = Api().get(
      `${process.env.VUE_APP_MAIN_BASE_URL}/DownloadData/${payload.id}?isSource=${payload.isSource}`,
      { responseType: 'blob' }
    );
    return promise
      .then((res) => {
        const items = res.data;
        //console.log("items", items);
        commit(`${DOWNLOAD_FILE}_SUCCESS`, items);
        downloadfile(res);
      })
      .catch((error) => {
        console.log(error);
        // const errObj = error;
        commit(`${DOWNLOAD_FILE}_ERROR`);
        /* notification["error"]({
          message: errObj,
          duration: 10,
        }); */
      });
  },
  downloadexcelTemplate({ commit }, payload) {
    commit(`${DOWNLOAD_FILE}_REQUEST`);
    let promise = Api().get(`${process.env.VUE_APP_MAIN_BASE_URL}/DownloadTemplate/${payload.id}`, {
      responseType: 'blob'
    });
    promise
      .then((res) => {
        const items = res.data;

        commit(`${DOWNLOAD_FILE}_SUCCESS`, items);
        downloadfile(res);
      })
      .catch((err) => {
        // const errObj = err;
        commit(`${DOWNLOAD_FILE}_ERROR`, err);
        notification['error']({
          message: err.response.statusText,
          description: err.message,
          duration: 10
        });
      });
  },
  // DOWNLOAD Master
  downloadMaster({ commit }, payload) {
    commit(`${DOWNLOAD_FILE}_REQUEST`);
    let promise = Api().get(`${process.env.VUE_APP_MAIN_BASE_URL}/DownloadMaster/${payload.id}`, {
      responseType: 'blob'
    });
    return promise
      .then((res) => {
        const items = res.data;
        //console.log("items", items);
        // console.log(res.request.getResponseHeader("Content-Disposition"));
        commit(`${DOWNLOAD_FILE}_SUCCESS`, items);
        downloadfile(res);
      })
      .catch((err) => {
        commit(`${DOWNLOAD_FILE}_ERROR`);
        notification['error']({
          message: err.response.statusText,
          description: err.message,
          duration: 10
        });
      });
  },
  // UPLOAD EXCEL
  uploadExcelfile({ dispatch, commit }, payload) {
    return new Promise((resolve, reject) => {
      commit(`${ADD_EXCEL_FILE}_REQUEST`);
      Api()({
        url: `${process.env.VUE_APP_MAIN_BASE_URL}/UploadData`,
        data: payload,
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        method: 'POST'
      })
        .then((resp) => {
          const msg = resp.data.data;
          commit(`${ADD_EXCEL_FILE}_SUCCESS`, msg);
          dispatch('getDownloadList', { id: payload.id, isfirsttime: true });
          notification['success']({
            message: msg
          });
        })
        .catch((err) => {
          const errObj = err.response.data;
          commit(`${ADD_EXCEL_FILE}_ERROR`, errObj.data.message);
          notification['error']({
            message: errObj.data.message
          });
          console.log(err.response);
          reject(err);
        });
    });
  },
  // fetch archived data
  getArchivedList({ commit }) {
    commit(`${FETCH_ARCHIVED_LIST}_REQUEST`);
    let promise = Api().get(`${process.env.VUE_APP_MAIN_BASE_URL}/MasterListArchive`);
    return promise
      .then((res) => {
        const items = res.data.data;
        commit(`${FETCH_ARCHIVED_LIST}_SUCCESS`, items);
      })
      .catch((err) => {
        console.log(err);
        notification['error']({
          message: err.response.statusText,
          description: err.message,
          duration: 10
        });
      });
  }
};
