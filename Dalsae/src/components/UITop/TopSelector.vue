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
    <auto-complete></auto-complete>
  </div>
</template>

<style lang="scss" scoped></style>

<script lang="ts">
import { DalsaeApp } from '@/mixins';
import { Vue, Mixins, Component, Ref, Provide } from 'vue-property-decorator';
import * as I from '@/Managers/ErrorManager';
import store from '@/store';
import { moduleOption } from '@/store/modules/OptionStore';
@Component
export default class TopSelector extends Vue {
  listMsg = I.ErrorManager.instence().listMsg;
  get uiOption() {
    return moduleOption.uiOption;
  }
}
</script>
