import { createApp } from 'vue';
// import App from "./App.vue";
import MasterLayout from './Layout/MasterLayout';
import router from './router';
import store from './store';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import axios from 'axios';
import VueAxios from 'vue-axios';
import './styles/styles.scss';

const app = createApp(MasterLayout).use(store).use(Antd).use(router, axios, VueAxios);
app.mount('#app');
