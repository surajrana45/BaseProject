import { notification } from 'ant-design-vue';
import {
  ENABLE_DISABLE_USER,
  FETCH_USERS_LIST,
  ADD_NEW_USER,
  DELETE_USER,
  FETCH_USERS_ONLY_LIST,
  LOGOUT_APP
} from './constants';
import Api from '../../../services/api';
export default {
  updateUser({ commit }, payload) {
    return new Promise((resolve, reject) => {
      commit(`${ENABLE_DISABLE_USER}_REQUEST`);
      Api()({ url: `/set-user-active`, data: payload, method: 'PUT' })
        .then((resp) => {
          const msg = resp.data;
          commit(`${ENABLE_DISABLE_USER}_SUCCESS`, msg);

          resolve(resp);
        })
        .catch((err) => {
          commit(`${ENABLE_DISABLE_USER}_ERROR`, err.response);
          console.log(err.response);
          reject(err);
        });
    });
  },
  deleteUser({ dispatch, commit }, payload) {
    return new Promise((resolve, reject) => {
      commit(`${DELETE_USER}_REQUEST`);
      Api()({
        url: `${process.env.VUE_APP_LOGIN_BASE_URL}/user/${payload.emailid}`,
        data: payload.emailid,
        method: 'PUT'
      })
        .then((resp) => {
          const msg = resp.data.data;
          // commit(`${DELETE_USER}_SUCCESS`, msg);
          dispatch('userProvider', payload.userType);
          notification['success']({
            message: msg
          });
        })
        .catch((err) => {
          commit(`${DELETE_USER}_ERROR`, err.response);
          console.log(err.response);
          reject(err);
        });
    });
  },
  addNewUser({ dispatch, commit }, payload) {
    return new Promise((resolve, reject) => {
      commit(`${ADD_NEW_USER}_REQUEST`);
      Api()({
        url: `${process.env.VUE_APP_LOGIN_BASE_URL}/User`,
        data: payload,
        method: 'POST'
      })
        .then((resp) => {
          const msg = resp.data.data;
          commit(`${ADD_NEW_USER}_SUCCESS`, msg);
          dispatch('userProvider', payload.userType);
          notification['success']({
            message: msg
          });
        })
        .catch((err) => {
          const errObj = err.response.data;
          commit(`${ADD_NEW_USER}_ERROR`, errObj.data.message);
          console.log(err.response);
          reject(err);
        });
    });
  },
  userProvider({ commit }, payload) {
    commit(`${FETCH_USERS_LIST}_REQUEST`);
    let promise = Api().get(`${process.env.VUE_APP_LOGIN_BASE_URL}/${payload}`);
    return promise
      .then((res) => {
        const items = res.data.data;
        commit(`${FETCH_USERS_LIST}_SUCCESS`, items);
        return items;
      })
      .catch((error) => {
        console.log(error);
      });
  },
  // USER ONLY
  userOnly({ commit }, payload) {
    commit(`${FETCH_USERS_ONLY_LIST}_REQUEST`);
    let promise = Api().get(`${process.env.VUE_APP_LOGIN_BASE_URL}/${payload}`);
    return promise
      .then((res) => {
        const items = res.data.data;
        commit(`${FETCH_USERS_ONLY_LIST}_SUCCESS`, items);
      })
      .catch((error) => {
        console.log(error);
        this.isBusy;
        return [];
      });
  },
  // LOGOUT
  logoutAPI({ commit }) {
    return new Promise(() => {
      commit(`${LOGOUT_APP}_REQUEST`);
      Api()({
        url: `${process.env.VUE_APP_LOGIN_BASE_URL}/logout`,
        method: 'POST'
      })
        .then((resp) => {
          const msg = resp.data.data;
          commit(`${LOGOUT_APP}_SUCCESS`, msg);
          localStorage.clear();
          window.location.href = '/login';
          notification['success']({
            message: msg
          });
        })
        .catch((error) => {
          const errObj = error.response.data;
          commit(`${LOGOUT_APP}_ERROR`, errObj.data.message);
          notification['error']({
            message: errObj.data.message
          });
          commit(`${LOGOUT_APP}_ERROR`, errObj.data.message);
          console.log(error.response);
        });
    });
  }
};
