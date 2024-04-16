<template>
  <div>
    <a-modal
      title="Upload File"
      v-model:visible="isVisible"
      :okText="isEditstate ? 'Update file' : 'Upload new file'"
      @ok="onSubmit"
      @cancel="cancelhandler"
    >
      <div class="add-user">
        <a-alert v-if="errmsg != ''" :message="errmsg" type="error" />
        <a-spin class="loading-spiner" size="large" v-if="loading"></a-spin>
        <a-form
          ref="formRef"
          :model="formState"
          :rules="rules"
          layout="vertical"
          @submit="onSubmit"
          :class="{ 'loading-content': loading }"
        >
          <a-input type="file" name="files" @change="handlechanges" ref="files" />
        </a-form>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { defineComponent, reactive, toRaw, ref, computed } from 'vue';
import { useStore } from 'vuex';
export default defineComponent({
  props: ['isVisibleNewFileModal', 'showModal', 'editdata', 'isEdit'],
  setup(props, context) {
    const formRef = ref();
    const store = useStore();
    const isVisible = computed(() => props.isVisibleNewFileModal);
    const isEditstate = computed(() => props.isEdit);
    const editedusersdata = computed(() => props.editdata);
    const formState = reactive({
      file: ''
    });
    const handlechanges = (event) => {
      formState.file = event.target.files[0];
    };
    // const { loading = false } = computed(() => store.state.users);
    const rules = {
      file: [
        {
          required: true,
          message: 'Please select file',
          trigger: 'submit'
        }
      ]
    };
    const okhandler = () => {
      // console.log("kkkk");
    };
    const cancelhandler = () => {
      context.emit('updatemodal', false);
    };
    const handleSubmit = (data, handleSubmit) => {
      context.emit('addfile', data, handleSubmit);
    };
    const onSubmit = () => {
      formRef.value
        .validate()
        .then(() => {
          handleSubmit(toRaw(formState), isEditstate.value);
        })
        .catch((error) => {
          console.log('error', error);
        });
    };

    return {
      formRef,
      formState,
      onSubmit,
      rules,
      isVisible,
      okhandler,
      cancelhandler,
      handleSubmit,
      editedusersdata,
      isEditstate,
      loading: computed(() => store.state.users.loading),
      isfetched: computed(() => store.state.users.fetched),
      errmsg: computed(() => store.state.users.message),
      handlechanges
    };
  }
});
</script>
