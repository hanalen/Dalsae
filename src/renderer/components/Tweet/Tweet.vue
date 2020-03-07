<template>
  <div ref="tweet" class="tweet">
  <!-- @keydown="keyDown"> --><!--keydown은 list에서 처리 한다-->
  <div class="mute-area" v-if="tweet.isMuted" @click="ClickMute">
    <span>뮤트 된 트윗입니다. 클릭 시 표시 합니다.</span>
  </div>
  <div class="tweet-area" v-if="tweet.isMuted==false">
    <div class="daehwa">
      <i class="far fa-plus-square" v-if="tweet.orgTweet.in_reply_to_status_id_str!=undefined"
      :style="{'margin-left':-4, 'margin-top':option.isBigPropic?24+'px' : 18+'px'}"></i>
    </div>
    <img
      :class="{'profile':!option.isBigPropic,'profile-big':option.isBigPropic}"
      v-bind:src="propic()"
      v-if="option.isShowPropic"
    />
    <div class="tweet-text">
      <div class="tweet-name">
        <span
          class="tweet-name-content"
          :class="{'protected':Protected}"
        >{{TweetName}}</span><i v-if="tweet.orgUser.protected" class="fas fa-lock"></i>
      </div>
      <div class="tweet-content" :class="{'noti':Noti()}">
        <div v-html="TweetText">
        </div>
      </div>
      <div class="retweet-info" v-if="tweet.retweeted_status!=undefined"> 
        <img :src="tweet.user.profile_image_url_https"/>
        <span>{{tweet.user.screen_name+'/'+tweet.user.name}}</span>
      </div>
      <div class="tweet-rts">
        <i v-if="tweet.orgTweet.retweeted" class="fas fa-retweet"></i>
        <i v-if="tweet.orgTweet.favorited" class="fas fa-heart"></i>
      </div>
      <div class="tweet-timestamp">{{TweetDate}}</div>
      <QTTweet ref="qtTweet" v-if="qtTweet!=undefined" :tweet="qtTweet" :option="option"/>
    </div>
    <div
      class="tweet-images"
      v-if="tweet.orgTweet.extended_entities!=undefined && option.isShowPreview"
      @mouseover="showpreview"
      @mouseleave="hidepreview"
      @click="ImageClick"
    >
    <i v-if="tweet.orgTweet.extended_entities.media[0].type!='photo'" class="far fa-play-circle fa-3x"></i>
      <img
        class="tweet-image"
        v-for="image in tweet.orgTweet.extended_entities.media"
        :key="image.index"
        :src="image.media_url_https+':thumb'"
      />
    </div>
    <div v-if="preview" class="tweet-images-preview">
      <img
        class="tweet-image"
        v-for="image in tweet.orgTweet.extended_entities.media"
        :key="image.index"
        :src="image.media_url_https+':thumb'"
      />
    </div>
  </div>
    
  </div>
</template>

