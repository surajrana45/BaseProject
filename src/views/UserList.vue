<template>
  <div class="home tablebg">
    <a-row style="margin-bottom: 15px">
      <a-col span="24" class="text-right">
        <a-button
          size="medium"
          style="position: absolute; top: -40px; right: -13px"
          type="primary"
          @click="showModal(true)"
          >Create New User</a-button
        >
      </a-col> </a-row
    >{{ userlist }}
    <a-table :columns="columns" :data-source="data" :filterSearch="true" :loading="loading">
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
        <template v-if="column.key === 'nameFirst'">
          <a> {{ record.nameFirst }} {{ record.nameLast }} </a>
        </template>
        <template v-if="column.key === 'roleId'">
          {{ record.roleId == 2 ? 'Admin' : 'User' }}
        </template>
        <template v-if="column.key === 'action'">
          <span class="tableicons">
            <a-button type="text" size="small" @click="openEditmodal(record)"
              ><FormOutlined />Edit</a-button
            >
            <a-divider type="vertical" />
            <a-button type="text" danger size="small" @click="showDeleteConfirm(record.email)">
              <DeleteOutlined />Delete</a-button
            >
          </span>
        </template>
      </template>
    </a-table>
    <AddNewUser
      v-if="isVisibleNewuserModal"
      :isVisibleNewuserModal="isVisibleNewuserModal"
      @updatemodal="showModal"
      @addUser="handleadduser"
      :isEdit="isEdit"
      :editdata="editedusersdata"
    />
  </div>
</template>

<script>
// @ is an alias to /src
import { defineComponent, ref, createVNode, computed, watch, reactive } from 'vue';
import { useStore } from 'vuex';
import { useRequest } from 'vue-request';
import AddNewUser from './AddNewUser.vue';
import { parseJwt } from '@/utils/funtions';
import {
  ExclamationCircleOutlined,
  FormOutlined,
  DeleteOutlined,
  SearchOutlined
} from '@ant-design/icons-vue';
import { Modal } from 'ant-design-vue';

const searchInput = ref();
const columns = [
  {
    name: 'Name',
    dataIndex: 'nameFirst',
    key: 'nameFirst',
    customFilterDropdown: true,
    onFilter: (value, record) =>
      record.nameFirst.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => {
          searchInput.value.focus();
        }, 100);
      }
    },
    sorter: (a, b) => a.nameFirst.length - b.nameFirst.length
  },
  {
    name: 'User Type',
    dataIndex: 'roleId',
    key: 'roleId',
    onFilter: (value, record) =>
      record.roleId.toString().toLowerCase().includes(value.toLowerCase()),
    sorter: (a, b) => a.roleId - b.roleId
  },
  {
    name: 'Company',
    dataIndex: 'company',
    key: 'company',
    customFilterDropdown: true,
    onFilter: (value, record) =>
      record.company.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => {
          searchInput.value.focus();
        }, 100);
      }
    },
    sorter: (a, b) => a.company.length - b.company.length
  },
  {
    name: 'Email ID',
    dataIndex: 'email',
    key: 'email',
    customFilterDropdown: true,
    onFilter: (value, record) =>
      record.email.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => {
          searchInput.value.focus();
        }, 100);
      }
    },
    sorter: (a, b) => a.email.length - b.email.length
  },
  { name: 'Action', dataIndex: 'action', key: 'action', width: '200px' }
];
export default defineComponent({
  components: {
    AddNewUser,
    FormOutlined,
    DeleteOutlined,
    SearchOutlined
  },
  setup() {
    const store = useStore();
    // const { data } = useRequest(store.dispatch("users/userProvider"));
    const token = localStorage.getItem('auth_token');
    const userDetails = parseJwt(token);
    const userId = userDetails['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    // const { loading=false, addloading=false} = store.state.users
    const fetched = computed(() => store.state.users.fetched);
    const loading = computed(() => store.state.users.loading);
    const data = computed(() => store.getters['users/userListFilter']);
    // console.log("kkkk", toRaw(data));
    const isVisibleNewuserModal = ref(false);
    const isEdit = ref(false);
    const editedusersdata = ref({});
    const showModal = (isvisible) => {
      if (!isvisible && isEdit.value) {
        isEdit.value = false;
        editedusersdata.value = {};
      }
      isVisibleNewuserModal.value = isvisible;
    };
    const openEditmodal = (data) => {
      isEdit.value = true;
      editedusersdata.value = data;
      showModal(true);
    };

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

    store.dispatch('users/userProvider', userId == 'Admin' ? `users` : `usersOnly`);
    const showDeleteConfirm = (emailid) => {
      Modal.confirm({
        title: () => 'Are you sure you want to delete this user?',
        icon: () => createVNode(ExclamationCircleOutlined),
        okText: () => 'Yes',
        okType: 'danger',
        cancelText: () => 'No',

        onOk() {
          useRequest(
            store.dispatch('users/deleteUser', {
              emailid: emailid,
              userType: userId == 'Admin' ? `users` : `usersOnly`
            })
          );
        }
      });
    };
    const deleteUserHandler = (emailid) => {
      useRequest(
        store.dispatch('users/deleteUser', {
          emailid: emailid,
          userType: userId == 'Admin' ? `users` : `usersOnly`
        })
      );
    };
    const handleadduser = (data, iseditparam) => {
      const datacopy = { ...data };
      const finalData = {
        ...datacopy,
        userType: userId == 'Admin' ? `users` : `usersOnly`
      };
      if (iseditparam) {
        useRequest(store.dispatch('users/addNewUser', finalData));
      } else {
        useRequest(store.dispatch('users/addNewUser', finalData));
      }
      // useRequest(store.dispatch("users/addNewUser", data));
    };
    watch(
      () => store.state.users.fetched,
      function (currentValue) {
        if (currentValue) {
          isVisibleNewuserModal.value = false;
          isEdit.value = false;
          editedusersdata.value = {};
        }
        // isVisibleNewuserModal.value = false;
      }
    );
    return {
      columns,
      // loading: computed(() => store.state.users.loading),
      loading,
      fetched,
      // fetched: computed(() => store.state.users.fetched),
      // data: computed(() => store.state.users.userlist),
      data,
      isVisibleNewuserModal,
      editedusersdata,
      showModal,
      handleadduser,
      openEditmodal,
      isEdit,
      deleteUserHandler,
      showDeleteConfirm,
      handleSearch,
      handleReset
      // data: () => useRequest(store.dispatch("users/userProvider")),
    };
  }
});
</script>
