<template>
  <div class="login-page">
    <div class="bgimag"></div>
    <div class="auth-page-content">
      <div class="auth-container">
        <a-spin class="loading-spiner" size="large" v-if="loading"></a-spin>
        <a-row style="background-color: #fff">
          <a-col :span="12">
            <div class="auth-one-bg">
              <img src="../assets/auth-screens.png" alt="" />
              <!-- <div class="bg-overlay"></div>
              <div class="quotes">
                <div class="quote-ctrl">
                  <a-carousel autoplay :autoPlaySpeed="3000">
                    <div v-for="(item, index) in settings.quotes" :key="index" v-html="item"></div>
                  </a-carousel>
                </div>
              </div> -->
            </div>
          </a-col>
          <a-col :span="12">
            <div :class="{ 'login-ctrl': true, 'loading-content': loading }">
              <div class="Sign">
                <h2 class="title">Welcome Back !</h2>
                <p class="login-description">Sign in to continue to {{ settings.clientName }}</p>
                <a-space wrap>
                  <a-button class="googlebtn" @click="signInWithGoogle">
                    <img src="../assets/logo.png" alt="Google Icon" class="google-icon" />
                    Sign in with Google
                  </a-button>
                </a-space>
              </div>

              <!-- </div> -->
              <a-divider plain class="italic">Or with email</a-divider>
              <a-alert v-if="errmsg != ''" :message="errmsg" type="error" />
              <a-form
                ref="formRef"
                :model="formState"
                :rules="rules"
                layout="vertical"
                @submit="onSubmit"
              >
                <a-form-item ref="userName" label="Username / Email ID" name="userName">
                  <a-input size="large" v-model:value="formState.userName" />
                </a-form-item>
                <a-form-item ref="key" label="Password" name="key">
                  <a-input size="large" v-model:value="formState.key" type="password" />
                </a-form-item>
                <a-form-item>
                  <a-button size="large" @click="onSubmit" type="primary" block>Sign In</a-button>
                </a-form-item>
              </a-form>
            </div>
          </a-col>
        </a-row>
      </div>
      <CopyRight :copyrighttext="settings.copyrightText" />
    </div>
  </div>
