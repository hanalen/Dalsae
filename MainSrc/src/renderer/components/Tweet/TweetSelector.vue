<template>
  <div class="tweet-selector" tabindex="-1" @mouseenter="Hover" @mouseleave="HoverOut" @keydown.up="ArrowUp" @keydown.down="ArrowDown"
	@focus="Focused" v-on:focusout="FocusOut"
    @mousedown="Click">
    <Tweet ref="tweet"
			v-if="!option.isSmallTweet || isFocus"
			:option="option"
      :tweet="tweet"
      :index="index"
      :isDaehwa="false"
      :qtTweet="qtTweet"
      :class="{'tweet-odd':index%2==1,'tweet-even':index%2==0, 'selected': isFocus, 'not-read':option.isUseRead && !tweet.isReaded}"/>
		<SmallTweet ref="small"
			v-if="option.isSmallTweet && !isFocus"
			:option="option"
      :tweet="tweet"
      :index="index"
      :isDaehwa="false"
      :class="{'tweet-odd':index%2==1,'tweet-even':index%2==0, 'selected': isFocus, 'not-read':option.isUseRead && !tweet.isReaded}"/>
    <ContextMenu v-if="tweet.isMuted==false" ref="context" :tweet="tweet"/>
  </div>
</template>

<script>
import {EventBus} from '../../main.js';
import ContextMenu from '../ContextMenu/ContextMenu.vue'
import QTTweet from './QTTweet.vue'
import Tweet from './Tweet.vue'
import SmallTweet from './TweetSmall.vue'
export default {
  name: "tweetselector",
  components:{
		SmallTweet,
		Tweet,
		ContextMenu,
  },
  props: {
    tweet: undefined,
    option: undefined,
    index:undefined,
  },
  data() {
    return {
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
    
  },
  methods: {
    Hover(e){
      if(this.qtTweet && !this.option.isSmallTweet)
        this.$refs.tweet.Hover();
    },
    HoverOut(e){
      if(this.qtTweet && !this.option.isSmallTweet)
        this.$refs.tweet.HoverOut();
    },
    Click(e){
      if(e.button==2 || e.button==3){
        e.preventDefault();
        this.$refs.context.Show(e);
      }
    },
    ShowContextMenu(){
      var pos= this.$el.getBoundingClientRect()
      var event = new Object();
      event.clientX=pos.x;
      event.clientY=pos.y;
      this.$refs.context.Show(event);
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
      if(this.qtTweet && !this.option.isSmallTweet){
        this.$refs.tweet.Focused();
      }
      this.tweet.isFocus=true;
      this.isFocus=true;
      if(this.option.isUseRead){//읽은 트윗 표시 여부 
        if(!this.tweet.isReaded)
          this.$store.dispatch('TweetRead', this.tweet);
      }
      this.EventBus.$emit('TweetFocus', this.tweet.id);//대화쪽 트윗인지 일반쪽 트윗인지 표시 여부
    },
    FocusOut(e){
      if(this.qtTweet && !this.option.isSmallTweet){
        this.$refs.tweet.FocusOut();
      }
      this.tweet.isFocus=false;
      this.isFocus=false;
      this.EventBus.$emit('FocusOut', this.tweet.id);
    },
    GetQtTweet(){
      return this.$refs.tweet.GetQtTweet();
    },
  }
};
</script>

<style lang="scss" scoped>

</style>
