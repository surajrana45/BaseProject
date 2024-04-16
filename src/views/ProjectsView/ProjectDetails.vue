<template>
  <div class="projectdetails">
    <a-row>
      <a-col span="12"
        ><h3>{{ $route.query.title }}</h3></a-col
      >
      <a-col span="12" class="text-right" v-if="userType != 'User'">
        <a-button size="large" type="primary" @click="showModal(true)">Upload Excel</a-button>
      </a-col>
    </a-row>
    <a-row style="margin-bottom: 15px">
      <a-col :span="12" class="searchbox">
        <a-input placeholder="Search" @keyup="onSearch" v-model:value="searchvalue">
          <template #suffix>
            <a-tooltip title="Extra information">
              <SearchOutlined style="color: rgba(0, 0, 0, 0.45)" />
            </a-tooltip>
          </template>
        </a-input>
      </a-col>
    </a-row>
    <a-table
      :columns="columns"
      :data-source="dataCopy || []"
      :filterSearch="true"
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

      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'name'">
          <a> {{ record.name }} </a>
        </template>
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
            ><InProgress style="width: 18px; vertical-align: middle" /> In Progress</span
          >
          <span v-if="record.status == 2" style="color: green"
            ><CheckCircleOutlined /> Completed</span
          >
          <span v-if="record.status == 8" style="color: blueviolet"
            ><CloseCircleOutlined /> Aborted</span
          >
          <span v-if="record.status == 9" style="color: red"><CloseCircleOutlined /> Timeout</span>
        </template>
        <template v-if="column.key === 'queueNumber'">
          {{ record.queueNumber == -1 ? '-' : record.queueNumber }}
        </template>
        <template v-if="column.key === 'action'">
          <span>
            <a-tooltip title="Download Processed File">
              <a-button
                type="text"
                size="small"
                :disabled="record.status != 2"
                @click="
                  getdownload({
                    id: record.id,
                    name: record.name,
                    isSource: false
                  })
                "
                ><DownloadOutlined
              /></a-button>
            </a-tooltip>

            <a-divider type="vertical" />
            <a-tooltip title="Download Source File">
              <a-button
                type="text"
                size="small"
                style="color: #000"
                @click="
                  getdownload({
                    id: record.id,
                    name: record.name,
                    isSource: true
                  })
                "
                ><DownloadOutlined
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
      :isEdit="false"
      :isExcel="true"
      :editdata="{}"
      :loadingstate="loadingexcel"
    />
  </div>
</template>

<script>
// @ is an alias to /src
import { defineComponent, computed, ref, watch, onUnmounted, toRaw } from 'vue';
import { parseJwt } from '@/utils/funtions';
import { useStore } from 'vuex';
import { useRequest } from 'vue-request';
import { useRoute } from 'vue-router';
import { dateformat } from '../../utils/funtions';
import InProgress from '@/components/ProgressIcon.vue';
import {
  ProfileOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DownloadOutlined,
  SearchOutlined
} from '@ant-design/icons-vue';
import AddNewProject from './AddNewProject.vue';
const columns = [
  { name: 'Name', dataIndex: 'name', key: 'name' },
  {
    name: 'Created by',
    dataIndex: 'createdBy',
    key: 'createdBy'
  },
  {
    name: 'Created On',
    dataIndex: 'createdOn',
    key: 'createdOn'
  },
  {
    name: 'Total Download',
    dataIndex: 'downloadCount',
    key: 'downloadCount'
  },
  {
    name: 'Queue No',
    dataIndex: 'queueNumber',
    key: 'queueNumber'
  },
  { name: 'Staus', dataIndex: 'status', key: 'status', width: '200px' },
  { name: 'Action', dataIndex: 'action', key: 'action', width: '200px' }
];
export default defineComponent({
  props: ['projectName'],
  components: {
    ProfileOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    DownloadOutlined,
    AddNewProject,
    SearchOutlined,
    InProgress
  },
  setup(props) {
    const store = useStore();
    const isVisibleNewProjectModal = ref(false);
    const showModal = (isvisible) => {
      isVisibleNewProjectModal.value = isvisible;
    };
    const pagename = computed(() => props.projectName);
    const token = localStorage.getItem('auth_token');
    const userDetails = parseJwt(token);
    const userId = userDetails['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    const route = useRoute();
    const projectId = { id: route.params.id, isfirsttime: true };
    useRequest(store.dispatch('projects/getDownloadList', projectId));
    const timer = setInterval(() => {
      useRequest(
        store.dispatch('projects/getDownloadList', {
          id: route.params.id,
          isfirsttime: false
        })
      );
    }, 20000);
    onUnmounted(() => {
      clearTimeout(timer);
    });
    const searchvalue = ref('');
    const loading = computed(() => store.state.projects.loading);
    const loadingexcel = computed(() => store.state.projects.excelloading);
    const downloadlistData = computed(() => store.state.projects.downloadList);
    const dataCopy = ref(downloadlistData.value || []);
    const handleaddProject = (data) => {
      let datacopy = { ...data };
      datacopy['id'] = projectId.id;
      useRequest(store.dispatch('projects/uploadExcelfile', datacopy));
    };
    const onSearch = () => {
      const rawData = toRaw(downloadlistData.value);
      dataCopy.value = rawData.filter((item) => {
        const itemname = item.name.toLowerCase();
        return itemname.indexOf(searchvalue.value) > -1;
      });
    };
    const getdownload = (id) => {
      useRequest(store.dispatch('projects/downloadexcel', id));
    };
    const abortHandler = (id) => {
      useRequest(store.dispatch('logs/abortProcess', id));
    };
    watch(
      () => store.state.projects.fetched,
      function (currentValue) {
        if (currentValue) {
          isVisibleNewProjectModal.value = false;
        }
        // isVisibleNewuserModal.value = false;
      }
    );
    watch(
      () => store.state.projects.downloadList,
      function (currentValue) {
        if (currentValue) {
          dataCopy.value = store.state.projects.downloadList;
        }
      }
    );
    return {
      columns,
      userId,
      loading,
      downloadlistData,
      pagename,
      isVisibleNewProjectModal,
      loadingexcel,
      showModal,
      handleaddProject,
      getdownload,
      dateformat,
      searchvalue,
      dataCopy,
      onSearch,
      abortHandler
    };
  }
});
</script>
