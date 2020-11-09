<template>
  <div class="ui-bottom">
    <!-- <v-footer> -->
    <v-btn>
      <v-icon>mdi-format-list-checkbox</v-icon>
    </v-btn>
    <v-btn icon rounded>
      <v-icon>mdi-home</v-icon>
    </v-btn>
    <v-btn icon rounded>
      <v-icon>mdi-bell-outline</v-icon>
    </v-btn>
    <v-btn icon rounded>
      <v-icon>mdi-email-outline</v-icon>
    </v-btn>
    <v-btn icon rounded>
      <v-icon>mdi-heart-outline</v-icon>
    </v-btn>
    <v-btn icon rounded>
      <v-icon>mdi-link</v-icon>
    </v-btn>
  </div>
  <!-- </v-footer> -->
</template>

<style lang="scss" scoped>
.ui-bottom {
  display: flex;
  place-items: 2px;
}
</style>

<script lang="ts">
import { DalsaeApp, DalsaePage } from '@/mixins';
import { Vue, Mixins, Component, Ref, Provide } from 'vue-property-decorator';

@Component
export default class Bottom extends Mixins(DalsaePage) {
  async created() {
    console.log('aaaaa');
  }
}
</script>
