<template>
  <div class="ui-top-small">
    <tweet-input-small />
  </div>
</template>

<style lang="scss" scoped>
.ui-top-small {
  height: 30;
  padding: 4px;
}
</style>

<script lang="ts">
import { DalsaeApp } from '@/mixins';
import { Vue, Mixins, Component, Ref, Provide } from 'vue-property-decorator';

@Component
export default class TopSmall extends Vue {}
</script>
