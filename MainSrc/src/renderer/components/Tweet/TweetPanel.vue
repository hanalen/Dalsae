<template>
  <div class="tweet-panal" @keydown="KeyDown">
    <div class="panel-left">
      <TweetList
      ref="homePanel"
      :panelName="'home'"
      :isShow="selectPanelName=='home'"
      v-show="selectPanelName=='home'"
      v-bind:options="this.$store.state.DalsaeOptions.uiOptions"
      v-bind:tweets="this.$store.state.tweets.home"
      />
      <TweetList
        ref="mentionPanel"
        :isShow="selectPanelName=='mention'"
        :panelName="'mention'"
        v-show="selectPanelName=='mention'"
        v-bind:options="this.$store.state.DalsaeOptions.uiOptions"
        v-bind:tweets="this.$store.state.tweets.mention"
      />
      <TweetList
        ref="favPanel"
        :isShow="selectPanelName=='fav'"
        :panelName="'fav'"
        v-show="selectPanelName=='fav'"
        v-bind:options="this.$store.state.DalsaeOptions.uiOptions"
        v-bind:tweets="this.$store.state.tweets.fav"
      />
      <TweetList
        ref="daehwaPanel"
        :isShow="selectPanelName=='daehwa'"
        :panelName="'daehwa'"
        v-show="selectPanelName=='daehwa'"
        v-bind:options="this.$store.state.DalsaeOptions.uiOptions"
        v-bind:tweets="this.$store.state.tweets.daehwa"
      />
    </div>
  </div>
</template>

<script>
// import Tweet from "./Tweet-flex.vue";
import TweetList from "./Tweetlist.vue";