</template>
<script>
// @ is an alias to /src
import { defineComponent, reactive, ref, toRaw, computed, onBeforeMount } from 'vue';
import { useStore } from 'vuex';
import CopyRight from '@/components/CopyRight.vue';
export default defineComponent({
  components: {
    CopyRight
  },
  setup() {
    const store = useStore();
    /* const loginstate = toRaw(store.state.login);
    const { isAuthenticated = false } = loginstate; */

    const formRef = ref();
    const userInfoData = ref();
    const browserName = ref();
    const userInfo = computed(() => store.state.login.userInfo);
    const settings = computed(() => store.state.login.settings);
    const formState = reactive({
      userName: '',
      key: '',
      userInfo: {}
    });
    const rules = {
      userName: [{ type: 'email', required: true, trigger: 'change' }],
      key: [
        {
          required: true,
          message: 'This field is required',
          trigger: 'blur'
        }
      ]
    };
    if ((navigator.userAgent.indexOf('Opera') || navigator.userAgent.indexOf('OPR')) != -1) {
      browserName.value = 'Opera';
    } else if (navigator.userAgent.indexOf('Edg') != -1) {
      browserName.value = 'Edge';
    } else if (navigator.userAgent.indexOf('Chrome') != -1) {
      browserName.value = 'Chrome';
    } else if (navigator.userAgent.indexOf('Safari') != -1) {
      browserName.value = 'Safari';
    } else if (navigator.userAgent.indexOf('Firefox') != -1) {
      browserName.value = 'Firefox';
    } else if (navigator.userAgent.indexOf('MSIE') != -1 || !!document.documentMode == true) {
      //IF IE > 10
      browserName.value = 'IE';
    } else {
      browserName.value = 'unknown';
    }
    onBeforeMount(() => {
      store.dispatch('login/getUserData');
    });

    const onSubmit = () => {
      const userinforaw = toRaw(userInfo.value);
      const userinfoObj = {
        ip: userinforaw.query,
        city: userinforaw.city,
        country: userinforaw.country,
        browserName: browserName.value
      };
      let postData = toRaw(formState);
      postData.userInfo = userinfoObj;
      formRef.value
        .validate()
        .then(() => {
          store.dispatch('login/loginAction', toRaw(postData));
        })
        .catch((error) => {
          console.log('error', error);
        });
    };
    /* isAuthenticated && router.push({ path: "dashboard" }); */
    const resetForm = () => {
      formRef.value.resetFields();
    };

    return {
      formRef,
      labelCol: {
        span: 4
      },
      wrapperCol: {
        span: 14
      },
      other: '',
      formState,
      rules,
      onSubmit,
      resetForm,
      errmsg: computed(() => store.state.login['errormsg']),
      loading: computed(() => store.state.login['loading']),
      userInfo,
      userInfoData,
      browserName,
      settings
    };
  }
});
</script>
<style lang="scss" scoped>
.login-ctrl {
  background-color: #fff;
  padding: 60px 50px;
  h2 {
    font-size: 18px;
    font-weight: 600;
    color: rgb(64, 81, 137);
    margin-bottom: 0;
  }
  .login-description {
    font-size: 16px;
    font-style: italic;
    margin-bottom: 50px;
    color: #696969;
    font-weight: 500;
  }
}
//.quotes {
// width: 100%;
// height: calc(100% - 160px);
// display: flex;
// align-items: center;
// position: relative;
// z-index: 5;
// padding: 5px 50px;
// .quote-ctrl {
//   display: block;
//   width: 100%;
//   text-align: center;
//   font-size: 18px;
//   color: #ccc;
//   }
// }
.client-logo {
  width: 150px;
  margin: 15px;
  z-index: 99;
  position: relative;
}
.login-page {
  background: linear-gradient(-45deg, #0d6efd 50%, #198754);
  width: 100%;
  min-height: 100vh;
  padding-top: 60px;
  overflow: auto;
  align-items: center;
  display: flex;
}

.Sign {
  margin-left: 26%;
}

.title {
  margin-left: 18%;
  color: rgb(174, 174, 253);
}

.googlebtn {
  margin-left: 72px;
}

.Sign img {
  height: 16px;
  width: 16px;
  margin: 0px 8px 0px 0px;
}

// .login-description {
//   margin-right: 12px;
// }

// .bgimag {
//   position: absolute;
//   background-image: url(../assets/cover-pattern.png);
//   width: 100%;
//   height: 100%;
//   opacity: 1;
//   bottom: 0;
//   top: 0;
//   right: 0;
//   left: 0;
// }
.auth-page-content {
  position: relative;
  width: 100%;
  padding-bottom: 20px;
  height: 100%;
}
.auth-container {
  width: 100%;
  max-width: 100%;
  margin-right: auto;
  margin-left: auto;
}

.auth-one-bg {
  // background-image: url(../assets/auth-one-bg.jpg);
  background-position: center;
  background-size: cover;
  height: 80vh;
  background-color: blue;
}

.auth-one-bg img {
  height: 500px;
  margin: 40px 0 0 40px;
}

// .bg-overlay {
//   position: absolute;
//   height: 100%;
//   width: 100%;
//   right: 0;
//   bottom: 0;
//   left: 0;
//   top: 0;
//   opacity: 0.7;
//   background-color: #000;
// }
// .bg-overlay {
//   background: -webkit-gradient(linear, left top, right top, from(#364574), to(#405189));
//   background: linear-gradient(to right, #364574, #405189);
//   opacity: 0.9;
//   background-color: #000;
//   z-index: 2;
// }
</style>
