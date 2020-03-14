<template>
  <div ref="panel" tabindex="-1" class="tweet-list" @keydown="KeyDown" @keydown.up="ArrowUp" @keydown.down="ArrowDown">
    <loading v-if="isMoreLoading" name="loadingBottom"/>
    <DynamicScroller ref="scroll"
    :items="tweets"
    :min-item-size="options.isSmallTweet ? 30 : 84"
    class="scroller">
      <template v-slot="{ item, index, active }">
        <!--qttweet, retweet, fav 추가하면 height가 1인 애들이 나옴... 일단 그부분 보류-->
        <DynamicScrollerItem
          :item="item"
          :active="active"
          :data-index="index"
          :data-active="active"
          :size-dependencies="[
            item.orgTweet,
            item.isFocus,
            item.isReaded,
            item.isDelete,
          ]"
          >
          <TweetSelector 
            :option="options"
            :tweet="item"
            :index="index"
            :isDaehwa="false"/>
        </DynamicScrollerItem>
      </template>
    </DynamicScroller>
    <loading v-if="isLoading" name="loadingTop"/>
    <ContextMenu ref="context"/>
  </div>
</template>

<script>
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import {VueVirtualScroller, DynamicScroller, DynamicScrollerItem} from 'vue-virtual-scroller'
import TweetSelector from "./TweetSelector.vue";
import ContextMenu from '../ContextMenu/ContextMenu.vue'
import Loading from "../ToolBox/Loading.vue"
export default {
  name: "tweetlist",
  data:function(){
    return{
      selectIndex : 0,
      isLoading:false,
      isMoreLoading:false,
    }
  },
  components:{
    VueVirtualScroller,
    DynamicScroller,
    DynamicScrollerItem,
    TweetSelector,
    Loading,
    ContextMenu,
  },
  props: {
    panelName:undefined,
    tweets: undefined,
    options: undefined,
    isShow:{
      type:Boolean,
      default:false,
    }
  },
  mounted: function() {
    this.EventBus.$on('LoadingTweetPanel', (vals) => {
      this.ResTweets(vals);
    });
    this.EventBus.$on('FocusedTweet', (index)=>{//트윗 클릭, 포커스 시 트윗의 index를 받아 저장
      if(this.isShow)
        this.selectIndex=index;
    });
    this.EventBus.$on('ShowContext', (vals)=>{
      if(!this.isShow) return;

      var tweet=vals['tweet'];
      var e=vals['e'];
      this.$refs.context.Show(e,tweet);
    });
  },
  watch: { 
    tweets: function(newVal, oldVal) { // 트윗 최초 세팅 시 index설정
      // this.selectIndex=newVal.length -1 ;
      // console.log('tweet change');
    }
  },
  methods:{
    ShowContextMenu(){
      this.$refs.context.Show(undefined,this.tweets[this.selectIndex]);
      // this.$refs.list[this.selectIndex].ShowContextMenu();
    },
    GetSelectTweet(){
      return this.tweets[this.selectIndex];
    },
    GetQTTweet(){
      return this.$refs.list[this.selectIndex].GetQtTweet();
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
    ArrowUp(e){
      this.Prev(e);
    },
    ArrowDown(e){
      this.Next(e);
    },
    FocusTweet(e){//트윗 포커스 
      if(e)
        e.preventDefault();
      var id = this.tweets[this.selectIndex].id_str;
      if(this.selectIndex==this.tweets.length-1){//end키로 이동 시 한타임 안 맞음
        this.$refs.scroll.scrollToBottom();//스크롤 패널 맨아래로 이동 후 트윗 포커스
        this.$nextTick(()=>{
          this.EventBus.$emit('TweetFocus', id);//트윗의 실제 포커스는 emit
        })
      }
      else{
        this.ScrollToTweet(this.selectIndex);
        this.EventBus.$emit('TweetFocus', id);//트윗의 실제 포커스는 emit
      }
    },
    ScrollToTweet(index){//focus 되는 트윗 index에 맞게끔 스크롤을 이동 시키는 기능
      var scroller = this.$refs.scroll.$refs.scroller;
      var child = scroller.$children;
      var nowItem=undefined;
      if(index<0) index = 0;
      else if(index>=this.tweets.length) index--;
      for(var i=0;child.length;i++){
        if(child[i].id==this.tweets[index].id){
          nowItem=child[i];
          break;
        }
      }
      if(nowItem==undefined) return;//focus 할 VirtualScrollItem을 못 찾음

      var tweetPos = nowItem.$el.getBoundingClientRect();
      var panelPos = this.$refs.panel.getBoundingClientRect();
      var tweetBottom = tweetPos.y + tweetPos.height;
      var panelBottom = panelPos.y + panelPos.height;

      if( tweetBottom > panelBottom){
        var scroll = scroller.getScroll();
        var scrollTo =scroll.start + tweetBottom - panelBottom;//스크롤이 이동 값은 맨위가 0기준, top으로 계산 해야 맞음
        scroller.scrollToPosition(scrollTo);
      }
      else if(tweetPos.top < panelPos.y){
        this.$refs.scroll.scrollToItem(index);//내려가는 건 복잡한 로직 없이 단순히 index이동만 해도 됨
      }
    },
    Next(e){//키보드 아래 키
      e.preventDefault();
      if(this.tweets===undefined) return;
      this.selectIndex++;
      if(this.selectIndex >= this.tweets.length){
        this.selectIndex = this.tweets.length-1;
      }
      this.FocusTweet(e);
    },
    Prev(e){//키보드 위 키
      e.preventDefault();
      if(this.tweets===undefined) return;
      this.selectIndex--;
      if(this.selectIndex<0){
        this.selectIndex=0;
        this.EventBus.$emit('FocusInput');
      }
      else{
        this.FocusTweet(e);
      }
    },
    End(e){
      return;//홈엔드 로직에 문제 있어 일단 막음
      if(this.tweets===undefined) return;
      this.selectIndex=this.tweets.length-1;
      this.FocusTweet(e);
    },
    Home(e){
      return;//홈엔드 로직에 문제 있어 일단 막음
      if(this.tweets===undefined) return;
      this.selectIndex=0;
      this.FocusTweet(e);
    },
    Focus(e){//panel변경 시 호출 되는 focus
      this.$nextTick(()=>{
        if(e){
          e.preventDefault();
        }
        if(this.selectIndex==-1){//최초 세팅 시 index 설정이 안 되는 문제가 있어서 이와 같이 설정... 좋진 않은 코드다
          this.selectIndex=this.tweets.length-1;
        }
        var focusEl=undefined;
        if(this.tweets.length==0){
          focusEl=this.$refs.panel.focus();
        }
        else{
          this.FocusTweet(e);
        }
      })
    },
  }
};
</script>
<style lang="scss" scoped>
.tweet-list{
  overflow: hidden;
  height: 100%;
  // overflow-y: auto;
  // display: flex;
  background-color: #ffeded;
  // flex-direction:column-reverse;
}

.scroller{
  height: 100% !important;
  overflow-y: auto;

}
.vue-recycle-scroller .scroller .ready .direction-vertical{
  overflow-y: auto;
  height: 100%;
}
.vue-recycle-scroller__item-view{
  transform: translateY(0px) !important;
}
</style>