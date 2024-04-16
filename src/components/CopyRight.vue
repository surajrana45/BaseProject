<template>
  <div class="copyright" v-html="copyrighttext"></div>
</template>
<script>
import { defineComponent } from 'vue';
export default defineComponent({
  props: ['copyrighttext']
});
</script>
<style lang="scss">
.copyright {
  font-size: 14px;
  color: #cbcbcb;
  text-align: center;
  margin: 15px 0;
  margin-top: 5vh;
  &.inneerpage {
    position: fixed;
    width: 100%;
    left: 0;
    bottom: 0;
    margin: 0;
    color: #8c8d8e;
    background-color: #f4f8f9;
    padding: 5px;
    font-size: 14px;
    margin-top: 0;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
