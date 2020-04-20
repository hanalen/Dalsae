<template>
  <div class="tweet-panal">
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
        :isShow="selectPanelName=='favorite'"
        :panelName="'favorite'"
        v-show="selectPanelName=='favorite'"
        v-bind:options="this.$store.state.DalsaeOptions.uiOptions"
        v-bind:tweets="this.$store.state.tweets.fav"
      />
      <TweetList
        ref="user"
        :isShow="selectPanelName=='user'"
        :panelName="'user'"
        v-show="selectPanelName=='user'"
        v-bind:options="this.$store.state.DalsaeOptions.uiOptions"
        v-bind:tweets="this.$store.state.tweets.user"
      />
      <TweetList
        ref="openLink"
        :isShow="selectPanelName=='openLink'"
        :panelName="'openLink'"
        v-show="selectPanelName=='openLink'"
        v-bind:options="this.$store.state.DalsaeOptions.uiOptions"
        v-bind:tweets="this.$store.state.tweets.openLink"
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
        case 'favorite':
          return this.$refs.favPanel;
          break;
        case 'daehwa':
          return this.$refs.daehwaPanel;
        case 'openLink':
          return this.$refs.openLink;
        case 'user':
          return this.$refs.user;
      }
    }
  },
  mounted: function() {//EventBus등록용 함수들
    this.EventBus.$on('HotKeyDown', (hotkey)=>{
      this.HotKeyDown(hotkey);
    });
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
        this.selectPanelName=selectPanelName
      }
      else if(selectPanelName!='' && selectPanelName != undefined){
        this.selectPanelName=selectPanelName;
      }
      this.EventBus.$emit('HideContext')
      this.selectPanel.Focus();
    });
  },
  methods:{
    HotKeyDown(hotkeyType){
      if(hotkeyType=='showTL'){
        this.$store.dispatch('ClearDaehwa');
        this.selectPanelName='home';
        this.prevPanelName='home';
        this.selectPanel.Focus();
        this.EventBus.$emit('HideContext')
      }
      else if(hotkeyType=='showMention'){
        this.$store.dispatch('ClearDaehwa');
        this.selectPanelName='mention';
        this.prevPanelName='mention';
        this.EventBus.$emit('HideContext')
        this.selectPanel.Focus();
      }
      else if(hotkeyType=='showFavorite'){
        this.$store.dispatch('ClearDaehwa');
        this.selectPanelName='favorite';
        this.prevPanelName='favorite';
        this.selectPanel.Focus();
      }
      else if(hotkeyType=='showUrl'){
        this.$store.dispatch('ClearDaehwa');
        this.selectPanelName='openLink';
        this.prevPanelName='openLink';
        this.selectPanel.Focus();
      }
      else if(hotkeyType=='home'){
        this.EventBus.$emit('HideContext')
        this.selectPanel.Home();
      }
      else if(hotkeyType=='end'){
        this.EventBus.$emit('HideContext')
        this.selectPanel.End();
      }
      else if(hotkeyType=='loading'){
        this.EventBus.$emit('HideContext')
        this.ReqTweets(this.selectPanelName);
      }
      else if(hotkeyType=='loadConv'){
        this.EventBus.$emit('HideContext')
        var tweet =this.selectPanel.GetSelectTweet();
        this.EventBus.$emit('LoadDaehwa', tweet)
      }
      else if(hotkeyType=='showQt'){//x, qt트윗 등록 
        this.EventBus.$emit('HideContext')
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
        this.EventBus.$emit('HideContext')
        var tweet=this.selectPanel.GetSelectTweet();
        this.EventBus.$emit('Favorite', tweet);
      }
      else if(hotkeyType=='retweet'){//t, 리트윗
        this.EventBus.$emit('HideContext')
        var tweet=this.selectPanel.GetSelectTweet();
        this.EventBus.$emit('Retweet', tweet);
      }
      else if(hotkeyType=='showImage'){//g, 이미지열기
        var tweet=this.selectPanel.GetSelectTweet();
        if(tweet.orgTweet.extended_entities==undefined) return;
        this.EventBus.$emit('ShowImagePopup', tweet)
      }
      else if(hotkeyType=='showContext'){//v, 컨텍스트 메뉴
        this.selectPanel.ShowContextMenu();
      }
      else if(hotkeyType=='input'){//u, 인풋 포커스
        this.EventBus.$emit('FocusInput');
      }
      else if(hotkeyType=='hash'){//h, 해시태그, 해시 미구현
        var tweet=this.selectPanel.GetSelectTweet();
        this.EventBus.$emit('AddHashTag', tweet);
      }
      else if(hotkeyType=='delete'){//del, 트윗 삭제
        this.EventBus.$emit('HideContext')
        var tweet=this.selectPanel.GetSelectTweet();
        this.EventBus.$emit('DeleteTweet', tweet);
      }
      else if(hotkeyType=='sendQt'){
        var tweet=this.selectPanel.GetSelectTweet();
        this.EventBus.$emit('QtTweet', tweet)
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
      else if(panel=='favorite'){
        this.EventBus.$emit('ReqFavorite');
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