<script>
import {EventBus} from '../../main.js';
import ContextMenu from '../ContextMenu/ContextMenu.vue'
import QTTweet from './QTTweet.vue'
export default {
  name: "tweet",
  components:{
    ContextMenu,
    QTTweet
  },
  props: {
    tweet: undefined,
    option: undefined,
    selected:false,
    index:undefined,
  },
  data() {
    return {
      preview: false,
      isFocus:false,
      qtTweet:undefined,
      qtIdStr:undefined
    };
  },
  created:function(){
    
  },
  computed:{
    TweetDate(){
      var locale=window.navigator.language;
      var moment = require('moment');
      moment.locale(locale);
      var date = new Date(this.tweet.orgTweet.created_at);
      return moment(date).format('LLLL') +':'+ moment(date).format('ss');
    },
    Protected(){
      if(this.tweet.retweeted_status!=undefined){
        return false;//리트윗일 경우 플텍 표시 XXXXX
      }
      else{
        return this.tweet.user.protected
      }
    },
    TweetName(){
      return this.tweet.orgUser.screen_name+' / '+this.tweet.orgUser.name;
    },
    TweetText(){
      var text=this.tweet.orgTweet.full_text;
      var tweet=this.tweet.orgTweet;
      if(tweet.entities.media!==undefined){
         text = text.replace(tweet.entities.media[0].url, tweet.entities.media[0].display_url);
      }
      if(tweet.entities.urls!=undefined){
        if(tweet.entities.urls.length>0)
        {
          tweet.entities.urls.forEach(function(item, index){
            text = text.replace(item.url, item.display_url);
          });
        }
      }
      text = text.replace(/(?:\r\n|\r|\n)/g, '<br />');
      return text;
    }
  },
  methods: {
    ImageClick(e){
      var ipcRenderer = require('electron').ipcRenderer;
      ipcRenderer.send('child', this.tweet, this.option);
    },
    ClickMute(e){
      this.$store.dispatch('ShowMuteTweet', this.tweet);
    },
    Noti(){
      var userid=this.$store.state.Account.selectAccount.user_id;
      var mentions=this.tweet.orgTweet.entities.user_mentions;
      for(var i=0;i<mentions.length;i++){
        if(userid==mentions[i].id_str)
          return true;
      }
      var highlight=this.$store.state.DalsaeOptions.highlight;
      if(highlight==undefined) return false;
      for(var i=0;i<highlight.length;i++){
        if(this.tweet.orgTweet.full_text.indexOf(highlight[i])>=0)
          return true;
      }
      return false;
    },
    propic() {
      var user=undefined;
      if(this.tweet.retweeted_status!=undefined){//리트윗일 경우 인장 표시가 다름
        user=this.tweet.retweeted_status.user;
      }
      else{
        user=this.tweet.user;
      }
      if(user==undefined){
        return '';
      }
      else{
        return this.option.isBigPropic
          ? user.profile_image_url_https.replace("_normal", "_bigger")
          : user.profile_image_url_https;
      }
    },
    showpreview() {
      this.preview = true;
    },
    hidepreview() {
      this.preview = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.tweet {
  height: auto;
  color: black;
  
  // align-items: stretch;
  border-bottom: dashed 1px rgba(0, 0, 0, 0.12);
}
.tweet:hover, .small-tweet:hover{
  background-color: #b7c7eb !important;
}
.tweet:focus{
  outline: none;
}
.tweet-area{
  display: flex;
  position: relative;
  // flex-basis: 100%;
  padding: 6px 6px 6px 0px;
  // flex-shrink: 1;
  overflow: visible;
}
.mute-area{
  height: 50px;
  padding:2px 0px 2px 6px;
  // display: flex;
  // position: relative;
  // flex-basis: 100%;
  // padding: 6px 6px 6px 0px;
  // flex-shrink: 1;
  // overflow: visible;
}

.tweet-odd{
  background: #ffe0e0!important;
}
.tweet-even{
  background: hsl(0, 100%, 90%)!important;
}

.selected-focus-out{
  background-color: #f7e2d4 !important;
}
.tweet.selected{
    background-color: #b7c7eb !important;
} 
.daehwa{//답멘일 경우 표시하는 애
  margin-left: 4px;
  width: 14px;
}
@mixin profile() {
  margin-left: 4px;
  object-fit: contain;
  border-radius: 12px;
  margin-bottom: auto;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
}
.profile {
  @include profile();
  width: 48px;
}
.profile-big {
  @include profile();
  width: 73px;
}
.tweet-text {
  font-size: 14px;
  flex: 1;
  // display: flex;
  flex-direction: column;
  padding: 0px 8px;
  .tweet-name {
    margin-bottom: 2px;
    .tweet-name-content {
      border-radius: 4px;
      font-weight: bold;
    }
    
  }
  .tweet-content {
    // flex: 1;
    line-height: 1.3;
  }
  .tweet-content.noti{
      span{
        color: #FF4B6A;
      }
    }
  .tweet-timestamp {
    color: hsla(0, 0, 20, 1.0);
  }
}

.tweet-images-preview {
  position: absolute;
  // display: inline-flex;
  right: 120px;
  background: white;
  padding: 4px;
  margin-top: -4px;
  border-radius: 12px;
  
  backdrop-filter: blur(5px);
  :not(:last-child) {
    margin-right: 4px;
  }
}
.tweet-images {
  display: inline-flex;
  cursor: pointer;
  height: 100px;
  border-radius: 12px;
  box-shadow: 0 5px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  :not(:last-child) {
    margin-right: -95px;
  }
}
.tweet-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 12px;
}
.retweet-info{
  img{
    width: 25px;
    height: 25px;
    border-radius: 4px;
  }
}

.small-tweet{
  height: 30px;
  width: 100%;
  max-width: 100%;
  overflow: hidden;
  padding: 4px;
  .small-mute-area{
    height: 20px;
    padding:2px 0px 2px 6px;
  }
  .small-tweet-area{
    display: flex;
    position: relative;
    .small-propic{
      margin-left: 4px;
      object-fit: contain;
      border-radius: 4px;
      margin-bottom: auto;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
      width: 20px;
    }
    .small-tweet-content{
      height: 30px;
      margin-left: 4px;
      max-height: 30px;
      font-size: 12px;
      min-width: 0;
      // overflow: hidden;
      .small-text{
        width: 100%;
        height: 16px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
</style>
