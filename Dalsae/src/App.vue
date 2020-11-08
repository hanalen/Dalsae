<template>
  <v-app>
    <message-modal ref="messageModal"> </message-modal>
    <pin-modal ref="pinModal"></pin-modal>
    <v-app-bar app max-height="90">
      <top-selector> </top-selector>
    </v-app-bar>
    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>
    <v-bottom-navigation height="44"> </v-bottom-navigation>
  </v-app>
</template>

<style lang="scss" scoped>
.v-app-bar {
  box-shadow: none !important;
}
</style>

<script lang="ts">
import { DalsaeApp } from '@/mixins';
import { Vue, Mixins, Component, Ref, Provide } from 'vue-property-decorator';

@Component
export default class App extends Mixins(DalsaeApp) {
  async created() {
    console.log('aaaaa');
  }
}
</script>
