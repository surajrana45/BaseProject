<template>
  <a-layout v-if="$route.matched.some(({ name }) => name !== 'login')">
    <a-layout>
      <a-layout-sider width="265" theme="dark" v-model:collapsed="collapsed" collapsible>
        <a-menu
          mode="inline"
          :selectedKeys="[$route.name]"
          :style="{ height: '100%', borderRight: 0 }"
        >
          <a-menu-item
            key="projects"
            @click="handleMenuclick('projects')"
            v-if="$route.matched.some(({ name }) => name != 'projectdetails')"
            ><LaptopOutlined /> <span>Projects</span></a-menu-item
          >
          <a-menu-item
            key="projectdetails"
            @click="handleMenuclick('projects')"
            v-if="$route.matched.some(({ name }) => name == 'projectdetails')"
            ><LaptopOutlined /> <span>Projects</span></a-menu-item
          >
          <a-menu-item key="archived" v-if="userType != 'User'" @click="handleMenuclick('archived')"
            ><DeleteOutlined /> <span>Archived Projects</span>
          </a-menu-item>
          <a-menu-item
            key="macroinfo"
            v-if="userType != 'User'"
            @click="handleMenuclick('macroinfo')"
            ><PieChartOutlined /> <span>Macro Information</span></a-menu-item
          >
          <a-menu-item key="ulist" v-if="userType != 'User'" @click="handleMenuclick('ulist')"
            ><TeamOutlined /> <span>User List</span>
          </a-menu-item>
          <a-menu-item key="files" v-if="userType != 'User'" @click="handleMenuclick('files')"
            ><FileOutlined /> <span>Manage Files</span>
          </a-menu-item>
          <a-menu-item key="logs" v-if="userType != 'User'" @click="handleMenuclick('logs')"
            ><BugOutlined /> <span>Logs</span>
          </a-menu-item>
          <a-menu-item key="help" @click="handleMenuclick('help')"
            ><QuestionOutlined /> <span>Help</span>
          </a-menu-item>
        </a-menu>
      </a-layout-sider>
      <a-layout style="padding: 0px 24px 24px">
        <a-layout-header class="header">
          <HeaderComponentVue :userName="userName" :settings="settings" />
        </a-layout-header>
        <a-breadcrumb class="breadcrumb-main">
          <a-breadcrumb-item style="user-select: none"
            ><ArrowLeftOutlined
              @click="handleMenuclick('projects')"
              v-if="pagename == 'Projects Details'"
            />
            {{ pagename }}</a-breadcrumb-item
          >
        </a-breadcrumb>
        <a-layout-content
          :style="{
            padding: '0 15px 15px',
            margin: 0,
            backgroundColor: '#fff'
          }"
        >
          <router-view />
          <CopyRight class="inneerpage" :copyrighttext="settings.copyrightText" />
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-layout>
  <div v-else><router-view /></div>
</template>

<script>
import router from '@/router';
import { parseJwt } from '@/utils/funtions';
import CopyRight from '@/components/CopyRight.vue';
import {
  TeamOutlined,
  LaptopOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
  BugOutlined,
  PieChartOutlined,
  QuestionOutlined,
  FileOutlined
} from '@ant-design/icons-vue';
import HeaderComponentVue from './HeaderComponent.vue';
import { mapActions, mapState } from 'vuex';

import { defineComponent } from 'vue';
export default defineComponent({
  components: {
    TeamOutlined,
    LaptopOutlined,
    HeaderComponentVue,
    DeleteOutlined,
    ArrowLeftOutlined,
    BugOutlined,
    CopyRight,
    PieChartOutlined,
    QuestionOutlined,
    FileOutlined
  },

  watch: {
    $route: {
      immediate: true,
      handler(to) {
        document.title = to.meta.title || 'WebTool';
        this.pagename = to.meta.title || 'WebTool';
      }
    }
  },
  data() {
    return {
      pagename: 'WebTool',
      userType: 'User',
      userName: '',
      collapsed: true,
      expireAt: '',
      intervalId: null
    };
  },
  computed: {
    ...mapState('login', {
      settings: (state) => state.settings
    })
  },
  methods: {
    handleMenuclick(name) {
      router.push({ name: name });
    },
    ...mapActions('login', {
      getsettings: 'getSettings'
    }),
    startInterval() {
      this.intervalId = setInterval(() => {
        // console.log("kkk");
      }, 1000 * 10);
    },
    stopInterval() {
      clearInterval(this.intervalId);
    }
  },
  created() {
    const vm = this;
    const token = localStorage.getItem('auth_token');
    vm.getsettings();
    if (token) {
      const userDetails = parseJwt(token);
      vm.userName = `${userDetails.Name} ${userDetails.Surname}`;
      const userId = userDetails['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      vm.userType = userId;
      vm.expireAt = userDetails.exp;
    }
    /* if(vm.expireAt != ""){
    } */
  }
});
</script>

<style>
.logo {
  float: left;
  width: 120px;
  height: 31px;
  margin: 16px 24px 16px 0;
  color: #fff;
  line-height: 31px;
}
.breadcrumb-main {
  margin: 16px 0;
  background-color: #ffffff;
  padding: 10px 15px !important;
}
.ant-row-rtl #components-layout-demo-top-side-2 .logo {
  float: right;
  margin: 16px 0 16px 24px;
}

.site-layout-background {
  background: #fff;
}
.ant-menu {
  background-color: initial !important;
  height: calc(100vh - 116px) !important;
  color: #ccc !important;
}
</style>
