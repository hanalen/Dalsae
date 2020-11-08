<template>
  <div class="ui-top-selector">
    <slot>werer</slot>
  </div>
</template>

<style lang="scss" scoped></style>

<script lang="ts">
import { DalsaeApp, DalsaePage } from '@/mixins';
import { Vue, Mixins, Component, Ref, Provide } from 'vue-property-decorator';

@Component
export default class TopSelector extends Mixins(DalsaePage) {
  async created() {
    console.log('aaaaa');
  }
}
</script>
