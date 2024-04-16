<template>
  <div class="header">
    <div class="logo" v-if="settings.clientLogo">
      <img :src="settings.clientLogo" alt="" />
    </div>
    <div class="logo" v-else>
      {{ settings.clientName }}
    </div>
    <div class="header-right">
      <div class="username"><span>Welcome</span>{{ userName }}</div>
      <div class="logout-btn" @click="logout"><LogoutOutlined /> Logout</div>
    </div>
  </div>
</template>
<script>
// import router from "@/router";
import { LogoutOutlined } from '@ant-design/icons-vue';
import { mapActions } from 'vuex';
export default {
  props: ['userName', 'settings'],
  components: {
    LogoutOutlined
  },
  methods: {
    ...mapActions('users', {
      logout: 'logoutAPI'
    })
    /* handleLogout() {
      localStorage.clear();
      window.location.href = "/login";

      //   router.push("/");
    }, */
  },
  created() {
    // console.log("router", this.$router);
  }
};
</script>
<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: space-between;
}
.header-right {
  display: flex;
  align-items: center;
}

.username {
  margin-right: 15px;
  color: #083c52;
  line-height: normal;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-right: solid 0.5px #e6e6e6;
  padding-right: 15px;
  span {
    display: block;
    font-size: 8px;
  }
}
.logout-btn {
  color: #083c52;
  cursor: pointer;
  user-select: none;
  &:hover {
    color: rgba(8, 60, 82, 1);
  }
}
.logo {
  img {
    max-height: 35px;
    width: auto;
  }
}
</style>
