<template>
  <div ref="tweet" class="tweet">
    {{ tweet.full_text }}
  </div>
</template>

<style lang="scss" scoped></style>

<script lang="ts">
import { DalsaeApp, DalsaePage } from '@/mixins';
import { Vue, Mixins, Component, Ref, Provide, Inject, Prop } from 'vue-property-decorator';
import * as I from '@/Interfaces';
@Component
export default class TweetNormal extends Mixins(DalsaePage) {
  // @Inject()
  @Prop()
  tweet!: I.Tweet;

  async created() {
    console.log('aaaaa');
  }
}
</script>
