<template>
  <div class="tweet" v-if="tweet != undefined">
    {{ tweetText }}
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
