import { LOGIN, LOGOUT, GET_USER_INFO, GET_SETTING } from './constants';
import { parseJwt } from '../../../utils/funtions.js';
import router from '@/router';
import axios from 'axios';

export default {
  loginAction({ commit }, user) {
    return new Promise((resolve, reject) => {
      commit(`${LOGIN}_REQUEST`);
      axios({
        url: `${process.env.VUE_APP_LOGIN_BASE_URL}/login`,
        data: user,
        method: 'POST'
      })
        .then((resp) => {
          const token = resp.data.data;
          const parseToken = parseJwt(token);
          localStorage.setItem('auth_token', token);
          localStorage.setItem('expiration', parseToken.exp);

          axios.defaults.headers.common['Authorization'] = token;
          commit(`${LOGIN}_SUCCESS`, token);
          // console.log("user", parseJwt(token));
          window.location.href = '/';
          // this.$router.push("/");
          // window.location.href = "/";
          // router.push(router.query.redirect || "/dashboard");
          // router.push({ name: "dashboard", query: { redirect: "/dashboard" } });
          // router.history.go({ name: "dashboard" });
          resolve(resp);
          //alert(resp)
        })

        .catch((err) => {
          const errObj = err.response.data;
          commit(`${LOGIN}_ERROR`, errObj.data.message);
          console.log(errObj);
          localStorage.removeItem('token');
          reject(err);
        });
    });
  },
  getUserData({ commit }) {
    axios({
      url: `http://ip-api.com/json`,
      method: 'GET'
    }).then((res) => {
      // console.log(res);
      commit(`${GET_USER_INFO}_SUCCESS`, res.data);
    });
  },
  getSettings({ commit }) {
    axios({
      url: `/settings.json`,
      method: 'GET'
    }).then((res) => {
      // console.log(res);
      commit(`${GET_SETTING}_SUCCESS`, res.data);
    });
  },
  logout({ commit }) {
    return new Promise((resolve) => {
      commit(LOGOUT);
      window.localStorage.removeItem('auth_token');
      delete axios.defaults.headers.common['Authorization'];
      router.history.go({ name: 'login' });
      resolve();
    });
  }
};
