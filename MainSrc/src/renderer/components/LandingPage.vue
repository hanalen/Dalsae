<template>
  <div class="app">
    <ImageModal ref="imageModal" v-if="isShowImage" :uiOption="this.$store.state.DalsaeOptions.uiOptions"/>
    <AccountSelectModal ref="accountModal" v-if="isShowAccount"/>
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
        <IPCAgent/>
        <StreamingAgent/>
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
import StreamingAgent from "./Agents/StreamingAgent.vue"
import IPCAgent from "./Agents/IPCAgent.vue"
import OAuth from "../oauth.js"
import UIOptionModal from './Modals/UIOptionModal.vue'
import ImageModal from './Modals/ImageModal.vue'
import AccountSelectModal from './Modals/AccountSelectModal.vue'

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
    IPCAgent,
    StreamingAgent,
    UIOptionModal,
    ImageModal,
    AccountSelectModal,
  },
  data () {
    return {
      isShowUIOption:false,
      isShowImage:false,
      isShowAccount:false,
      hotKey:this.$store.state.DalsaeOptions.hotKey,
    }
  },
  methods: {
    KeyDown(e){
      if(document.activeElement.tagName=='TEXTAREA') return;
      Object.keys(this.hotKey).forEach((key)=>{
        if(this.hotKey[key].isCtrl==e.ctrlKey && this.hotKey[key].isAlt==e.altKey &&
            this.hotKey[key].isShift==e.shiftKey && this.hotKey[key].key.toUpperCase()==e.key.toUpperCase()){
          e.preventDefault();
          e.stopPropagation();
          this.EventBus.$emit('HotKeyDown', key)
        }
      })
    },
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
      document.addEventListener('keydown', this.KeyDown);
      this.EventBus.$emit('LoadFiles');
    });

    const { ipcRenderer } = require('electron');
    ipcRenderer.on('update_downloaded', ()=>{
      var yes = confirm('달새의 새 업데이트가 다운로드 되었습니다. 확인을 누르면 재시작됩니다.');
      if(yes==true){
        ipcRenderer.send('restart_app');
      }
    });
  },
  mounted:function(){
    this.EventBus.$on('ShowAccountModal', (isShow)=>{
      this.isShowAccount=isShow;
    });
    this.EventBus.$on('ClosePopup', () => {
        this.ClosePopup();
    });
    this.EventBus.$on('FileLoaded',()=>{
      // console.log('file loaded')
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
