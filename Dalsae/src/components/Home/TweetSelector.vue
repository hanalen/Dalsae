/* eslint-disable vue/no-unused-vars */
<template>
  <div class="tweet-selector" @click="OnClickTweet" @contextmenu="OnContext">
    <tweet-small :tweet="tweet" :selected="selected" v-if="isSmall"> </tweet-small>
    <tweet-normal :tweet="tweet" :selected="selected" v-if="isNormal"> </tweet-normal>
    <v-menu v-model="isShowContext" :position-x="x" :position-y="y" absolute offset-y>
      <v-list>
        <v-list-item v-for="(item, index) in listContext" :key="index" link>
          <v-list-item-title @click="item.click">{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<style lang="scss" scoped></style>

<script lang="ts">
import { DalsaeApp, TweetSelectorBase } from '@/mixins';
import { Vue, Mixins, Component, Ref, Provide } from 'vue-property-decorator';

@Component
export default class TweetSelector extends Mixins(TweetSelectorBase) {}
</script>
