<template>
  <div class="Help">
    <template v-if="userType != 'User'">
      <iframe
        width="560"
        height="315"
        v-if="data?.admin.help?.youtubeVideoID"
        :src="`https://www.youtube.com/embed/${data?.admin.help?.youtubeVideoID}`"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
      ></iframe>
      <div v-for="(item, index) in data?.admin.help?.content" :key="index" v-html="item"></div>
    </template>
    <template v-else>
      <iframe
        width="560"
        height="315"
        v-if="data?.user.help?.youtubeVideoID"
        :src="`https://www.youtube.com/embed/${data?.user.help?.youtubeVideoID}`"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
      ></iframe>
      <div v-for="(item, index) in data?.user.help?.content" :key="index" v-html="item"></div>
    </template>
  </div>
</template>

<script>
// @ is an alias to /src
import { defineComponent, computed, ref } from 'vue';
import { useStore } from 'vuex';
import { parseJwt } from '@/utils/funtions';
const columns = [
  { name: 'Log Name', dataIndex: 'name', key: 'name' },
  { name: 'Action', dataIndex: 'action', key: 'action', width: '200px' }
];
export default defineComponent({
  setup() {
    const store = useStore();
    const fetched = computed(() => store.state.projects.fetched);
    const loading = computed(() => store.state.projects.loading);
    const data = computed(() => store.state.login.settings);
    const userType = ref('User');
    const token = localStorage.getItem('auth_token');
    const userDetails = parseJwt(token);
    const userrole = userDetails['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    userType.value = userrole;
    return {
      columns,
      loading,
      fetched,
      data,
      userType
    };
  }
});
</script>