export default {
	name: "tweetpanal",
	data:function(){
		return{
      selectPanelName:'home',
      prevPanelName:'home',
		}
  },
  props: {
    hotKey:undefined,
  },
  computed:{
    selectPanel(){
      switch(this.selectPanelName){
        case 'home':
          return this.$refs.homePanel;
          break;
        case 'mention':
          return this.$refs.mentionPanel;
          break;
        case 'fav':
          return this.$refs.favPanel;
          break;
        case 'daehwa':
          return this.$refs.daehwaPanel;
      }
    }
  },
  mounted: function() {//EventBus등록용 함수들
		this.EventBus.$on('focusTweet', (e) => {
      this.selectPanel.Focus(e);
    });
    this.EventBus.$on('ArrowUp', (e)=>{//e: event
      this.selectPanel.Prev(e);
    });
    this.EventBus.$on('ArrowDown', (e)=>{//e: event
      this.selectPanel.Next(e);
    });
    this.EventBus.$on('FocusDaehwa', ()=>{
      this.prevPanelName=this.selectPanelName;
      this.selectPanelName='daehwa';
      this.selectPanel.Focus(undefined);
    });
    this.EventBus.$on('FocusPanel', (selectPanelName)=>{
      if(selectPanelName==''){
      }
      else if(this.selectPanelName=='daehwa' && selectPanelName!='daehwa'){//대화패널에서 나갈 경우 클리어
        this.$store.dispatch('ClearDaehwa');
      }
      else if(selectPanelName!='' &&selectPanelName != undefined){
        this.selectPanelName=selectPanelName;
      }
      this.selectPanel.Focus();
    });
  },
  methods:{
    KeyDown(e){//단축키...동작.....한다......
      Object.keys(this.hotKey).forEach((key)=>{
        if(this.hotKey[key].isCtrl==e.ctrlKey && this.hotKey[key].isAlt==e.altKey &&
            this.hotKey[key].isShift==e.shiftKey && this.hotKey[key].key==e.key.toUpperCase()){
          e.preventDefault();
          e.stopPropagation();
          this.HotKeyDown(key);
        }
      })
    },
    HotKeyDown(hotkeyType){
      if(hotkeyType=='showTL'){
        this.$store.dispatch('ClearDaehwa');
        this.selectPanelName='home';
        this.prevPanelName='home';
        this.selectPanel.Focus();
      }
      else if(hotkeyType=='showMention'){
        this.$store.dispatch('ClearDaehwa');
        this.selectPanelName='mention';
        this.prevPanelName='mention';
        this.selectPanel.Focus();
      }
      else if(hotkeyType=='home'){
        this.selectPanel.Home();
      }
      else if(hotkeyType=='end'){
        this.selectPanel.End();
      }
      else if(hotkeyType=='loading'){
        this.ReqTweets(this.selectPanelName);
      }
      else if(hotkeyType=='loadConv'){
        var tweet =this.selectPanel.GetSelectTweet();
        if(!tweet.orgTweet.in_reply_to_status_id_str) return;//대화 없는건 스킵 
        this.$store.dispatch('DaehwaAutoAdd', tweet);//캐시데이터가 있는지부터 체크 

        if(this.$store.state.tweets.daehwa[0].orgTweet.in_reply_to_status_id_str){//캐시 정리가 끝난 후 대화가 있을 경우에 api 콜
          this.EventBus.$emit('LoadingTweetPanel', {'isLoading': true, 'panelName':'daehwa'})
          this.EventBus.$emit('ReqDaehwa', tweet);
        }
        else{
          this.EventBus.$emit('LoadingTweetPanel', {'isLoading': false, 'panelName':'daehwa'})//로딩 뱅글이 끄기위해 호출
          this.EventBus.$emit('FocusPanel', 'daehwa');//패널 변경
        }
      }
      else if(hotkeyType=='showQt'){//x, qt트윗 등록 
        var tweet= this.selectPanel.GetQTTweet();
        if(tweet){
          this.$store.dispatch('Daehwa', tweet);
          this.EventBus.$emit('FocusPanel', 'daehwa');//패널 변경
        }
      }
      else if(hotkeyType=='replyAll'){//a,전체 답변
        var tweet=this.selectPanel.GetSelectTweet();
        this.EventBus.$emit('ReplyAll', tweet);
      }
      else if(hotkeyType=='reply'){//r, 답변
        var tweet=this.selectPanel.GetSelectTweet();
        this.EventBus.$emit('Reply', tweet);
      }
      else if(hotkeyType=='sendFavorite'){//f, 관글
        var tweet=this.selectPanel.GetSelectTweet();
        this.EventBus.$emit('Favorite', tweet);
      }
      else if(hotkeyType=='retweet'){//t, 리트윗
        var tweet=this.selectPanel.GetSelectTweet();
        this.EventBus.$emit('Retweet', tweet);
      }
      else if(hotkeyType=='showImage'){//g, 이미지열기
        var tweet=this.selectPanel.GetSelectTweet();
        var ipcRenderer = require('electron').ipcRenderer;
        ipcRenderer.send('child', tweet, this.$store.state.DalsaeOptions.uiOptions);
      }
      else if(hotkeyType=='showContext'){//v, 컨텍스트 메뉴
        this.selectPanel.ShowContextMenu();
      }
      else if(hotkeyType=='input'){//u, 인풋 포커스
        this.EventBus.$emit('FocusInput');
      }
      else if(hotkeyType=='hash'){//h, 해시태그, 해시 미구현
      }
      else if(hotkeyType=='delete'){//del, 트윗 삭제
        var tweet=this.selectPanel.GetSelectTweet();
        this.EventBus.$emit('DeleteTweet', tweet);
      }
    },
    ReqTweets(panelName){
      var panel=this.selectPanelName;

      if(panel=='home'){
        this.EventBus.$emit('ReqHome');
        // this.EventBus.$emit('LoadingTweetPanel', {'isLoading': true, 'panelName':this.selectPanelName})
      }
      else if(panel=='mention'){
        this.EventBus.$emit('ReqMention');
        // this.EventBus.$emit('LoadingTweetPanel', {'isLoading': true, 'panelName':this.selectPanelName})
      }
      else if(panel=='fav'){
        this.EventBus.$emit('ReqFav');
        // this.EventBus.$emit('LoadingTweetPanel', {'isLoading': true, 'panelName':this.selectPanelName})
      }
    }
  },
  components:{
    TweetList,
  },
};
</script>
<style lang="scss" scoped>
.tweet-panal{
  display: flex;
  
  flex: 1;
  margin-bottom: 43px;
  overflow: auto;
  .panel-left{
    flex: 1 50%;
    width: 100%;
  }
  .panel-right{
    flex: 1 50%;
  }
}
</style>