<template>
  <router-view></router-view>
</template>

<style lang="scss" src="@/Styles/vuetify.scss"></style>

<script lang="ts">
import { DalsaeApp } from '@/mixins';
import { Vue, Mixins, Component, Ref, Provide } from 'vue-property-decorator';

@Component
export default class App extends Vue {
  async created() {
    this.$nextTick(() => {
      const html = document.getElementsByTagName('html');
      html[0].style.setProperty('overflow-y', 'hidden');
      html[0].style.setProperty('-ms-user-select', 'none');
      html[0].style.setProperty('-moz-user-select', '-moz-none');
      html[0].style.setProperty('-webkit-user-select', 'none');
      html[0].style.setProperty('user-select', 'none');
      html[0].style.setProperty('-webkit-font-smoothing', 'antialiased');
    });
  }
}
</script>
