import { createRouter, createWebHistory } from 'vue-router';
// import store from "../store";
import UserList from '../views/UserList.vue';
import LoginView from '../views/LoginView.vue';
import AboutView from '../views/AboutView.vue';
import ProjectList from '../views/ProjectsView/ProjectList.vue';
import ProjectDetails from '../views/ProjectsView/ProjectDetails.vue';
import ProjectArchived from '../views/ProjectsView/ProjectAchived.vue';
import LogList from '../views/Logs/LogList.vue';
import MacroInfo from '../views/MacroInfo.vue';
import HelpPage from '../views/Help/HelpPage.vue';
import authMiddleware from './middleware';
import ManageFiles from '../views/ManageFiles.vue';

const routes = [
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: {
      title: 'Login',
      guest: true
    }
  },
  {
    path: '/',
    name: 'projects',
    component: ProjectList,
    meta: {
      title: 'Manage Projects ',
      requiresAuth: true
    }
  },
  {
    path: '/projectdetails/:id',
    name: 'projectdetails',
    props: true,
    component: ProjectDetails,
    meta: {
      title: 'Projects Details',
      requiresAuth: true
    }
  },
  {
    path: '/ulist',
    name: 'ulist',
    component: UserList,
    meta: {
      title: 'Manage Users',
      requiresAuth: true
    }
  },
  {
    path: '/archived',
    name: 'archived',
    component: ProjectArchived,
    meta: {
      title: 'Archived Projects',
      requiresAuth: true
    }
  },
  {
    path: '/logs',
    name: 'logs',
    component: LogList,
    meta: {
      title: 'Logs',
      requiresAuth: true
    }
  },
  {
    path: '/help',
    name: 'help',
    component: HelpPage,
    meta: {
      title: 'Help',
      requiresAuth: true
    }
  },
  {
    path: '/macroinfo',
    name: 'macroinfo',
    component: MacroInfo,
    meta: {
      title: 'Macro Information',
      requiresAuth: true
    }
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView,
    meta: {
      title: 'About Us',
      requiresAuth: true
    }
  },
  {
    path: '/files',
    name: 'files',
    component: ManageFiles,
    meta: {
      title: 'Manage Files',
      requiresAuth: true
    }
  }
];
// const isAuthenticate = store.state.login.isAuthenticated;
// console.log("isAuthenticate", isAuthenticate);
const router = createRouter({
  history: createWebHistory(process.env.VUE_APP_BASE_URL),
  routes
});
/* router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!isAuthenticate) {
      next({
        path: "/login",
        params: { nextUrl: to.fullPath },
      });
    } else {
      //let user = JSON.parse(localStorage.getItem('user'))
      next();
    }
  } else if (to.matched.some((record) => record.meta.guest)) {
    if (!isAuthenticate) {
      next();
    } else {
      next({ name: "/" });
    }
  } else {
    next();
  }
}); */
router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    authMiddleware(to, from, next);
  } else {
    next();
  }
});

// router.beforeEach((to, from, next) => {
//   if (to.meta.requiresAuth) {
//     authMiddleware(to, from, next);
//   } else {
//     next();
//   }
// });

export default router;
