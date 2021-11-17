<template>
  <div class="tweet-panel" ref="tweetPanel">
    <v-tabs v-model="selectMenu" hide-slider hidden>
      <v-tab v-for="(item, i) in listMenu" :key="i">
        {{ item.name }}
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="selectMenu">
      <v-tab-item :key="0">
        <v-progress-circular
          v-if="isLoadHome"
          :width="3"
          color="primary"
          indeterminate
        ></v-progress-circular>
        <scroll-panel
          :listData="tweetHome"
          :itemType="'tweet'"
          :tweetType="home"
          :indexPanel="indexHome"
          :style="stylePanel"
        />
      </v-tab-item>
      <v-tab-item :key="1">
        <v-progress-circular
          v-if="isLoadMention"
          :width="3"
          color="primary"
          indeterminate
        ></v-progress-circular>
        <scroll-panel
          :listData="tweetMention"
          :itemType="'tweet'"
          :tweetType="mention"
          :indexPanel="indexMention"
          :style="stylePanel"
        />
      </v-tab-item>
      <v-tab-item :key="2">
        <dm-panel />
      </v-tab-item>
      <v-tab-item :key="3">
        <v-progress-circular
          v-if="isLoadFavorite"
          :width="3"
          color="primary"
          indeterminate
        ></v-progress-circular>
        <scroll-panel
          :listData="tweetFavorite"
          :itemType="'tweet'"
          :tweetType="favorite"
          :indexPanel="indexFavorite"
          :style="stylePanel"
        />
      </v-tab-item>
      <v-tab-item :key="4">
        <scroll-panel
          :listData="tweetOpen"
          :itemType="'tweet'"
          :tweetType="open"
          :indexPanel="indexOpen"
          :style="stylePanel"
        />
      </v-tab-item>
      <v-tab-item :key="5">
        <v-progress-circular
          v-if="isLoadConv"
          :width="3"
          color="primary"
          indeterminate
        ></v-progress-circular>
        <scroll-panel
          :listData="tweetConv"
          :itemType="'tweet'"
          :tweetType="conv"
          :indexPanel="indexConv"
          :style="stylePanel"
        />
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
import { TweetPanelBase } from '@/mixins';
import { Vue, Mixins, Component, Ref, Provide } from 'vue-property-decorator';
import TweetSelector from '@/components/Home/TweetSelector.vue';
import { Component as Compo } from 'vue';
import { moduleTweet } from '@/store/modules/TweetStore';
@Component
export default class TweetPanel extends TweetPanelBase {
  listMenu = [
    { name: 'home', value: 0 },
    { name: 'mention', value: 1 },
    { name: 'dm', value: 2 },
    { name: 'favorite', value: 3 },
    { name: 'url', value: 4 },
    { name: 'conv', value: 5 }
  ];

  async created() {
    this.$nextTick(() => {
      document.addEventListener('keydown', this.KeyDown);
    });
  }
}
</script>
