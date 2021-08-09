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
      controller:undefined,//stop하기 위한 컨트롤러
    };
  },
  methods: {
    StartStreaming(){
      this.reader=undefined;
      this.text='';
      this.controller = new AbortController();
      var signal = this.controller.signal;

      var method='GET';
      var arr=[];
      var orgUrl='https://userstream.twitter.com/1.1/user.json'
      var url = 'http://127.0.0.1:8811/userstream.twitter.com/1.1/user.json';
      var signal=this.signal;
      fetch(url,
        {
          method: 'GET',
          headers: {
            'Content-Type':'application/x-www-form-urlencoded;encoding=utf-8',
            'Authorization': OAuth.GetHeader(arr, method, orgUrl, this.selectAccount.oauth_token, this.selectAccount.oauth_token_secret)
          },
          signal
        })
        .then(this.SteamingResponse)
        .then(this.StreamingClosed)
        .catch(this.StreamingError)
    },
    StopStreaming(){
      console.log('stop streaming')
      this.controller.abort();
    },
    SteamingResponse(response) {
      this.text='';
      this.reader = response.body.getReader()
      return this.ReadStreaming();
    },
    StreamingClosed(result) {
      console.log('Streaming Closed!', result)
      setTimeout(() => {
        this.StartStreaming();
      }, 3000);
    },
    StreamingError(err) {
      console.log('Streaming Error')
      console.error(err)
      setTimeout(() => {
        this.StartStreaming();
      }, 3000);
    },
    ReadStreaming() {
      return this.reader.read().then(this.AppendJson);
    },
    AppendJson(result) {
      var chunk = this.decoder.decode(result.value || new Uint8Array, {stream: !result.done});
      if(chunk!=='\r\n'){//keep-alive 패킷이 아닌 게 들어 왔을 때에만 동작
        this.text += chunk;
        if(this.text.charAt(this.text.length - 1)=='\n'){//패킷의 마지막 문자는 \r\n, 완성 된 json일 경우에만 파싱 시도
          var listJson = this.text.split('\r\n');//json 끝문자로 쪼개서 parse시도한다
          for(var i=0;i<listJson.length;i++){
            this.ParseJson(listJson[i]);
          }
          this.text='';
        }
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
        if(tweet.id_str!=undefined){
          this.$store.dispatch('AddStreaming', tweet);
        }
      }
      catch(ex){
        console.log('-------------------------------------------------------------------------------------------------------')
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
