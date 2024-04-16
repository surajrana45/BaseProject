<template>
  <div class="home tablebg">
    <a-row style="margin-bottom: 15px">
      <a-col :span="12" class="searchbox"> </a-col>
      <a-col span="12" class="text-right" v-if="userType != 'User'">
        <a-button
          size="medium"
          style="position: absolute; top: -40px; right: -13px"
          type="primary"
          @click="showModal(true)"
          >Create New Project</a-button
        >
      </a-col>
    </a-row>
    <a-table
      :columns="columns"
      :data-source="dataCopy || []"
      :filterSearch="true"
      tableLayout="fixed"
      :loading="loading"
    >
      <template #headerCell="{ column }">
        <template v-if="column.key === 'nameFirst'">
          <span> Name </span>
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
            <a-tooltip title="Run Files">
              <a-button
                type="text"
                size="small"
                @click="
                  $router.push({
                    path: `projectdetails/${record.id}`,
                    query: { title: record.name }
                  })
                "
                ><PlayCircleOutlined
              /></a-button>
            </a-tooltip>
            <a-divider type="vertical" v-if="userType != 'User'" />
            <a-tooltip title="Manage Access">
              <a-button
                type="text"
                size="small"
                v-if="userType != 'User'"
                @click="handleAccessBtnClick(record.id)"
                ><ContactsOutlined
              /></a-button>
            </a-tooltip>

            <a-divider type="vertical" v-if="userType != 'User'" />
            <a-tooltip title="Edit">
              <a-button
                type="text"
                size="small"
                v-if="userType != 'User'"
                @click="openEditmodal(record)"
                ><FormOutlined
              /></a-button>
            </a-tooltip>

            <a-divider type="vertical" v-if="userType != 'User'" />
            <a-tooltip title="Download">
              <a-button
                type="text"
                size="small"
                v-if="userType != 'User'"
                @click="getdownload({ id: record.id, name: record.name })"
                ><img src="../../assets/xlsx.png" class="tablepngicon"
              /></a-button>
            </a-tooltip>

            <a-divider type="vertical" v-if="userType != 'User'" />
            <a-tooltip title="Download Input">
              <a-button
                type="text"
                size="small"
                @click="getdownloadtemplate({ id: record.id, name: record.name })"
                ><img src="../../assets/xlsm.png" class="tablepngicon"
              /></a-button>
            </a-tooltip>
            <a-divider type="vertical" v-if="userType != 'User'" />
            <a-tooltip title="Archive">
              <a-button
                danger
                type="text"
                size="small"
                v-if="userType != 'User'"
                @click="showDeleteConfirm(record.id)"
                ><DeleteOutlined
              /></a-button>
            </a-tooltip>
          </span>
        </template>
      </template>
    </a-table>
    <AddNewProject
      v-if="isVisibleNewProjectModal"
      :isVisibleNewProjectModal="isVisibleNewProjectModal"
      @updatemodal="showModal"
      @addProject="handleaddProject"
      :isEdit="isEdit"
      :editdata="editedusersdata"
      :loadingstate="loading"
    />
    <ManageAccess
      v-if="isVisibleAccessModal"
      :isVisibleAccessModal="isVisibleAccessModal"
      @updatemodal="updateAccessModal"
      :currentProjectId="currentProjectId"
    />
  </div>
</template>

