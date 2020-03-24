<template>
  <div class="streaming-agent">
  </div>
</template>

<script>
//스트리밍 예제 코드 https://gist.github.com/jfsiii/034152ecfa908cf66178
import {EventBus} from '../../main.js';
import APIKey from '../../APIKey.js'
import OAuth from '../../oauth.js'
import axios from 'axios'
import { ipcMain } from 'electron';
import FileStream from 'fs-extra'
export default {
  name: "streamingagent",
  props: {
  },
  computed:{
    selectAccount(){
      return this.$store.state.Account.selectAccount;
    }
  },
  created() {
    this.EventBus.$on('StopStreaming',()=>{
      this.StopStreaming();
    });
    this.EventBus.$on('StartStreaming',()=>{
      this.StartStreaming();
    });
  },
  data() {
    return {
      text:'',
      reader:undefined,
      decoder: new TextDecoder(),
    };
  },
  methods: {
    StartStreaming(){
      var method='GET';
      var arr=[];
      var orgUrl='https://userstream.twitter.com/1.1/user.json'
      var url = 'http://127.0.0.1:8811/userstream.twitter.com/1.1/user.json';
      fetch(url,
        {
          method: 'GET',
          headers: {
            'Content-Type':'application/x-www-form-urlencoded;encoding=utf-8',
            'Authorization': OAuth.GetHeader(arr, method, orgUrl, this.selectAccount.oauth_token, this.selectAccount.oauth_token_secret)
          }
        })
        .then(this.SteamingResponse)
        .then(this.StreamingClosed)
        .catch(this.StreamingError);
    },
    SteamingResponse(response) {
      this.text='';
      this.reader = response.body.getReader()
      return this.ReadStreaming();
    },
    StreamingClosed(result) {
      console.log('Streaming Closed!', result)
      setTimeout(() => {
        this.StartStreaming2();
      }, 3000);
    },
    StreamingError(err) {
      console.log('Streaming Error')
      console.error(err)
      setTimeout(() => {
        this.StartStreaming2();
      }, 3000);
    },
    ReadStreaming() {
      return this.reader.read().then(this.AppendJson);
    },
    AppendJson(result) {
      var chunk = this.decoder.decode(result.value || new Uint8Array, {stream: !result.done});
      console.log(chunk)
      console.log(this.text)
      if(chunk!=='\r\n'){
        this.text+=chunk;
        this.ParseJson(this.text);
      }
      if (result.done) {
        return this.text;
      } else {
        return this.ReadStreaming();
      }
    },
    ParseJson(json){
      if(json.length<10) return;//이상 패킷으로 예상 됨
      try{
        var tweet = JSON.parse(json);
        this.text='';
        console.log(tweet);
        if(tweet.id_str!=undefined){
          this.$store.dispatch('AddStreaming', tweet);
        }
      }
      catch(ex){
        console.log(ex);
        console.log(json);
      }
    },
	},
	mounted: function() {//EventBus등록용 함수들
  
	},
};
</script>

<style lang="scss" scoped>
span{
  position: fixed;
  left: 50px;
  top: 50px;
  color: red;
}
</style>
