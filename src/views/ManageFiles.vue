<template>
  <div class="home tablebg">
    <a-row style="margin-bottom: 15px">
      <a-col span="24" class="text-right">
        <a-button
          size="medium"
          style="position: absolute; top: -40px; right: -13px"
          type="primary"
          @click="showModal(true)"
          >Upload New File</a-button
        >
      </a-col>
    </a-row>
    <a-table :columns="columns" :data-source="data" :filterSearch="true" :loading="loading">
      <template #headerCell="{ column }">
        <template v-if="column.key === 'nameFirst'">
          <span> Name </span>
        </template>
        <template v-else>
          <span> {{ column.name }} </span>
        </template>
      </template>

      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'nameFirst'">
          <a> {{ record }} </a>
        </template>
        <template v-if="column.key === 'action'">
          <span class="tableicons">
            <a-button type="text" size="small" @click="openEditmodal(record)"
              ><FormOutlined />Edit</a-button
            >
            <a-divider type="vertical" />
            <a-button type="text" danger size="small" @click="showDeleteConfirm(record)">
              <DeleteOutlined />Delete</a-button
            >
          </span>
        </template>
      </template>
    </a-table>
    <AddFiles
      v-if="isVisibleNewFileModal"
      :isVisibleNewFileModal="isVisibleNewFileModal"
      @updatemodal="showModal"
      @addfile="handleupload"
      :isEdit="isEdit"
      :editdata="editedFiledata"
    />
  </div>
</template>

<script>
// @ is an alias to /src
import { defineComponent, ref, createVNode, computed, watch } from 'vue';
import { useStore } from 'vuex';
import { useRequest } from 'vue-request';
import AddFiles from '../components/AddFiles.vue';
import { ExclamationCircleOutlined, FormOutlined, DeleteOutlined } from '@ant-design/icons-vue';
import { Modal } from 'ant-design-vue';
const columns = [
  { name: 'File Name', dataIndex: 'nameFirst', key: 'nameFirst' },
  { name: 'Action', dataIndex: 'action', key: 'action', width: '200px' }
];
export default defineComponent({
  components: {
    AddFiles,
    FormOutlined,
    DeleteOutlined
  },
  setup() {
    const store = useStore();
    // const { data } = useRequest(store.dispatch("users/userProvider"));
    watch(
      () => store.state.files.fetched,
      function (currentValue) {
        if (currentValue) {
          isVisibleNewFileModal.value = false;
          isEdit.value = false;
          editedFiledata.value = '';
        }
      }
    );
    // const { loading=false, addloading=false} = store.state.users
    const fetched = computed(() => store.state.files.fetched);
    const loading = computed(() => store.state.files.loading);
    const data = computed(() => store.state.files.fileList);
    // console.log("kkkk", toRaw(data));
    const isVisibleNewFileModal = ref(false);
    const isEdit = ref(false);
    const editedFiledata = ref('');
    const showModal = (isvisible) => {
      if (!isvisible && isEdit.value) {
        isEdit.value = false;
        editedFiledata.value = '';
      }
      isVisibleNewFileModal.value = isvisible;
    };
    const openEditmodal = (data) => {
      isEdit.value = true;
      editedFiledata.value = data;
      showModal(true);
    };

    store.dispatch('files/filesProvider', 'files');
    const showDeleteConfirm = (fileName) => {
      Modal.confirm({
        title: () => 'Are you sure you want to delete this file?',
        icon: () => createVNode(ExclamationCircleOutlined),
        okText: () => 'Yes',
        okType: 'danger',
        cancelText: () => 'No',

        onOk() {
          useRequest(store.dispatch('files/deleteFile', fileName));
        }
      });
    };
    const deleteUserHandler = (fileName) => {
      useRequest(store.dispatch('files/deleteFile', fileName));
    };
    const handleupload = (data, iseditparam) => {
      const datacopy = { ...data };
      const finalData = {
        ...datacopy,
        type: iseditparam ? 2 : 1
      };
      useRequest(store.dispatch('files/addNewFile', finalData));
      // useRequest(store.dispatch("users/addNewUser", data));
    };
    return {
      columns,
      loading,
      fetched,
      data,
      isVisibleNewFileModal,
      editedFiledata,
      showModal,
      handleupload,
      openEditmodal,
      isEdit,
      deleteUserHandler,
      showDeleteConfirm
      // data: () => useRequest(store.dispatch("users/userProvider")),
    };
  }
});
</script>
