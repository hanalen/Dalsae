<template>
  <div>
    profile
  </div>
</template>

<style lang="scss" scoped>
#main {
  height: calc(100% - 120px) !important;
}
.bottom {
  display: flex;
}
.v-toolbar__content {
  align-items: baseline !important;
}
</style>

<script lang="ts">
import { Vue, Component, Mixins } from 'vue-property-decorator';
import * as I from '@/Interfaces';
import * as MIX from '@/mixins';

@Component
export default class ProfileView extends MIX.ProfilePage {
  async created() {
    console.log('profile window created');
    const id = this.$route.query.screenName;
    console.log('id: ' + id);
    console.log(this.$route);
  }
}
</script>
