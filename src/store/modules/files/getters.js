export default {
  errorgetter: (state) => state.errormsg,
  useronlyGetter: (state) =>
    state.useronlydata.map((item) => {
      let copyitem = { ...item };
      copyitem['key'] = item.email;

      return copyitem;
    })
};
