<template>
  <div ref="context" v-if="isVisible" class="context-menu" @keydown.down="ArrowDown" @keydown.up="ArrowUp"
      @keydown.enter="Enter" @keydown.esc="Esc" tabindex="-1"
			v-bind:style="[{'left':x+'px', 'top':y+'px'}]" v-on:focusout="FocusOut" @focus="Focused">
    <div class="context-list" ref="list" tabindex="-1">
      <ContextMenuItem v-if="tweet.orgTweet.extended_entities!=undefined"
        :menuText="tweet.orgTweet.extended_entities.media[0].display_url"
        :hotkey="'G'" :callback="Media"
        ref="Media"/>
      <ContextMenuItem v-for="(url, index) in tweet.orgTweet.entities.urls" :key="index"
                    :menuText="url.display_url" :hotkey="'T'" :callback="Url" ref="Url"/>
      <div class="context-group"></div>
      <ContextMenuItem :menuText="'답글'" :hotkey="'R'" :callback="Reply" ref="Reply"/>
      <ContextMenuItem :menuText="'모두에게 답글'" :hotkey="'A'" :callback="ReplyAll"/>
      <div class="context-group"></div>
      <ContextMenuItem :menuText="'리트윗'" :hotkey="'T'" :callback="Retweet"/>
      <ContextMenuItem :menuText="'인용'" :hotkey="'W'" :callback="QT"/>
      <ContextMenuItem :menuText="'관심글'" :hotkey="'F'" :callback="Favorite"/>
      <div class="context-group"></div>
      <ContextMenuItem :menuText="'웹에서 보기'" :hotkey="'B'" :callback="ViewWeb"/>
      <ContextMenuItem :menuText="'트윗 복사'" :hotkey="'Ctrl+C'" :callback="Copy"/>
      <ContextMenuItem :menuText="'트윗 삭제'" :hotkey="'Delete'" :callback="Delete"/>
    </div>
  </div>
</template>

<script>
import ContextMenuItem from "./ContextMenuItem.vue";
export default {
  name: "contextmenu",
  data: function() {
    return {
      isVisible: false,
      x: 300,
      y: 0,
      selectIndex: 0
    };
  },
  computed: {},
  mounted: function() {
    //EventBus등록용 함수들
    this.EventBus.$on("TTTT", e => {});
  },
  methods: {
    Media(){

    },
    Favorite(){
      this.EventBus.$emit('Favorite', this.tweet);
    },
    Retweet(){
      this.EventBus.$emit('Retweet', this.tweet);
    },
    Reply(){
      this.EventBus.$emit('Reply', this.tweet)
    },
    ReplyAll(){
      this.EventBus.$emit('ReplyAll', this.tweet)
    },
    QT(){

    },
    ViewWeb(){

    },
    Url(){
      //url entities 내부 변수 3개
      //expanded_url
      //url
      //display_url
    },
    Copy(){

    },
    Delete(){

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
      if (this.selectIndex >= this.$refs.list.children.length) {
        this.selectIndex--;
      }
      if(this.$refs.list.children[this.selectIndex].className=='context-group'){//라인 선택 중이면 한칸더 이동
        this.selectIndex++;
      }
      this.$refs.list.children[this.selectIndex].focus();
    },
    ArrowUp(e){
      e.preventDefault();
      e.stopPropagation();
      this.selectIndex--;
      if(this.$refs.list.children[this.selectIndex].className=='context-group'){//라인 선택 중이면 한칸더 이동
        this.selectIndex--;
      }
      if (this.selectIndex < 0) {
        this.selectIndex = 0;
      }
      this.$refs.list.children[this.selectIndex].focus();
    },
    Show(e) {
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
  props: {
    tweet: undefined
  }
};
</script>
<style lang="scss" scoped>
.context-menu {
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