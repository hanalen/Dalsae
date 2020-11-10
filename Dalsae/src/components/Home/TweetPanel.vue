<template>
  <div class="tweet-panel" ref="tweetPanel">
    <v-tabs v-model="state.selectMenu" hide-slider>
      <v-tab v-for="(item, i) in listMenu" :key="i">
        {{ item.name }}
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="state.selectMenu">
      <v-tab-item v-for="(item, i) in listMenu" :key="i">
        <v-card flat>
          {{ item.name }}
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<style lang="scss" scoped></style>

<script lang="ts">
import { TweetPanelBase } from '@/mixins';
import { Vue, Mixins, Component, Ref, Provide } from 'vue-property-decorator';

@Component
export default class TweetPanel extends Mixins(TweetPanelBase) {
  listMenu = [
    { name: 'home', value: 0 },
    { name: 'mention', value: 1 },
    { name: 'dm', value: 2 },
    { name: 'favorite', value: 3 },
    { name: 'url', value: 4 }
  ];
}
</script>
