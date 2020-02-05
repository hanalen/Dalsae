<template>
  <div @mouseenter="Hover" @mouseleave="HoverOut"
  :class="{'tweet': true,'selected': isFocus}" tabindex="-1" @keydown.up="ArrowUp" @keydown.down="ArrowDown" @focus="Focused" v-on:focusout="FocusOut"
    @keydown.right="ArrowRight" @keydown.left="ArrowLeft"
    @mousedown="Click">
  <!-- @keydown="keyDown"> --><!--keydown은 list에서 처리 한다-->
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
    
    <ContextMenu ref="context" :tweet="tweet"/>
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
    if(this.tweet.orgTweet.quoted_status!=undefined){
      this.qtIdStr=this.tweet.orgTweet.quoted_status_id_str;
      this.$nextTick(()=>{
        this.EventBus.$emit('LoadQTTweet', this.tweet);
      });
      this.EventBus.$on('LoadedQTTweet', (vals)=>{//트윗 로딩 후 on을 요청한 객체에만 걸 수 있게
        var tweet = vals['tweet'];
        var id=vals['id_str'];
        if(id!=this.qtIdStr) return;

        this.$nextTick(()=>{
          var orgUser = tweet.retweeted_status==undefined ? tweet.user :tweet.retweeted_status.user;//리트윗, 원트윗 유저 선택
          var orgTweet=tweet.retweeted_status==undefined? tweet : tweet.retweeted_status;//원본 트윗 저장
          tweet.orgUser = JSON.parse(JSON.stringify(orgUser));
          tweet.orgTweet=JSON.parse(JSON.stringify(orgTweet));
          this.qtTweet = tweet;
        });
      });
    }
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
    Hover(e){
      if(this.qtTweet)
        this.$refs.qtTweet.Hover();
    },
    HoverOut(e){
      if(this.qtTweet)
        this.$refs.qtTweet.HoverOut();
    },
    ImageClick(e){
      var ipcRenderer = require('electron').ipcRenderer;
      ipcRenderer.send('child', 'abcdefg');
      return;
      ipcRenderer.on('tweet', function (event,store) {
        console.log('tweet recv');
        console.log(store);
        console.log(event)
      });
      const { BrowserWindow } = require('electron')
      console.log(BrowserWindow)
      let win = new BrowserWindow({ width: 800, height: 600 })
      win.on('closed', () => {
        win = null
      })
      const modalPath = process.env.NODE_ENV === 'development'
          ? 'http://localhost:9080/#/Image'
          : `file://${__dirname}/index.html#Image`
      win.webContents.send('tweet', 'abcdef');

      win.loadURL(modalPath)


      // window.open(modalPath);
      // this.EventBus.$emit('ShowTweetImage', this.tweet);
    },
    Click(e){
      if(e.button==2 || e.button==3){
        e.preventDefault();
        this.$refs.context.Show(e);
      }
    },
    ShowContextMenu(){
      this.$refs.context.Show(e);
    },
    keyDown(e){
      this.EventBus.$emit('tweetKeyDown', e);
    },
    ArrowUp(e){
      this.EventBus.$emit('ArrowUp', e);
    },
    ArrowDown(e){
      this.EventBus.$emit('ArrowDown', e);
    },
    Focused(e){
      e.preventDefault();
      if(this.qtTweet){
        this.$refs.qtTweet.Focused();
      }
      this.isFocus=true;
      this.EventBus.$emit('TweetFocus', this.tweet.id);//대화쪽 트윗인지 일반쪽 트윗인지 표시 여부
    },
    FocusOut(e){
      if(this.qtTweet){
        this.$refs.qtTweet.FocusOut();
      }
      this.isFocus=false;
      this.EventBus.$emit('FocusOut', this.tweet.id);
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
  display: flex;
  position: relative;
  // flex-basis: 100%;
  padding: 6px 6px 6px 0px;
  // flex-shrink: 1;
  overflow: visible;
  // align-items: stretch;
  border-bottom: dashed 1px rgba(0, 0, 0, 0.12);
}
.tweet:hover{
  background-color: #b7c7eb !important;
}
.tweet:focus{
  outline: none;
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
</style>
