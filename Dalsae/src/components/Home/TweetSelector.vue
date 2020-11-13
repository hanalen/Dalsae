<template>
  <div class="tweet-selector">
    <tweet-small :tweet="tweet" v-if="isSmall"> </tweet-small>
    <tweet-normal :tweet="tweet" v-if="isNormal"> </tweet-normal>
  </div>
</template>

<style lang="scss" scoped></style>

<script lang="ts">
import { DalsaeApp, TweetSelectorBase } from '@/mixins';
import { Vue, Mixins, Component, Ref, Provide } from 'vue-property-decorator';

@Component
export default class TweetSelector extends Mixins(TweetSelectorBase) {}
</script>
