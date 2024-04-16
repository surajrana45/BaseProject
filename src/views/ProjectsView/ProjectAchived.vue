<template>
  <div class="home tablebg">
    <a-table :columns="columns" :data-source="data || []" :filterSearch="true" :loading="loading">
      <template #headerCell="{ column }">
        <template v-if="column.key === 'nameFirst'">
          <span> Name</span>
        </template>
        <template v-else>
          <span> {{ column.name }} </span>
        </template>
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
        <template v-if="column.key === 'name'">
          <a> {{ record.name }} </a>
        </template>
        <template v-else-if="column.key === 'action'">
          <span class="tableicons">
            <a-button type="text" size="small" @click="showRestoreConfirm(record.id)"
              ><FileAddOutlined />Restore</a-button
            >
          </span>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script>
// @ is an alias to /src
import { defineComponent, ref, createVNode, computed, reactive } from 'vue';
import { useStore } from 'vuex';
import { useRequest } from 'vue-request';
import { FileAddOutlined, ExclamationCircleOutlined, SearchOutlined } from '@ant-design/icons-vue';
import { parseJwt } from '@/utils/funtions';
import { Modal } from 'ant-design-vue';

export default defineComponent({
  components: {
    FileAddOutlined,
    SearchOutlined
  },
  setup() {
    const store = useStore();
    const fetched = computed(() => store.state.projects.fetched);
    const loading = computed(() => store.state.projects.loading);
    const data = computed(() => store.state.projects.archiveddata);
    const userType = ref('');
    const searchInput = ref();

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
    const token = localStorage.getItem('auth_token');
    if (token) {
      const userDetails = parseJwt(token);
      const userId = userDetails['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      userType.value = userId;
    }
    let columns = [
      { name: 'id', dataIndex: 'id', key: 'id', width: '70px' },
      {
        name: 'Name',
        dataIndex: 'name',
        key: 'name',
        width: '40%',
        customFilterDropdown: true,
        onFilter: (value, record) =>
          record.name.toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
          if (visible) {
            setTimeout(() => {
              searchInput.value.focus();
            }, 100);
          }
        },
        sorter: (a, b) => a.name.length - b.name.length
      },
      { name: 'Action', dataIndex: 'action', key: 'action' }
    ];
    store.dispatch('projects/getArchivedList');
    const showRestoreConfirm = (id) => {
      Modal.confirm({
        title: () => 'Are you sure you want to restore this project?',
        icon: () => createVNode(ExclamationCircleOutlined),
        okText: () => 'Yes',
        okType: 'danger',
        cancelText: () => 'No',

        onOk() {
          useRequest(
            store.dispatch('projects/deleteProject', {
              id: id,
              isArchived: false
            })
          );
        }
      });
    };

    return {
      columns,
      loading,
      fetched,
      data,
      showRestoreConfirm,
      userType,
      handleSearch,
      handleReset
    };
  }
});
</script>
