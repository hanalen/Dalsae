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
      <TweetList
        ref="daehwaPanel"
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
    this.EventBus.$on('TweetKeyDown', (e) => {
        if(e.keyCode==49){
          this.$store.dispatch('ClearDaehwa');
          this.selectPanelName='home';
          this.prevPanelName='home';
          this.selectPanel.Focus(e);
        }
        else if(e.keyCode==50){
          this.$store.dispatch('ClearDaehwa');
          this.selectPanelName='mention';
          this.prevPanelName='mention';
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
        else if(e.keyCode==99|| e.keyCode==67){//c, 대화 트윗 불러오기
          e.preventDefault();
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
        else if(e.keyCode==8){//backspace, 대화 숨기기. vuex의 대화 목록을 clear
          e.preventDefault();
          this.EventBus.$emit('FocusPanel', this.prevPanelName);
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
          var ipcRenderer = require('electron').ipcRenderer;
          ipcRenderer.send('child', tweet, this.$store.state.DalsaeOptions.uiOptions);
        }
        else if(e.keyCode==86||e.keyCode==118){//v, 컨텍스트 메뉴
          e.preventDefault();
          this.selectPanel.ShowContextMenu();
        }
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
    this.EventBus.$on('TweetFocus', (id)=>{//id: tweet id
      this.selectPanel.Focused(id);
    });
    this.EventBus.$on('FocusOut', (id)=>{
      this.selectPanel.FocusOut(id);
    });
    this.EventBus.$on('FocusDaehwa', ()=>{
      this.prevPanelName=this.selectPanelName;
      this.selectPanelName='daehwa';
      this.selectPanel.Focus(undefined);
    });
    this.EventBus.$on('FocusPanel', (selectPanelName)=>{
      if(this.selectPanelName=='daehwa' && selectPanelName!='daehwa'){//대화패널에서 나갈 경우 클리어
        this.$store.dispatch('ClearDaehwa');
      }
      if(selectPanelName!='' &&selectPanelName != undefined){
        this.selectPanelName=selectPanelName;
      }
      this.selectPanel.Focus();
    });
  },
  methods:{
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
    width: 100%;
  }
  .panel-right{
    flex: 1 50%;
  }
}
</style>