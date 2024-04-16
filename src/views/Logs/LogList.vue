<template>
  <div class="home tablebg">
    <a-row style="margin-bottom: 15px">
      <!--  -->
    </a-row>
    <a-table :columns="columns" :data-source="data || []" :filterSearch="true" :loading="loading">
      <template #headerCell="{ column }">
        <span> {{ column.name }} </span>
      </template>

      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'name'">
          <a> {{ record }} </a>
        </template>
        <template v-else-if="column.key === 'action'">
          <span class="tableicons">
            <a-button type="text" size="small" @click="downloadlog(record)"
              ><DownloadOutlined />Download</a-button
            >
          </span>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script>
// @ is an alias to /src
import { defineComponent, computed } from 'vue';
import { useStore } from 'vuex';
import { useRequest } from 'vue-request';
import { DownloadOutlined } from '@ant-design/icons-vue';
const columns = [
  { name: 'Log Name', dataIndex: 'name', key: 'name' },
  { name: 'Action', dataIndex: 'action', key: 'action', width: '200px' }
];
export default defineComponent({
  components: {
    DownloadOutlined
  },
  setup() {
    const store = useStore();
    const fetched = computed(() => store.state.projects.fetched);
    const loading = computed(() => store.state.projects.loading);
    const data = computed(() => store.state.logs.logsData);
    useRequest(store.dispatch('logs/logsProvider'));
    const downloadlog = (filename) => {
      useRequest(store.dispatch('logs/downloadLog', filename));
    };
    return {
      columns,
      loading,
      fetched,
      data,
      downloadlog
    };
  }
});
</script>
