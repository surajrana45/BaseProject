<template>
  <div class="home tablebg">
    <a-table :columns="columns" :data-source="data || []" :filterSearch="true" :loading="loading">
      <template #headerCell="{ column }">
        <span> {{ column.name }} </span>
      </template>
      <template
        #customFilterDropdown="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
      >
        <div style="padding: 8px">
          <a-input
            ref="searchInput"
            :placeholder="`Search ${column.dataIndex}`"
            :value="selectedKeys[0]"
            style="width: 188px; margin-bottom: 8px; display: block"
            @change="(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])"
            @pressEnter="handleSearch(selectedKeys, confirm, column.dataIndex)"
          />
          <a-button
            type="primary"
            size="small"
            style="width: 90px; margin-right: 8px"
            @click="handleSearch(selectedKeys, confirm, column.dataIndex)"
          >
            <template #icon><SearchOutlined /></template>
            Search
          </a-button>
          <a-button size="small" style="width: 90px" @click="handleReset(clearFilters)">
            Reset
          </a-button>
        </div>
      </template>
      <template #customFilterIcon="{ filtered }">
        <SearchOutlined :style="{ color: filtered ? '#108ee9' : undefined }" />
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'createdOn'">
          {{ dateformat(record.createdOn, 'DD/MM/YYYY') }}
          <strong>{{ dateformat(record.createdOn, 'hh:mm A') }}</strong>
        </template>
        <template v-if="column.key === 'status'">
          <span v-if="record.status == 0" style="color: blue"
            ><ProfileOutlined /> Queued
            <a-button
              type="dashed"
              size="small"
              @click="abortHandler(record.id)"
              style="font-size: 14px; margin-left: 5px"
            >
              Abort</a-button
            >
          </span>
          <span v-if="record.status == 1" style="color: orange"
            ><InProgress style="width: 16px; vertical-align: middle" /> In Progress
          </span>
          <span v-if="record.status == 2" style="color: green"
            ><CheckCircleOutlined /> Completed</span
          >
          <span v-if="record.status == 9" style="color: red"><CloseCircleOutlined /> Timeout</span>
          <span v-if="record.status == 8" style="color: blueviolet"
            ><CloseCircleOutlined /> Aborted</span
          >
        </template>
        <template v-if="column.key === 'queueNumber'">
          {{ record.queueNumber == -1 ? '-' : record.queueNumber }}
        </template>
      </template>
    </a-table>
  </div>
</template>

<script>
// @ is an alias to /src
import { defineComponent, computed, onUnmounted, ref, reactive } from 'vue';
import { useStore } from 'vuex';
import { useRequest } from 'vue-request';
import { dateformat } from '../utils/funtions';
import InProgress from '@/components/ProgressIcon.vue';
import { SearchOutlined } from '@ant-design/icons-vue';

const searchInput = ref();
const columns = [
  {
    name: 'Name',
    dataIndex: 'name',
    key: 'name',
    customFilterDropdown: true,
    onFilter: (value, record) => record.name.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => {
          searchInput.value.focus();
        }, 100);
      }
    },
    sorter: (a, b) => a.name.length - b.name.length
  },
  {
    name: 'Project Name',
    dataIndex: 'masterName',
    key: 'masterName',
    sorter: (a, b) => a.masterName.length - b.masterName.length,
    customFilterDropdown: true,
    onFilter: (value, record) => record.name.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => {
          searchInput.value.focus();
        }, 100);
      }
    }
  },

  {
    name: 'Created by',
    dataIndex: 'createdBy',
    key: 'createdBy',
    sorter: (a, b) => a.createdBy.length - b.createdBy.length,
    customFilterDropdown: true,
    onFilter: (value, record) =>
      record.createdBy.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => {
          searchInput.value.focus();
        }, 100);
      }
    }
  },
  {
    name: 'Created on',
    dataIndex: 'createdOn',
    key: 'createdOn',
    sorter: (a, b) => new Date(a.createdOn) - new Date(b.createdOn)
  },
  {
    name: 'Total Download',
    dataIndex: 'downloadCount',
    key: 'downloadCount',
    sorter: (a, b) => a.downloadCount - b.downloadCount
  },
  {
    name: 'Queue No',
    dataIndex: 'queueNumber',
    key: 'queueNumber',
    sorter: (a, b) => a.queueNumber - b.queueNumber
  },
  {
    name: 'Staus',
    dataIndex: 'status',
    key: 'status',
    width: '200px',
    sorter: (a, b) => a.status - b.status
  }
];
export default defineComponent({
  components: {
    InProgress,
    SearchOutlined
  },
  setup() {
    const store = useStore();
    const fetched = computed(() => store.state.projects.fetched);
    const loading = computed(() => store.state.projects.loading);
    const data = computed(() => store.state.logs.macroinfoData);

    const state = reactive({
      searchText: '',
      searchedColumn: ''
    });
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
      confirm();
      state.searchText = selectedKeys[0];
      state.searchedColumn = dataIndex;
    };
    const handleReset = (clearFilters) => {
      clearFilters({
        confirm: true
      });
      state.searchText = '';
    };
    useRequest(store.dispatch('logs/fetchmacroinfo'));
    const abortHandler = (id) => {
      useRequest(store.dispatch('logs/abortProcess', id));
    };
    const timer = setInterval(() => {
      useRequest(store.dispatch('logs/fetchmacroinfo'));
    }, 20000);
    onUnmounted(() => {
      clearTimeout(timer);
    });
    const downloadlog = (filename) => {
      useRequest(store.dispatch('logs/downloadLog', filename));
    };
    return {
      columns,
      loading,
      fetched,
      data,
      downloadlog,
      dateformat,
      abortHandler,
      handleSearch,
      handleReset
    };
  }
});
</script>
