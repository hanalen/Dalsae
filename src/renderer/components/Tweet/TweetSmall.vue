<template>
	<div class="small-tweet">
		<div class="small-mute-area" v-if="tweet.isMuted" @click="ClickMute">
			<span>뮤트 된 트윗입니다. 클릭 시 표시 합니다.</span>
		</div>
		<div class="small-tweet-area" v-if="tweet.isMuted==false">
			<div class="daehwa">
				<i class="far fa-plus-square" v-if="tweet.orgTweet.in_reply_to_status_id_str!=undefined" :style="{'margin-left':-4}"></i>
			</div>
			<img class="small-propic" v-bind:src="propic()" v-if="option.isShowPropic" />
			<div class="small-tweet-content" :class="{'noti':Noti()}">
				<div class="small-text" v-html="TweetText" :class="{'delete': tweet.isDelete}">
				</div>
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
    };
  },
  created:function(){
    
  },
  computed:{
    Protected(){
      if(this.tweet.retweeted_status!=undefined){
        return false;//리트윗일 경우 플텍 표시 XXXXX
      }
      else{
        return this.tweet.user.protected
      }
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
  }
};
</script>

<style lang="scss" scoped>
.mute-area{
  height: 50px;
  padding:2px 0px 2px 6px;
}

.tweet-odd{
  background: white !important;
}
.tweet-even{
  background: #f5f8fa !important;
}

.small-tweet.selected{
  background-color: #bce3fe !important;
} 
.small-tweet:hover{
  background-color: #a3d9fe !important;
}


.small-tweet{
  height: 30px;
  width: 100%;
  max-width: 100%;
  overflow: hidden;
  padding: 4px;
  .not-read{
    font-weight: bold;
  }
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
        .delete{
          text-decoration: line-through;
        }
      }
    }
  }
}
</style>
