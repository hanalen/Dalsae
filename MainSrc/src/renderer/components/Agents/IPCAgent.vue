<template>
  <div class="ipc-agent">
  </div>
</template>

<script>
import {EventBus} from '../../main.js';
import axios from 'axios'
import { ipcMain } from 'electron';
import FileStream from 'fs-extra'
export default {
  name: "ipcagent",
  props: {
  },
  created() {
		var ipcRenderer = require('electron').ipcRenderer;
		ipcRenderer.on('MuteOptionSave', (event, muteOption) => {
			this.$store.dispatch('SaveMuteOption', muteOption);
			this.EventBus.$emit('SaveOption');
    });
    ipcRenderer.on('ClosedImagePopup', (event)=>{
      this.isShowImagePopup=true;
    })
    ipcRenderer.on('WindowFocused', (event)=>{
      if(this.isShowImagePopup){
        this.isShowImagePopup=false;
        this.EventBus.$emit('FocusPanel','')
      }
      else{
        this.EventBus.$emit('FocusInput');
      }
    });
    ipcRenderer.on('SaveHotkey', (event, hotkey)=>{
      this.$store.dispatch('Hotkey', hotkey)
			this.EventBus.$emit('SaveHotkey');
    });
    ipcRenderer.on('LoadUserTweet', (event, screen_name)=>{
      this.$store.dispatch('ClearUser');
      this.EventBus.$emit('LoadUserTweet', screen_name);
    });

    this.EventBus.$on('ShowImagePopup', (tweet)=>{
      var option=this.$store.state.DalsaeOptions.uiOptions;
      var ipcRenderer = require('electron').ipcRenderer;
      ipcRenderer.send('ShowImagePopup', this.tweet, this.$store.state.DalsaeOptions.uiOptions);
    })

    this.EventBus.$on('ShowProfile', (screenName)=>{
      ipcRenderer.send('ShowProfile', screenName, this.$store.state.Account.selectAccount, this.$store.state.follower);
    });
  },
  data() {
    return {
      isShowImagePopup:false,//이미지 팝업을 열었다 닫을 경우 포커스가 textarea가 아닌 tweetPanel이어야 해서 관리하는 flag
    };
  },
  computed:{
  
  },
  methods: {
	
	},
	mounted: function() {//EventBus등록용 함수들
  
	},
};
</script>

<style lang="scss">

</style>
