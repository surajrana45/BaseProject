export default {
  errorgetter: (state) => state.errormsg,
  userListFilter: (state) => state.userlist.filter((item) => item.roleId != 1),
  useronlyGetter: (state) =>
    state.useronlydata.map((item) => {
      let copyitem = { ...item };
      copyitem['key'] = item.email;

      return copyitem;
    })
};
