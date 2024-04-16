import { FETCH_LOGS, DOWNLOAD_FILE_LOG, FETCH_MACRO_INFO, ABORT_PROCESS } from './constants';
import { notification } from 'ant-design-vue';
import Api from '../../../services/api';
export default {
  logsProvider({ commit }) {
    commit(`${FETCH_LOGS}_REQUEST`);
    let promise = Api().get(`${process.env.VUE_APP_MAIN_BASE_URL}/logs`);
    return promise
      .then((res) => {
        const items = res.data;
        commit(`${FETCH_LOGS}_SUCCESS`, items);
      })
      .catch((error) => {
        console.log(error);
      });
  },
  fetchmacroinfo({ commit }) {
    commit(`${FETCH_MACRO_INFO}_REQUEST`);
    let promise = Api().get(`${process.env.VUE_APP_MAIN_BASE_URL}/MacroStatus`);
    return promise
      .then((res) => {
        const items = res.data.data;
        commit(`${FETCH_MACRO_INFO}_SUCCESS`, items);
      })
      .catch((error) => {
        console.log(error);
      });
  },
  downloadLog({ commit }, payload) {
    commit(`${DOWNLOAD_FILE_LOG}_REQUEST`);
    const filename = payload.replace('.log', '');
    let promise = Api().get(
      `${process.env.VUE_APP_MAIN_BASE_URL}/Downloadlog?fileName=${filename}`,
      { responseType: 'blob' }
    );
    return promise
      .then((res) => {
        const items = res.data;
        //console.log("items", items);
        commit(`${DOWNLOAD_FILE_LOG}_SUCCESS`, items);
        const url = window.URL.createObjectURL(new Blob([items]));
        const link = document.createElement('a');
        link.href = url;

        link.setAttribute('download', `${filename}.txt`);
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => {
        commit(`${DOWNLOAD_FILE_LOG}_ERROR`);
        const errObj = error;
        notification['error']({
          message: errObj
        });
      });
  },
  abortProcess({ dispatch, commit }, payload) {
    return new Promise((resolve, reject) => {
      commit(`${ABORT_PROCESS}_REQUEST`);
      Api()({
        url: `${process.env.VUE_APP_MAIN_BASE_URL}/Abort?id=${payload}`,
        method: 'POST'
      })
        .then((resp) => {
          const msg = resp.data.data;
          commit(`${ABORT_PROCESS}_SUCCESS`, msg);
          dispatch('fetchmacroinfo');
          notification['success']({
            message: msg
          });
        })
        .catch((err) => {
          const errObj = err.response.data;
          commit(`${ABORT_PROCESS}_ERROR`, errObj.data.message);
          console.log(err.response);
          reject(err);
        });
    });
  }
};
