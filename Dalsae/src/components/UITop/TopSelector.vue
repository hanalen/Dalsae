<template>
  <div class="ui-top-selector">
    <slot>
      <div>
        <v-alert
          dense
          text
          :type="item.errorType"
          v-for="(item, i) in listMsg"
          :key="i"
          transition="scale-transition"
        >
          {{ item.msg }}
        </v-alert>
      </div>
      <top-big v-if="!uiOption.isSmallInput"> </top-big>
      <top-small v-if="uiOption.isSmallInput"> </top-small>
    </slot>
  </div>
</template>

<style lang="scss" scoped></style>

<script lang="ts">
import { DalsaeApp, DalsaePage } from '@/mixins';
import { Vue, Mixins, Component, Ref, Provide } from 'vue-property-decorator';
import * as I from '@/Managers/ErrorManager';
import store from '@/store';
@Component
export default class TopSelector extends Mixins(DalsaePage) {
  listMsg = I.ErrorManager.instence().listMsg;
  get uiOption() {
    return store.state.option.uiOption;
  }
}
</script>
