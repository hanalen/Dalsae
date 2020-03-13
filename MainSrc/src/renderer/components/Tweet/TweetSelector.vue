<template>
  <div class="tweet-selector" tabindex="-1" @mouseenter="Hover" @mouseleave="HoverOut" 
	@focus="Focused" v-on:focusout="FocusOut"
    @mousedown="Click">
    <Tweet ref="tweet"
			v-if="!option.isSmallTweet || isFocus"
			:option="option"
      :tweet="tweet"
      :index="index"
      :isDaehwa="false"
      :qtTweet="tweet.qtTweet"
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
    };
  },
  created:function(){
    this.EventBus.$on('TweetFocus', (id)=>{//트윗이동 시 전역으로 포
      if(id==this.tweet.id_str)
        this.Focus();
    });
    if(this.tweet.orgTweet.quoted_status!=undefined){
      this.EventBus.$emit('LoadQTTweet', this.tweet);
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
    Focus(){
      this.$nextTick(()=>{
        this.$el.focus();
      })
    },
    Focused(e){
      e.preventDefault();
      console.log('tweet focus index: '+this.index);
      this.EventBus.$emit('FocusedTweet', this.index);
      this.tweet.isFocus=true;
      this.isFocus=true;
      if(this.option.isUseRead){//읽은 트윗 표시 여부 
        if(!this.tweet.isReaded)
          this.$store.dispatch('TweetRead', this.tweet);
      }
    },
    FocusOut(e){
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
