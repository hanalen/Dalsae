/* eslint-disable @typescript-eslint/camelcase */
<template>
  <div class="home">
    <tweet-panel></tweet-panel>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Mixins } from 'vue-property-decorator';
import { TweetDataManager } from '@/Managers/TweetDataMng';
import * as I from '@/Interfaces';
import TwitterAPI from '@/API/APICall';
import { DalsaePage } from '@/mixins';

@Component
export default class Home extends Mixins(DalsaePage) {
  ClickLink(e: Event) {
    // const listTweet: I.Tweet[] = TweetDataManager.listTweet as I.Tweet[];
    // console.log(listTweet[this.index]);
    // window.preload.image.OpenImageWindow(
    //   listTweet[this.index].id_str.toString(),
    //   listTweet[this.index]
    // );
    // this.index++;
  }

  async ClickModal() {
    // await this.ShowMessage('modal test');
  }
}
</script>
