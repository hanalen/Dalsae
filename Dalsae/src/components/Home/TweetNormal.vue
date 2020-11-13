<template>
  <div class="tweet">
    <div class="tweet-conv"></div>
    <div class="tweet-left">
      <propic :user="orgUser"></propic>
    </div>
    <div class="tweet-right">
      {{ tweetText }}
    </div>
  </div>
</template>

<style lang="scss" scoped></style>

<script lang="ts">
import { DalsaeApp, DalsaePage, TweetBase } from '@/mixins';
import { Vue, Mixins, Component, Ref, Provide, Inject, Prop } from 'vue-property-decorator';
import * as I from '@/Interfaces';
@Component
export default class TweetNormal extends Mixins(TweetBase) {}
</script>
