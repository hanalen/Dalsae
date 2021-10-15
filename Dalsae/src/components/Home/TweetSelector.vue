/* eslint-disable vue/no-unused-vars */
<template>
  <div class="tweet-selector" @click="OnClickTweet" @contextmenu="OnContext">
    <tweet-small :tweet="tweet" :selected="selected" v-if="isSmall"> </tweet-small>
    <tweet-normal :tweet="tweet" :selected="selected" v-if="isNormal"> </tweet-normal>
    <v-menu v-model="isShowContext" :position-x="x" :position-y="y" absolute offset-y>
      <v-list>
        <v-list-item-group v-model="contextIndex">
          <template v-for="(item, i) in listContext">
            <v-divider v-if="item.isDivider" :key="`divider-${i}`"></v-divider>
            <v-list-item v-else :key="`item-${i}`" :value="item.value">
              <template>
                <v-list-item-content @click="item.onClick(item.value)">
                  <v-list-item-title v-text="item.title"></v-list-item-title>
                </v-list-item-content>
                <v-spacer v-if="item.hotKey"></v-spacer>
                <v-list-item-content v-if="item.hotKey" @click="item.onClick(item.value)">
                  <v-list-item-title v-text="item.hotKey"></v-list-item-title>
                </v-list-item-content>
              </template>
            </v-list-item>
          </template>
        </v-list-item-group>
      </v-list>
    </v-menu>
  </div>
</template>

<style lang="scss" scoped></style>

<script lang="ts">
import { DalsaeApp, TweetSelectorBase } from '@/mixins';
import { eventBus } from '@/plugins';
import { Vue, Mixins, Component, Ref, Provide } from 'vue-property-decorator';

@Component
export default class TweetSelector extends Mixins(TweetSelectorBase) {
  async created() {
    eventBus.$on('ShowContextMenu', (key: string) => {
      if (this.tweet.id_str !== key) return;
      const pos = this.$el.getBoundingClientRect();
      this.OnContext(new MouseEvent('click', { clientX: 0, clientY: pos.top }));
    });
  }
}
</script>
