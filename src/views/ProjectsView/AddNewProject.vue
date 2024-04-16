<template>
  <div>
    <a-modal
      :title="isExcel ? 'Upload Excel' : isEditstate ? 'Update Project' : 'Create Project'"
      v-model:visible="isVisible"
      :okText="isExcel ? 'Upload Excel' : isEditstate ? 'Update Project' : 'Create Project'"
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
          <a-form-item label="Name" name="Name" ref="Name">
            <a-input v-model:value="formState.Name" />
          </a-form-item>
          <a-form-item label="Select Input File" name="template" v-if="!isExcelupload">
            <a-input
              type="file"
              name="template"
              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              @change="handlechangesTemplate"
              ref="template"
            />
          </a-form-item>
          <a-form-item
            :label="isExcelupload ? 'Select File' : 'Select Macro File'"
            name="file"
            ref="file"
          >
            <a-input
              v-if="isExcelupload"
              type="file"
              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              @change="handlechanges"
            />
            <a-input v-else type="file" accept=".xlsm" ref="file" @change="handlechanges" />
          </a-form-item>
        </a-form>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { defineComponent, reactive, toRaw, ref, computed } from 'vue';
import { useStore } from 'vuex';
import { parseJwt } from '../../utils/funtions.js';
export default defineComponent({
  props: ['isVisibleNewProjectModal', 'editdata', 'isEdit', 'loadingstate', 'isExcel'],
  components: {
    /* InboxOutlined, */
  },
  setup(props, context) {
    const formRef = ref();
    const userDetails = ref(parseJwt(localStorage.getItem('auth_token')));
    const store = useStore();
    const isVisible = computed(() => props.isVisibleNewProjectModal);
    const isEditstate = computed(() => props.isEdit);
    const isExcelupload = computed(() => props.isExcel);
    const loading = computed(() => props.loadingstate);
    const editedusersdata = computed(() => props.editdata);
    const formState = reactive({
      Name: isEditstate.value ? toRaw(editedusersdata.value).name : '',
      file: '',
      id: isEditstate.value ? toRaw(editedusersdata.value).id : 0
    });
    const handlechanges = (event) => {
      formState.file = event.target.files[0];
    };
    const handlechangesTemplate = (event) => {
      formState.template = event.target.files[0];
    };
    let rules = {};
    if (isExcelupload.value) {
      rules = {
        Name: [
          {
            required: true,
            message: 'Please enter name',
            trigger: 'submit'
          }
        ],
        file: [
          {
            required: true,
            message: 'Please select file',
            trigger: 'submit'
          }
        ]
      };
    } else {
      if (!isEditstate.value)
        rules = {
          Name: [
            {
              required: true,
              message: 'Please enter name',
              trigger: 'submit'
            }
          ],
          template: [
            {
              required: true,
              message: 'Please select file',
              trigger: 'submit'
            }
          ],
          file: [
            {
              required: true,
              message: 'Please select file',
              trigger: 'submit'
            }
          ]
        };
    }

    const cancelhandler = () => {
      context.emit('updatemodal', false);
    };
    const handleSubmit = (data, handleSubmit) => {
      context.emit('addProject', data, handleSubmit);
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
      cancelhandler,
      handleSubmit,
      editedusersdata,
      isEditstate,
      loading,
      isfetched: computed(() => store.state.projects.fetched),
      errmsg: computed(() => store.state.projects.message),
      handlechanges,
      handlechangesTemplate,
      userDetails,
      isExcelupload
    };
  }
});
</script>
