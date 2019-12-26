<template>
  <div class="tweet-panal">
    <div class="panel-left">
      <TweetList
      ref="homePanel"
      :panelName="'home'"
      v-show="selectPanelName=='home'"
      v-bind:options="this.$store.state.DalsaeOptions.uiOptions"
      v-bind:tweets="this.$store.state.tweets.home"
      />
      <TweetList
        ref="mentionPanel"
        :panelName="'mention'"
        v-show="selectPanelName=='mention'"
        v-bind:options="this.$store.state.DalsaeOptions.uiOptions"
        v-bind:tweets="this.$store.state.tweets.mention"
      />
      <TweetList
        ref="favPanel"
        :panelName="'fav'"
        v-show="selectPanelName=='fav'"
        v-bind:options="this.$store.state.DalsaeOptions.uiOptions"
        v-bind:tweets="this.$store.state.tweets.fav"
      />
    </div>
    <div class="panel-right" v-if="this.$store.state.tweets.daehwa.length>0">
      <TweetListDaehwa
        ref="daehwaPanel"
        :panelName="'daehwa'"
        v-bind:options="this.$store.state.DalsaeOptions.uiOptions"
        v-bind:tweets="this.$store.state.tweets.daehwa"
      />
    </div>
    
  </div>
</template>

<script>
// import Tweet from "./Tweet-flex.vue";
import TweetList from "./Tweetlist.vue";
import TweetListDaehwa from "./TweetListDaehwa.vue";

export default {
	name: "tweetpanal",
	data:function(){
		return{
      selectPanelName:'home',
      isDaehwaFocused:false,
		}
  },
  computed:{
    selectPanel(){
      if(this.isDaehwaFocused){
        return this.$refs.daehwaPanel;
      }
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
      }
    }
  },
  mounted: function() {//EventBus등록용 함수들
    this.EventBus.$on('TweetKeyDown', (e) => {
        if(e.keyCode==49){
          this.selectPanelName='home';
          this.selectPanel.Focus(e);
        }
        else if(e.keyCode==50){
          this.selectPanelName='mention';
          this.selectPanel.Focus(e);
        }
        else if(e.keyCode==36){
          this.selectPanel.Home(e);
        }
        else if(e.keyCode==35){
          this.selectPanel.End(e);
        }
        else if(e.keyCode==32){
          e.preventDefault();
          this.ReqTweets(this.selectPanelName);
        }
        else if(e.keyCode==99|| e.keyCode==67){//c
          e.preventDefault();
          var tweet =this.selectPanel.GetSelectTweet();

          this.EventBus.$emit('LoadingTweetPanel', {'isLoading': true, 'panelName':'daehwa'})
          this.EventBus.$emit('ReqDaehwa', tweet);
        }
        else if(e.keyCode==118||e.keyCode==86){//v, 대화 숨기기. vuex의 대화 목록을 clear
          e.preventDefault();
          this.$store.dispatch('ClearDaehwa');
          this.EventBus.$emit('FocusPanel', this.selectPanelName);
        }
        else if(e.keyCode==88||e.keyCode==120){//x, qt트윗 등록 
          e.preventDefault();
          var tweet= this.selectPanel.GetQTTweet();
          if(tweet){
            this.$store.dispatch('Daehwa', tweet);
          }
        }
        else if(e.keyCode==65 || e.keyCode == 97){//a,전체 답변
          e.preventDefault();
          var tweet=this.selectPanel.GetSelectTweet();
          this.EventBus.$emit('ReplyAll', tweet);
        }
        else if(e.keyCode==82 || e.keyCode==114){//r, 답변
          e.preventDefault();
          var tweet=this.selectPanel.GetSelectTweet();
          this.EventBus.$emit('Reply', tweet);
        }
        else if(e.keyCode==70||e.keyCode==102){//f, 관글
          e.preventDefault();
          var tweet=this.selectPanel.GetSelectTweet();
          this.EventBus.$emit('Favorite', tweet);
        }
        else if(e.keyCode==70||e.keyCode==102){//t, 리트윗
          e.preventDefault();
          var tweet=this.selectPanel.GetSelectTweet();
          this.EventBus.$emit('Retweet', tweet);
        }
        else if(e.keyCode==70||e.keyCode==102){//f, 관글
          e.preventDefault();
          var tweet=this.selectPanel.GetSelectTweet();
          this.EventBus.$emit('Favorite', tweet);
        }
        else if(e.keyCode==71||e.keyCode==103){//g, 이미지열기
          e.preventDefault();
          var tweet=this.selectPanel.GetSelectTweet();
          this.EventBus.$emit('ShowTweetImage', tweet);
        }
        else if(e.keyCode==70||e.keyCode==102){//v, 컨텍스트 메뉴
          e.preventDefault();
          var tweet=this.selectPanel.GetSelectTweet();
          tweet.ShowContextMenu();
        }/////////////////////////////////
        else if(e.keyCode==85||e.keyCode==117){//u, 인풋 포커스
          e.preventDefault();
          this.EventBus.$emit('FocusInput');
        }
        else if(e.keyCode==72||e.keyCode==104){//h, 해시태그, 해시 미구현
        }
        else if(e.keyCode==127){//del, 트윗 삭제
          e.preventDefault();
          this.EventBus.$emit('DeleteTweet');
        }
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
    this.EventBus.$on('TweetFocus', (vals)=>{//id: tweet id
      var tweetID = vals['tweetID'];
      var isDaehwa=vals['isDaehwa'];
      this.isDaehwaFocused = isDaehwa;//대화 포커싱 여부 저장
      this.selectPanel.Focused(tweetID);
    });
    this.EventBus.$on('FocusOut', (id)=>{
      this.selectPanel.FocusOut(id);
    });
    this.EventBus.$on('FocusDaehwa',()=>{
      if(this.$refs.daehwaPanel){
        this.$refs.daehwaPanel.Focus();
      }
    });
    this.EventBus.$on('FocusPanel', (selectPanelName)=>{
      if(selectPanelName!='' &&selectPanelName != undefined){
        this.selectPanelName=selectPanelName;
      }
      this.isDaehwaFocused=false;//패널 포커스 해야 해서 대화 포커스 flag 엎음. 개 구린 코드.....
      this.selectPanel.Focus();
    });
  },
  methods:{
    ReqTweets(panelName){
      var panel=this.selectPanelName;

      if(panel=='home'){
        this.EventBus.$emit('ReqHome');
        this.EventBus.$emit('LoadingTweetPanel', {'isLoading': true, 'panelName':this.selectPanelName})
      }
      else if(panel=='mention'){
        this.EventBus.$emit('ReqMention');
        this.EventBus.$emit('LoadingTweetPanel', {'isLoading': true, 'panelName':this.selectPanelName})
      }
      else if(panel=='fav'){
        this.EventBus.$emit('ReqFav');
        this.EventBus.$emit('LoadingTweetPanel', {'isLoading': true, 'panelName':this.selectPanelName})
      }
    }
  },
  components:{
    TweetList,
    TweetListDaehwa
  },
  props: {
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
  }
  .panel-right{
    flex: 1 50%;
  }
}
</style>