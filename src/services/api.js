import axios from 'axios';
import router from '@/router';
import { notification } from 'ant-design-vue';
// import { API_BASE_URL } from "@/global-constant";

const Api = axios.create({
  baseURL: '/',
  headers: { Authorization: 'bearer ' + localStorage.getItem('auth_token') }
});

Api.interceptors.request.use((config) => {
  return config;
});

// before a response is returned stop nprogress
Api.interceptors.response.use((response) => {
  return response;
});

Api.interceptors.response.use(null, (error) => {
  // console.log(error.message);
  if (error.response.status == 400) {
    notification['error']({
      message: error.response.statusText,
      description: error.response?.data?.data?.message || error.message,
      duration: 10
    });
  }
  if (error.response.status == 401) {
    window.localStorage.removeItem('auth_token');
    delete axios.defaults.headers.common['Authorization'];
    router.history.go({ name: 'login' });
  }
  // switch (error.response.status) {
  //   case 401:
  //     path = "login";
  //     break;
  //   case 404:
  //     path = "404";
  //     break;
  // }
  //router.push({ path: path });
  return Promise.reject(error);
});

export default () => {
  return Api;
};
