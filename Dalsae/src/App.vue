<template>
  <v-app>
    <message-modal ref="messageModal"> </message-modal>
    <pin-modal ref="pinModal"></pin-modal>
    <v-app-bar app max-height="90" height="90">
      <top-selector> </top-selector>
    </v-app-bar>
    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>
    <v-footer app fixed height="44" color="gray">
      <bottom></bottom>
    </v-footer>
  </v-app>
</template>

<style lang="scss" src="@/Styles/vuetify.scss"></style>

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
