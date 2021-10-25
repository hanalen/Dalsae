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
                <div class="context-item" @click="item.onClick(item.value)">
                  <span v-if="!item.titleTwo">
                    {{ item.title }}
                  </span>
                  <div v-else>
                    {{ item.title }}
                    <br />
                    <span>
                      {{ item.titleTwo }}
                    </span>
                  </div>
                  <span v-if="item.hotKey">
                    {{ item.hotKey }}
                  </span>
                </div>
              </template>
            </v-list-item>
          </template>
        </v-list-item-group>
      </v-list>
    </v-menu>
  </div>
</template>

<style lang="scss" scoped>
.v-list-item {
  min-height: 24px !important;
  max-width: 300px !important;
  font-size: 14px !important;
}
.context-item {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
</style>

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
