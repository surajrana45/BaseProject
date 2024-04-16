import { notification } from 'ant-design-vue';
import { ADD_NEW_FILE, UPDATE_FILE, DELETE_FILE, FETCH_FILE_LIST } from './constants';
import Api from '../../../services/api';
export default {
  updateFile({ commit }, payload) {
    return new Promise((resolve, reject) => {
      commit(`${UPDATE_FILE}_REQUEST`);
      Api()({ url: `/set-user-active`, data: payload, method: 'PUT' })
        .then((resp) => {
          const msg = resp.data;
          commit(`${UPDATE_FILE}_SUCCESS`, msg);

          resolve(resp);
        })
        .catch((err) => {
          commit(`${UPDATE_FILE}_ERROR`, err.response);
          reject(err);
        });
    });
  },
  deleteFile({ dispatch, commit }, payload) {
    return new Promise((resolve, reject) => {
      commit(`${DELETE_FILE}_REQUEST`);
      Api()({
        url: `${process.env.VUE_APP_MAIN_BASE_URL}/deleteFile?fileName=${payload}`,
        method: 'GET'
      })
        .then((resp) => {
          const msg = resp.data.data;
          // commit(`${DELETE_FILE}_SUCCESS`, msg);
          dispatch('filesProvider', 'files');
          notification['success']({
            message: msg
          });
        })
        .catch((err) => {
          commit(`${DELETE_FILE}_ERROR`, err.response);
          console.log(err.response);
          reject(err);
        });
    });
  },
  addNewFile({ dispatch, commit }, payload) {
    return new Promise((resolve, reject) => {
      console.log('addfile', payload);
      commit(`${ADD_NEW_FILE}_REQUEST`);
      Api()({
        url: `${process.env.VUE_APP_MAIN_BASE_URL}/UploadFile/${payload.type}`,
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        data: payload,
        method: 'POST'
      })
        .then((resp) => {
          const msg = resp.data.data;
          commit(`${ADD_NEW_FILE}_SUCCESS`, msg);
          dispatch('filesProvider', 'files');
          notification['success']({
            message: msg
          });
        })
        .catch((err) => {
          const errObj = err.response.data;
          commit(`${ADD_NEW_FILE}_ERROR`, errObj.data.message);
          console.log(err.response);
          reject(err);
        });
    });
  },
  filesProvider({ commit }, payload) {
    commit(`${FETCH_FILE_LIST}_REQUEST`);
    let promise = Api().get(`${process.env.VUE_APP_MAIN_BASE_URL}/${payload}`);
    return promise
      .then((res) => {
        const items = res.data;
        commit(`${FETCH_FILE_LIST}_SUCCESS`, items);
        return items;
      })
      .catch((error) => {
        console.log(error);
      });
  }
};
