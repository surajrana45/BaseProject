<template>
  <div class="manageAccess">
    <a-modal
      title="Manage Access"
      v-model:visible="isVisible"
      width="60%"
      :style="{ maxWidth: 900 }"
      okText="Save"
      @ok="onSubmit"
      cancelText="Close"
      @cancel="cancelhandler"
    >
      <a-spin class="loading-spiner" size="large" v-if="loading"></a-spin>
      <a-transfer
        :data-source="userOnlyList"
        :list-style="{
          width: '50%',
          opacity: loading ? 0.5 : 1
        }"
        :titles="['Source', 'Target']"
        :target-keys="targetKeys"
        :selected-keys="selectedKeys"
        :render="(item) => `${item.email} - ${item.nameFirst} ${item.nameLast}`"
        @change="handleChange"
        @selectChange="handleSelectChange"
        @scroll="handleScroll"
      />
    </a-modal>
  </div>
</template>
<script>
import { defineComponent, computed, ref, toRaw, watch } from 'vue';
import { useStore } from 'vuex';
export default defineComponent({
  props: ['isVisibleAccessModal', 'currentProjectId'],
  setup(props, context) {
    const store = useStore();

    const isVisible = computed(() => props.isVisibleAccessModal);
    const projectId = computed(() => props.currentProjectId);
    store.dispatch('users/userOnly', 'usersOnly');
    store.dispatch('projects/getMasterAccess', projectId.value);
    const loading = computed(() => store.state.projects.loading);
    const masterAccessListdata = computed(() => store.state.projects.masterAccessList);
    const loadinguser = computed(() => store.state.users.loading);
    const postloading = computed(() => store.state.users.loadingpost);
    const targetKeys = ref([]);
    const selectedKeys = ref([]);
    const selecteduser = toRaw(masterAccessListdata.value);
    targetKeys.value = selecteduser;
    const userOnlyList = computed(() => store.getters['users/useronlyGetter']);
    const cancelhandler = () => {
      context.emit('updatemodal', false);
    };

    const handleChange = (nextTargetKeys) => {
      targetKeys.value = nextTargetKeys;
      // console.log("targetKeys: ", nextTargetKeys);
      // console.log("direction: ", direction);
      // console.log("moveKeys: ", moveKeys);
    };

    const handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
      selectedKeys.value = [...sourceSelectedKeys, ...targetSelectedKeys];
      // console.log("sourceSelectedKeys: ", sourceSelectedKeys);
      // console.log("targetSelectedKeys: ", targetSelectedKeys);
      // console.log("selectedKeys.value: ", selectedKeys.value);
    };
    const onSubmit = () => {
      const postData = {
        masterId: projectId.value,
        users: toRaw(targetKeys.value)
      };
      store.dispatch('projects/masterAccessPost', postData);
    };
    watch(
      () => store.state.projects.masterAccessList,
      function (currentValue) {
        if (currentValue) {
          targetKeys.value = store.state.projects.masterAccessList;
        }
        // isVisibleNewuserModal.value = false;
      }
    );
    return {
      loading,
      masterAccessListdata,
      userOnlyList,
      isVisible,
      cancelhandler,
      loadinguser,
      postloading,
      selectedKeys,
      /* handleTransferChange, */
      handleSelectChange,
      targetKeys,
      handleChange,
      onSubmit
    };
  }
});
</script>
