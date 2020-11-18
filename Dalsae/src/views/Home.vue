/* eslint-disable @typescript-eslint/camelcase */
<template>
  <v-app>
    <message-modal ref="messageModal"> </message-modal>
    <pin-modal ref="pinModal"></pin-modal>
    <v-app-bar app max-height="90" height="90">
      <top-selector> </top-selector>
    </v-app-bar>
    <v-main>
      <v-container fluid>
        <tweet-panel></tweet-panel>
      </v-container>
    </v-main>
    <v-footer app fixed height="44" color="gray">
      <bottom></bottom>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component, Mixins } from 'vue-property-decorator';
import { TweetDataManager } from '@/Managers/TweetDataMng';
import * as I from '@/Interfaces';
import TwitterAPI from '@/API/APICall';
import { DalsaePage, DalsaeApp } from '@/mixins';

@Component
export default class Home extends Mixins(DalsaeApp) {
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
