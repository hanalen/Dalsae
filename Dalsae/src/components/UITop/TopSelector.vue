<template>
  <div class="ui-top-selector">
    <slot>
      <top-big v-if="!uiOption.isSmallInput"> </top-big>
      <top-small v-if="uiOption.isSmallInput"> </top-small>
    </slot>
    <auto-complete></auto-complete>
  </div>
</template>

<style lang="scss" scoped>
.ui-top-selector {
  width: 100vw;
}
</style>

<script lang="ts">
import { DalsaeApp } from '@/mixins';
import { Vue, Mixins, Component, Ref, Provide } from 'vue-property-decorator';
import store from '@/store';
import { moduleOption } from '@/store/modules/OptionStore';
import { moduleModal } from '@/store/modules/ModalStore';
@Component
export default class TopSelector extends Vue {
  get uiOption() {
    return moduleOption.uiOption;
  }
}
</script>