<script>
// @ is an alias to /src
import { defineComponent, ref, createVNode, computed, watch, toRaw, reactive } from 'vue';
import { useStore } from 'vuex';
import { useRequest } from 'vue-request';
import AddNewProject from './AddNewProject.vue';
import ManageAccess from './ManageAccess.vue';
// import xlsx from "../../assets/xlsx.png";
import {
  ExclamationCircleOutlined,
  FormOutlined,
  DeleteOutlined,
  ContactsOutlined,
  PlayCircleOutlined,
  SearchOutlined
} from '@ant-design/icons-vue';
import { Modal } from 'ant-design-vue';
import { parseJwt } from '@/utils/funtions';

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
  { name: 'Action', dataIndex: 'action', key: 'action', width: '360px' }
];
export default defineComponent({
  components: {
    AddNewProject,
    FormOutlined,
    DeleteOutlined,
    ContactsOutlined,
    ManageAccess,
    PlayCircleOutlined,
    SearchOutlined
  },
  setup() {
    const store = useStore();
    const fetched = computed(() => store.state.projects.fetched);
    const loading = computed(() => store.state.projects.loading);
    const data = computed(() => store.state.projects.projectlist);
    const dataCopy = ref(data.value || []);

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
    const isVisibleNewProjectModal = ref(false);
    const userType = ref('');
    const token = localStorage.getItem('auth_token');
    if (token) {
      const userDetails = parseJwt(token);
      const userId = userDetails['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      userType.value = userId;
    }
    const searchvalue = ref('');
    const isEdit = ref(false);
    const editedusersdata = ref({});
    // ACCESS MODAL
    const isVisibleAccessModal = ref(false);
    const currentProjectId = ref(0);
    const updateAccessModal = (isvisible) => {
      isVisibleAccessModal.value = isvisible;
    };
    const getdownload = (id) => {
      useRequest(store.dispatch('projects/downloadMaster', id));
    };
    const getdownloadtemplate = (data) => {
      useRequest(store.dispatch('projects/downloadexcelTemplate', data));
    };
    const handleAccessBtnClick = (id) => {
      //console.log("idddd", id);
      currentProjectId.value = id;
      isVisibleAccessModal.value = true;
    };
    const onSearch = () => {
      const rawData = toRaw(data.value);
      dataCopy.value = rawData.filter((item) => {
        const itemname = item.name.toLowerCase();
        return itemname.indexOf(searchvalue.value) > -1;
      });
    };
    const showModal = (isvisible) => {
      if (!isvisible && isEdit.value) {
        isEdit.value = false;
        editedusersdata.value = {};
      }
      isVisibleNewProjectModal.value = isvisible;
    };
    const openEditmodal = (data) => {
      isEdit.value = true;
      editedusersdata.value = data;
      showModal(true);
    };
    store.dispatch('projects/projectProvider');
    const showDeleteConfirm = (id) => {
      Modal.confirm({
        title: () => 'Are you sure you want to archive this project?',
        icon: () => createVNode(ExclamationCircleOutlined),
        okText: () => 'Yes',
        okType: 'danger',
        cancelText: () => 'No',

        onOk() {
          useRequest(
            store.dispatch('projects/deleteProject', {
              id: id,
              isArchived: true
            })
          );
        }
      });
    };
    const deleteProjectHandler = (emaiid) => {
      useRequest(store.dispatch('projects/deleteProject', emaiid));
    };
    const handleaddProject = (data, iseditparam) => {
      if (iseditparam) {
        useRequest(store.dispatch('projects/addNewProject', data));
      } else {
        useRequest(store.dispatch('projects/addNewProject', data));
      }
    };
    watch(
      () => store.state.projects.fetched,
      function (currentValue) {
        if (currentValue) {
          isVisibleNewProjectModal.value = false;
          isVisibleAccessModal.value = false;
          isEdit.value = false;
          editedusersdata.value = {};
        }
      }
    );
    watch(
      () => store.state.projects.projectlist,
      function (currentValue) {
        if (currentValue) {
          dataCopy.value = store.state.projects.projectlist;
        }
      }
    );
    return {
      columns,
      loading,
      fetched,
      data,
      dataCopy,
      isVisibleNewProjectModal,
      editedusersdata,
      showModal,
      handleaddProject,
      openEditmodal,
      isEdit,
      deleteProjectHandler,
      showDeleteConfirm,
      isVisibleAccessModal,
      currentProjectId,
      updateAccessModal,
      handleAccessBtnClick,
      userType,
      getdownload,
      getdownloadtemplate,
      searchvalue,
      onSearch,
      handleSearch,
      handleReset
    };
  }
});
</script>
