<template>
  <div class="ui-top-big">
    <div class="ui-top-left" v-if="isShowPropic">
      <img class="propic" :src="propicPath" :class="propicClass" />
    </div>
    <div class="ui-top-right">
      <tweet-input></tweet-input>
    </div>
    <v-btn outlined color="primary" text @click="OnAddOne">
      1개추가
    </v-btn>
    <v-btn outlined color="primary" text @click="OnAddTimer">
      초당 1개 추가
    </v-btn>
  </div>
</template>

<style lang="scss" scoped>
.ui-top-big {
  width: calc(100vw - 20px);
  height: 90px;
  padding: 4px !important;
  display: flex;
}
.ui-top-right {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-left: 4px;
  padding-right: 4px;
}
.propic {
  object-fit: contain;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
}
.normal {
  width: 48px;
  height: 48px;
  border-radius: 4px;
}
.big {
  width: 73px;
  height: 73px;
  border-radius: 12px;
}
</style>

<script lang="ts">
/* eslint-disable @typescript-eslint/camelcase */
import { DalsaeApp, DalsaePage, UITopBase } from '@/mixins';
import faker from 'faker';
import { mixins } from 'vue-class-component';
import { Vue, Mixins, Component, Ref, Provide } from 'vue-property-decorator';
import * as I from '@/Interfaces';
import { moduleTweet } from '@/store/modules/TweetStore';
import { AddTweet, ETweetType } from '@/store/Interface';
import { moduleSwitter } from '@/store/modules/SwitterStore';
import { eventBus } from '@/plugins/EventBus';
@Component
export default class TopBig extends mixins(UITopBase) {
  AddTestTweet() {
    const tweet: I.Tweet = {
      full_text: faker.lorem.text() + faker.lorem.text(),
      created_at: Date.now.toString(),
      entities: { hashtags: [], media: [], urls: [], user_mentions: [] },
      extended_entities: { media: [] },
      favorite_count: 0,
      favorited: false,
      id_str: faker.datatype.number(1000000).toString(),
      in_reply_to_screen_name: '',
      in_reply_to_status_id_str: '',
      in_reply_to_user_id_str: '',
      is_quote_status: false,
      place: '',
      retweet_count: 0,
      retweeted: false,
      retweeted_status: undefined,
      source: '',
      user: {
        profile_image_url_https: faker.image.avatar(),
        name: faker.name.firstName(),
        screen_name: faker.finance.accountName(),
        created_at: Date.now.toString(),
        default_profile: false,
        default_profile_image: false,
        description: '',
        favourites_count: 0,
        follow_request_sent: false,
        followers_count: 0,
        following: false,
        friends_count: 0,
        has_extended_profile: false,
        id_str: faker.datatype.number(1000000).toString(),
        listed_count: 0,
        location: '',
        profile_background_color: '',
        profile_background_image_url: '',
        profile_background_image_url_https: '',
        profile_background_tile: false,
        profile_banner_url: '',
        profile_image_url: faker.image.avatar(),
        profile_link_color: '',
        profile_sidebar_border_color: '',
        profile_sidebar_fill_color: '',
        protected: false,
        statuses_count: 0,
        verified: false
      }
    };
    const a: AddTweet = {
      tweet: tweet,
      type: ETweetType.E_HOME,
      listTweet: undefined,
      user_id_str: moduleSwitter.selectID
    };
    moduleTweet.AddTweet(a);
  }
  OnAddOne() {
    eventBus.$emit('test');
    this.$emit('test');
    this.AddTestTweet();
  }

  OnAddTimer() {
    this.AddTestTweet();
  }
}
</script>
