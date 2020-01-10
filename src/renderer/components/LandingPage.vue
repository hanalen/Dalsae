<template>
  <div class="app">
    <ImageModal ref="imageModal" v-if="isShowImage" :uiOption="this.$store.state.DalsaeOptions.uiOptions"/>
    <div class="dalsae">
      <UIOptionModal v-if="isShowUIOption"/>
      <div id="main-page">
        <UITop v-bind:following="this.$store.state.following" :uiOption="this.$store.state.DalsaeOptions.uiOptions" />
        <TweetPanel/>
        <UIBottom/>
        <InputPin/>
        <UserCall/>
        <TweetCall/>
        <FileAgent/>
      </div>
    </div>
  </div>
</template>

<script>
import TweetPanel from "./Tweet/TweetPanel.vue"
import UITop from "./UITop/UITop.vue";
import UIBottom from "./UIBottom.vue"
import InputPin from "./Modals/InputPin.vue"
import ApiUser from "./APICalls/UserCall.js"
import UserCall from "./APICalls/UserCall.vue"
import TweetCall from "./APICalls/TweetCall.vue"
import FileAgent from "./Agents/FileAgent.vue"
import OAuth from "../oauth.js"
import UIOptionModal from './Modals/UIOptionModal.vue'
import ImageModal from './Modals/ImageModal.vue'

export default {
  name: 'landing-page',
  components: { 
    TweetPanel,
    UITop,
    UIBottom,
    InputPin,
    UserCall,
    TweetCall,
    FileAgent,
    UIOptionModal,
    ImageModal,
  },
  data () {
    return {
      isShowUIOption:false,
      isShowImage:false,
    }
  },
  methods: {
    open (link) {
      this.$electron.shell.openExternal(link)
    },
    ClosePopup(){
      this.$modal.hide('input-pin', {
        show: false
      });
    },
  
    StartDalsae(){
       if(this.$store.state.Account==undefined ||this.$store.state.Account.accountList==undefined||
          this.$store.state.Account.accountList.length==0){//등록 된 계정이 없을 경우
        this.$nextTick(() =>{//이벤트에서 show가 되기 전에 focus 호출 시 focus가 되지 않는 문제가 있어서 nextTick사용
          this.$modal.show('input-pin', {
            show: true
          })
        });
      }
      else{
        this.$nextTick(() =>{//이벤트에서 show가 되기 전에 focus 호출 시 focus가 되지 않는 문제가 있어서 nextTick사용
          this.EventBus.$emit('StartDalsae');
        });
      }
    },
    ShowImage(tweet){
      this.isShowImage=true;
      this.$nextTick(()=>{
        // this.$refs.imageModal.tweet = tweet;
        this.$refs.imageModal.SetTweet(tweet);
      });
    },
    HideImage(){
      this.isShowImage=false;
    },
  },
  created: function(){
    this.$nextTick(()=>{
      this.EventBus.$emit('LoadFiles');
    });
  },
  mounted:function(){
    this.EventBus.$on('ClosePopup', () => {
        this.ClosePopup();
    });
    this.EventBus.$on('FileLoaded',()=>{
      console.log('file loaded')
      this.StartDalsae();
    });
    this.EventBus.$on('OpenUIOption', ()=>{
      this.isShowUIOption = !this.isShowUIOption;
    });
    this.EventBus.$on('CloseUIOption',()=>{
      this.isShowUIOption = false;
    });
    this.EventBus.$on('ShowTweetImage', (tweet)=>{
      this.ShowImage(tweet);
    });
    this.EventBus.$on('HideTweetImage', ()=>{
      console.log('a')
      this.HideImage();
    });
  }
}
</script>


<style lang="scss">
html,body{
    margin: 0px;
    overflow: hidden;
}
.dalsae{
  display: flex;
  flex-direction: row;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
#main-page {
  display: flex;
  flex: 1;
  flex-direction: column;
  font-family: "Malgun Gothic" !important;
  overflow: hidden;
  // -webkit-font-smoothing: antialiased;
  // -moz-osx-font-smoothing: grayscale;
  // color: #2c3e50;
  // margin-top: 60px;
}
</style>
