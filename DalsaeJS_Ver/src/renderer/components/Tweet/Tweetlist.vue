<template>
  <div ref="panel" tabindex="-1" class="tweet-list" @keydown.up="ArrowUp" @keydown.down="ArrowDown" @keydown.enter="Enter">
    <loading v-if="isLoading" name="loadingTop"/>
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
            item.orgTweet.retweeted,
            item.orgTweet.favorited
          ]"
          >
          <TweetSelector 
            :option="options"
            :tweet="item"
            :index="index"
            :isSelected="index==selectIndex"
            :isDaehwa="false"/>
        </DynamicScrollerItem>
      </template>
    </DynamicScroller>
    <loading v-if="isMoreLoading" name="loadingBottom"/>
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
  computed:{
    tweetLength(){//index 설정을 위한 값
      return this.tweets.length;
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
    tweetLength: function(newVal, oldVal){//스트리밍으로 인해 트윗이 추가 되면 index를 올려줘야함
      if(this.isShow==false && this.selectIndex==0) return;//최초 로딩 시 문제가 있어서 회피 목적
      this.selectIndex += newVal - oldVal;//1개만 바뀌지 않을 수 있으니 - 계산
      if(this.selectIndex>=this.tweets.length){
        this.selectIndex=this.tweets.length - 1;
      }
      this.ScrollLock();
    }
  },
  methods:{
    ScrollLock(){
      var scroller = this.$refs.scroll.$refs.scroller
      var scroll =scroller.getScroll();
      if(scroll.start==0) return;
      var id = this.tweets[0].id_str;
      var size = this.$refs.scroll.vscrollData.sizes[id];
      if(size!=undefined){
        scroller.scrollToPosition(scroll.start+size);
      }
      else{
        scroller.scrollToPosition(scroller.minItemSize+scroll.start)
      }
    },
    Enter(e){
      e.preventDefault();
      this.EventBus.$emit('FocusInput')
    },
    ShowContextMenu(){
      this.$refs.context.Show(undefined,this.tweets[this.selectIndex]);
      // this.$refs.list[this.selectIndex].ShowContextMenu();
    },
    GetSelectTweet(){
      return this.tweets[this.selectIndex];
    },
    GetQTTweet(){
      return this.tweets[this.selectIndex].orgTweet.quoted_status;
    },
    ResTweets(vals){
      var loading = vals['isLoading'];
      var name = vals['panelName'];
      if(name==this.panelName){
        this.isLoading=loading;
      }
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
      this.ScrollToTweet(this.selectIndex);
      this.EventBus.$emit('TweetFocus', id);//트윗의 실제 포커스는 emit
    },
    ScrollToTweet(index){//focus 되는 트윗 index에 맞게끔 스크롤을 이동 시키는 기능
      var scroller = this.$refs.scroll.$refs.scroller;
      var child = scroller.$children;
      var nowItem=undefined;
      if(index<0) index = 0;
      else if(index>=this.tweets.length) index--;
      for(var i=0;i<child.length;i++){
        if(child[i].id==this.tweets[index].id){
          var tempPos = child[i].$el.getBoundingClientRect();
          if(tempPos.y<-1000){//가상스크롤 pool에 같은 key가 2개 있는 경우가 있어서 화면 밖의 dom일 경우 스킵
            continue;
          }
          nowItem=child[i];
          break;
        }
      }
      if(nowItem==undefined){//focus 할 VirtualScrollItem이 스크롤 밖에 있을 경우
        this.$refs.scroll.scrollToItem(index);
        return;
      }
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
      this.ScrollToTweet(this.tweets.length-1)
      // return;//홈엔드 로직에 문제 있어 일단 막음
      if(this.tweets===undefined) return;
      this.selectIndex=this.tweets.length-1;
      this.FocusTweet(e);
    },
    Home(e){
      this.ScrollToTweet(0);
      // return;//홈엔드 로직에 문제 있어 일단 막음
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
  display: flex;
  flex-direction: column;
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