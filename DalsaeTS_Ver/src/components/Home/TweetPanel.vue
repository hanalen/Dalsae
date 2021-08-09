<template>
  <div class="tweet-panel" ref="tweetPanel">
    <v-tabs v-model="tweetPanel.state.selectMenu" hide-slider hidden>
      <v-tab v-for="(item, i) in listMenu" :key="i">
        {{ item.name }}
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tweetPanel.state.selectMenu">
      <v-tab-item :key="0">
        <!-- <dynamic-scroller :items="tweetHome" :min-item-size="84" class="list" key-field="key">
          <template v-slot="{ item, index, active }">
            <dynamic-scroller-item
              :item="item"
              :active="active"
              :data-index="index"
              :data-active="active"
            >
              <tweet-selector :tweet="item" />
            </dynamic-scroller-item>
          </template>
        </dynamic-scroller> -->
        <!-- <virtual-list
          class="list-dynamic"
          :data-key="'key'"
          :data-sources="tweetHome"
          :data-component="itemComponent"
          :estimate-size="80"
          :item-class="'list-item-dynamic'"
        /> -->
        <scroll-panel :listData="tweetHome" />
        <!-- <tweet-selector v-for="(item, i) in tweetHome" :key="i" :tweet="item"></tweet-selector> -->
      </v-tab-item>
      <v-tab-item :key="1">
        <tweet-selector v-for="(item, i) in tweetMention" :key="i" :tweet="item"></tweet-selector>
      </v-tab-item>
      <v-tab-item :key="2">
        <tweet-selector v-for="(item, i) in dm" :key="i" :tweet="item"></tweet-selector>
      </v-tab-item>
      <v-tab-item :key="3">
        <tweet-selector v-for="(item, i) in tweetFavorite" :key="i" :tweet="item"></tweet-selector>
      </v-tab-item>
      <v-tab-item :key="4">
        <tweet-selector v-for="(item, i) in tweetOpens" :key="i" :tweet="item"></tweet-selector>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<style lang="scss" scoped>
.list {
  height: calc(100vh - 133px);
  overflow-y: auto;
}
</style>

<script lang="ts">
import { TweetPanelBase, DalsaePage } from '@/mixins';
import { Vue, Mixins, Component, Ref, Provide } from 'vue-property-decorator';
import TweetSelector from '@/components/Home/TweetSelector.vue';
import { Component as Compo } from 'vue';
@Component
export default class TweetPanel extends Mixins(TweetPanelBase, DalsaePage) {
  itemComponent: Compo = TweetSelector;
  listMenu = [
    { name: 'home', value: 0 },
    { name: 'mention', value: 1 },
    { name: 'dm', value: 2 },
    { name: 'favorite', value: 3 },
    { name: 'url', value: 4 }
  ];
}
</script>
