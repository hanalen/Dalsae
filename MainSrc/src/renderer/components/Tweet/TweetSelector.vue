<template>
  <div class="tweet-selector" tabindex="-1" @mouseenter="Hover" @mouseleave="HoverOut"  @mousedown="MouseDown"
	@focus="Focused" v-on:focusout="FocusOut">
    <Tweet ref="tweet"
			v-if="(!option.isSmallTweet) || ( option.isSmallTweet &&( isFocus || isSelected))"
			:option="option"
      :tweet="tweet"
      :index="index"
      :isDaehwa="false"
      :qtTweet="tweet.qtTweet"
      :class="{'tweet-odd':tweet.isOdd,'tweet-even': !tweet.isOdd, 'focused': isFocus, 'not-read':option.isUseRead && !tweet.isReaded,
                'selected': isSelected}"/>
		<SmallTweet ref="small"
			v-if="option.isSmallTweet && !isFocus && !isSelected"
			:option="option"
      :tweet="tweet"
      :index="index"
      :isDaehwa="false"
      :isSelected="isSelected"
      :class="{'tweet-odd':tweet.isOdd,'tweet-even':!tweet.isOdd, 'focused': isFocus, 'not-read':option.isUseRead && !tweet.isReaded}"/>
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
    isSelected:{
      type:Boolean,
      default:false,
    }
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
    MouseDown(e){
      this.EventBus.$emit('WindowFocused')
    },
    Hover(e){
      if(this.qtTweet && !this.option.isSmallTweet)
        this.$refs.tweet.Hover();
    },
    HoverOut(e){
      if(this.qtTweet && !this.option.isSmallTweet)
        this.$refs.tweet.HoverOut();
    },
    ShowContextMenu(){
      this.$refs.tweet.ShowContextMenu();
    },
    Focus(){
      this.$nextTick(()=>{
        this.$el.focus({preventScroll: true});
      })
    },
    Focused(e){
      e.preventDefault();
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
