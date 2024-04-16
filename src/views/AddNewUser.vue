<template>
  <div>
    <a-modal
      title="Create New User"
      v-model:visible="isVisible"
      :okText="isEditstate ? 'Update User' : 'Create User'"
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
          <a-form-item label="First Name" name="nameFirst" ref="nameFirst">
            <a-input v-model:value="formState.nameFirst" />
          </a-form-item>
          <a-form-item label="Last Name" name="nameLast" ref="nameLast">
            <a-input v-model:value="formState.nameLast" />
          </a-form-item>
          <a-form-item label="Emai ID" name="email" ref="email">
            <a-input v-model:value="formState.email" :disabled="isEditstate" />
          </a-form-item>
          <a-form-item label="Password" name="password" ref="password">
            <a-input v-model:value="formState.password" />
          </a-form-item>
          <a-form-item label="Company Name" name="company" ref="company">
            <a-input v-model:value="formState.company" />
          </a-form-item>
          <a-form-item label="User Role" name="roleId" ref="roleId">
            <a-select v-model:value="formState.roleId" placeholder="User Role">
              <a-select-option value="2">Admin</a-select-option>
              <a-select-option value="3">User</a-select-option>
            </a-select>
          </a-form-item>
        </a-form>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { defineComponent, reactive, toRaw, ref, computed } from 'vue';
import { useStore } from 'vuex';
export default defineComponent({
  props: ['isVisibleNewuserModal', 'showModal', 'editdata', 'isEdit'],
  setup(props, context) {
    const formRef = ref();
    const store = useStore();
    const isVisible = computed(() => props.isVisibleNewuserModal);
    const isEditstate = computed(() => props.isEdit);
    const editedusersdata = computed(() => props.editdata);
    const formState = reactive({
      nameFirst: isEditstate.value ? toRaw(editedusersdata.value).nameFirst : '',
      nameLast: isEditstate.value ? toRaw(editedusersdata.value).nameLast : '',
      email: isEditstate.value ? toRaw(editedusersdata.value).email : '',
      company: isEditstate.value ? toRaw(editedusersdata.value).company : '',
      password: '',
      roleId: isEditstate.value ? toRaw(editedusersdata.value).roleId.toString() : ''
    });
    // const { loading = false } = computed(() => store.state.users);
    const rules = {
      nameFirst: [
        {
          required: true,
          message: 'Please input First name',
          trigger: 'submit'
        }
      ],
      nameLast: [
        {
          required: true,
          message: 'Please input last name',
          trigger: 'submit'
        }
      ],
      email: [
        {
          required: true,
          message: 'Please input emailid',
          trigger: 'submit',
          type: 'email'
        }
      ],
      company: [
        {
          required: true,
          message: 'Please input company name',
          trigger: 'submit'
        }
      ],
      password: [
        {
          required: isEditstate.value ? false : true,
          message: 'Please input password',
          trigger: 'submit'
        }
      ],
      roleId: [
        {
          required: true,
          message: 'Please select user role',
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
      context.emit('addUser', data, handleSubmit);
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
      errmsg: computed(() => store.state.users.message)
    };
  }
});
</script>
