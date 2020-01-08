<template>
  <div ref="panel" tabindex="-1" class="tweet-list" @keydown="KeyDown">
    <loading v-if="isMoreLoading" name="loadingBottom"/>
    <Tweet 
    ref="list"
      v-for="(item,index) in tweets"
      v-bind:key="item.id"
      :option="options"
      :tweet="item"
      :index="index"
      :isDaehwa="false"
      :class="{'tweet-odd':index%2==1,'tweet-even':index%2==0}"
    />
    <loading v-if="isLoading" name="loadingTop"/>
  </div>
</template>

<script>
import Tweet from "./Tweet.vue";
import Loading from "../ToolBox/Loading.vue"
export default {
  name: "tweetlist",
  data:function(){
    return{
      selectIndex : 0,
      isLoading:true,
      isMoreLoading:false,
    }
  },
  components:{
    Tweet,
    Loading,
  },
  props: {
    panelName:undefined,
    tweets: undefined,
    options: undefined
  },
  mounted: function() {//EventBus등록용 함수들
    if(this.tweets!=undefined){
      this.selectIndex=this.tweets.length-1;
    }
    this.EventBus.$on('LoadingTweetPanel', (vals) => {
      this.ResTweets(vals);
    });
  },
  watch: { 
    tweets: function(newVal, oldVal) { // 트윗 최초 세팅 시 index설정
      // this.selectIndex=newVal.length -1 ;
      // console.log('tweet change');
    }
  },
  methods:{
    GetSelectTweet(){
      return this.tweets[this.selectIndex];
    },
    GetQTTweet(){
      return this.$refs.list[this.selectIndex].qtTweet;
    },
    ResTweets(vals){
      var loading = vals['isLoading'];
      var name = vals['panelName'];
      if(name==this.panelName){
        this.isLoading=loading;
      }
    },
    KeyDown(e){
      this.EventBus.$emit('TweetKeyDown', e);
    },
    FocusTweet(e){//트윗 포커스 
      e.preventDefault();
      this.$refs.list[this.selectIndex].$el.focus();
    },
    Prev(e){
      //위로 가는 거. 키보드 위 키
      if(this.tweets===undefined) return;
      this.selectIndex++;
      if(this.selectIndex >= this.tweets.length){
        this.selectIndex = this.tweets.length-1;
        this.EventBus.$emit('FocusInput');
      }
      this.FocusTweet(e);
    },
    Next(e){
      //아래로 가는 거. 키보드 아래 키
      if(this.tweets===undefined) return;
      this.selectIndex--;
      if(this.selectIndex<0){
        this.selectIndex=0;
      }
      this.FocusTweet(e);
    },
    Home(e){
      if(this.tweets===undefined) return;
      this.selectIndex=this.tweets.length-1;
      this.FocusTweet(e);
    },
    End(e){
      if(this.tweets===undefined) return;
      this.selectIndex=0;
      this.FocusTweet(e);
    },
    Focused(id){//트윗 클릭 시 호출 되는 이벤트
      if(this.tweets!=undefined){
        this.selectIndex=this.tweets.findIndex(x=>x.id==id);
      }
    },
    Focus(e){//panel변경 시 호출 되는 focus
      if(e!=undefined){
        e.preventDefault();
      }
      if(this.selectIndex==-1){//최초 세팅 시 index 설정이 안 되는 문제가 있어서 이와 같이 설정... 좋진 않은 코드다
        this.selectIndex=this.tweets.length-1;
      }
      var focusEl=undefined;
      if(this.tweets.length==0){
        focusEl=this.$refs.panel;
      }
      else{
        if(this.$refs.list!=undefined){
          focusEl = this.$refs.list[this.selectIndex];
        }
        else{
          setTimeout(() => {//대화패널 표시 시 포커스가 안 되는 문제가 있음.... 왜지....
            focusEl = this.$refs.list[this.selectIndex];
            focusEl.$el.focus(); 
          }, 100);
        }
      }
      if(focusEl!=undefined){
        this.$nextTick(() =>{//이벤트에서 show가 되기 전에 focus 호출 시 focus가 되지 않는 문제가 있어서 nextTick사용
          focusEl.$el.focus(); 
        });
      }
      else{
        this.$el.focus();
      }
    },
    FocusOut(id){
    },
  }
};
</script>
<style lang="scss" scoped>
.tweet-list{
  display: flex;
  background-color: #ffeded;
  flex-direction:column-reverse;
}

</style>