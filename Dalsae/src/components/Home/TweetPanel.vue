<template>
  <div class="tweet-panel" ref="tweetPanel">
    <v-tabs v-model="tweetPanel.state.selectMenu" hide-slider hidden>
      <v-tab v-for="(item, i) in listMenu" :key="i">
        {{ item.name }}
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tweetPanel.state.selectMenu">
      <v-tab-item :key="0">
        <tweet-selector v-for="(item, i) in tweetHome" :key="i"></tweet-selector>
      </v-tab-item>
      <v-tab-item :key="1">
        <tweet-selector v-for="(item, i) in tweetMention" :key="i"></tweet-selector>
      </v-tab-item>
      <v-tab-item :key="2">
        <tweet-selector v-for="(item, i) in dm" :key="i"></tweet-selector>
      </v-tab-item>
      <v-tab-item :key="3">
        <tweet-selector v-for="(item, i) in tweetFavorite" :key="i"></tweet-selector>
      </v-tab-item>
      <v-tab-item :key="4">
        <tweet-selector v-for="(item, i) in tweetOpens" :key="i"></tweet-selector>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<style lang="scss" scoped></style>

<script lang="ts">
import { TweetPanelBase, DalsaePage } from '@/mixins';
import { Vue, Mixins, Component, Ref, Provide } from 'vue-property-decorator';

@Component
export default class TweetPanel extends Mixins(TweetPanelBase, DalsaePage) {
  listMenu = [
    { name: 'home', value: 0 },
    { name: 'mention', value: 1 },
    { name: 'dm', value: 2 },
    { name: 'favorite', value: 3 },
    { name: 'url', value: 4 }
  ];
}
</script>
