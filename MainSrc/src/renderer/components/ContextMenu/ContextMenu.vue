<template>
  <div ref="context" v-show="isVisible" class="context-menu" @keydown.down="ArrowDown" @keydown.up="ArrowUp"
      @keydown.enter="Enter" @keydown.esc="Esc" tabindex="-1"
			v-bind:style="[{'left':x+'px', 'top':y+'px'}]" v-on:focusout="FocusOut" @focus="Focused">
    <div class="context-list" ref="list" tabindex="-1">
      <ContextMenuItem v-if="tweet.orgTweet.extended_entities!=undefined"
        :menuText="tweet.orgTweet.extended_entities.media[0].display_url"
        :hotkey="'G'" :callback="Media" :mouseenter="Hover"
        ref="Media"/>
      <ContextMenuItem v-for="(url, index) in tweet.orgTweet.entities.urls" :key="index" :url="url"
                    :menuText="url.display_url" :hotkey="''" :callback="Url" ref="Url" :mouseenter="Hover"/>
      <div class="context-group"></div>
      <ContextMenuItem :menuText="'답글'" :hotkey="'R'" :callback="Reply" ref="Reply" :mouseenter="Hover"/>
      <ContextMenuItem :menuText="'모두에게 답글'" :hotkey="'A'" :callback="ReplyAll" :mouseenter="Hover"/>
      <div class="context-group"></div>
      <ContextMenuItem :menuText="'리트윗'" :hotkey="'T'" :callback="Retweet" :mouseenter="Hover"/>
      <ContextMenuItem :menuText="'인용'" :hotkey="'W'" :callback="QT" :mouseenter="Hover"/>
      <ContextMenuItem :menuText="'관심글'" :hotkey="'F'" :callback="Favorite" :mouseenter="Hover"/>
      <div class="context-group"></div>
      <ContextMenuItem :menuText="'웹에서 보기'" :hotkey="'B'" :callback="ViewWeb" :mouseenter="Hover"/>
      <ContextMenuItem :menuText="'트윗 복사(미구현)'" :hotkey="'Ctrl+C'" :callback="Copy" :mouseenter="Hover"/>
      <ContextMenuItem :menuText="'트윗 삭제'" :hotkey="'Delete'" :callback="Delete" :mouseenter="Hover"/>
    </div>
  </div>
</template>

<script>
import ContextMenuItem from "./ContextMenuItem.vue";
export default {
  name: "contextmenu",
  data: function() {
    return {
      tweet:undefined,
      isVisible: false,
      x: 300,
      y: 0,
      selectIndex: 0
    };
  },
  computed: {},
  mounted: function() {
  },
  methods: {
    Hover(item){
      var index = this.$children.indexOf(item);
      if(index > -1){
        this.selectIndex=index;
        item.$el.focus();
      }
    },
    Media(){
      var ipcRenderer = require('electron').ipcRenderer;
      ipcRenderer.send('child', this.tweet, this.$store.state.DalsaeOptions.uiOptions);
    },
    Favorite(){
      this.EventBus.$emit('Favorite', this.tweet);
      this.Hide();
    },
    Retweet(){
      this.EventBus.$emit('Retweet', this.tweet);
      this.Hide();
    },
    Reply(){
      this.EventBus.$emit('Reply', this.tweet)
      this.Hide();
    },
    ReplyAll(){
      this.EventBus.$emit('ReplyAll', this.tweet)
      this.Hide();
    },
    QT(){

      this.Hide();
    },
    ViewWeb(){
      const { shell } = require('electron')
      shell.openExternal('https://twitter.com/'+this.tweet.orgTweet.user.screen_name+'/status/'+this.tweet.orgTweet.id_str)
      this.$store.dispatch('AddOpen', this.tweet);
      this.Hide();
    },
    Url(url){
      const { shell } = require('electron')
      shell.openExternal(url.expanded_url)
      this.$store.dispatch('AddOpen', this.tweet);
      this.Hide();
    },
    Copy(){
      this.Hide();
    },
    Delete(){
      this.EventBus.$emit('DeleteTweet', this.tweet);
      this.Hide();
    },
		Focused(e){
			// console.log('focus....')
		},
		FocusOut(e){
      if(this.$el.contains(e.relatedTarget)==false){//자식이 포커스인지 체크
        this.Hide();
      }
    },
    ArrowDown(e){
      e.stopPropagation();
      e.preventDefault();
      this.selectIndex++;
      if (this.selectIndex >= this.$children.length) {
        this.selectIndex--;
      }
      this.$children[this.selectIndex].$el.focus();
    },
    ArrowUp(e){
      e.preventDefault();
      e.stopPropagation();
      this.selectIndex--;
      if (this.selectIndex < 0) {
        this.selectIndex = 0;
      }
      this.$children[this.selectIndex].$el.focus();
    },
    Show(e, tweet) {
      if(e==undefined){
        e=new Object();
        var pos = document.activeElement.getBoundingClientRect();
        e.clientX = pos.x;
        e.clientY = pos.y;
      }
      this.tweet=tweet;
      this.isVisible = true;
      this.$nextTick(() => {
        var x=e.clientX;
        var y=e.clientY;
        var winWidth = window.innerWidth;//윈도우 넓이
        var winHeight = window.innerHeight;//윈도우 높이
        var width = this.$refs.context.clientWidth;//컨텍스트 넓이
        var height = this.$refs.context.clientHeight;//컨텍스트 높이
        if(x+width>winWidth){//컨텍스트가 화면 우측으로 나갈 경우
          x-=width;
        }
        if(y+height>winHeight){//컨텍스트가 화면 아래로 내려갈 경우
          y-=height;
        }

        this.x=x;
        this.y=y;
        this.FocusChild(e);
      });
    },
    Hide() {
      this.isVisible = false;
    },
    FocusChild(e) {
      if(e.preventDefault)
        e.preventDefault();
      if(this.$refs.Media){
        this.$refs.Media.$el.focus();
      }
      else if(this.$refs.Url){
        this.$refs.Url[0].$el.focus();
      }
      else{
        this.$refs.Reply.$el.focus();
      }
    },
    Esc(e) {
      e.preventDefault();
      e.stopPropagation();
      this.Hide();
    },
    Enter(e){
      e.preventDefault();
      e.stopPropagation();
      this.EventBus.$emit('ContextEnter');
    },
  },
  components: {
    ContextMenuItem
  },
};
</script>
<style lang="scss" scoped>
.context-menu {
  z-index: 10;
  position:fixed;
  overflow: hidden;
  background-color: #f5f5f5;
  width: auto;
  box-shadow: 4px 4px 4px #928080;
  padding: 4px;
	min-width: 200px;
  border: 1px solid #959595;
  border-radius: 5px;
  :focus {
    outline: none;
  }
  .context-list{
    .context-group{
      border-bottom: 1px solid #d7d7d7;
    }
  }
}
</style>