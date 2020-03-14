<template>
  <div class="streaming-agent">
  </div>
</template>

<script>
import {EventBus} from '../../main.js';
import APIKey from '../../APIKey.js'
import OAuth from '../../oauth.js'
import axios from 'axios'
 import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr'
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
      this.ExecBridge();
      this.StartStreaming();
    });
  },
  data() {
    return {
      connection:undefined,
    };
  },
  methods: {
    ExecBridge(){
      var exec = require('child_process').execFile;

      exec('StreamingBridge/netcoreapp3.1/StreamingBridge.exe', function(err, data) {  
        console.log(err)
        console.log(data.toString());                       
      });  
    },
    UnZip(packet){
      const { deflate, unzip } = require('zlib');
      const buffer = Buffer.from(packet, 'base64');
      unzip(buffer, (err, buffer) => {
        if (err) {
        }
        var json = buffer.toString();
        this.ParseJson(json);
      });
    },
    ConnectStreamingHub(){
      var vThis=this;
      this.connection = new HubConnectionBuilder()
        .withUrl('http://localhost:5001/TweetHub', { accessTokenFactory: () => 'administrator' })
        .configureLogging(LogLevel.Information)
        .build();
      this.connection.start().then(function () {
        console.log('connect tweet hub!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
        vThis.SendKeys();
        vThis.SetStreaming();
      }).catch(function(err){
        console.log('error~~~~')
        console.log(err);
        setTimeout(()=>{
          vThis.ConnectStreamingHub();
        },3000);
      });
    },
    SendKeys(){
      this.connection.invoke("Keys", this.selectAccount.oauth_token, this.selectAccount.oauth_token_secret,
      APIKey.ConsumerKey, APIKey.ConsumerSecretKey)
        .then(function()
        {
          
        })
        .catch(err => console.error(err.toString()));
      
    },
    StartStreaming(){
      if(this.connection){//이미 연결이 성립 되어 있을 경우 key만 update
        this.SendKeys();
      }
      else{
        this.ConnectStreamingHub();
      }
    },
    StopStreaming(){
      this.connection.invoke("StopStreaming")
      .then(function()
      {

      })
      .catch(err => console.error(err.toString()));
    },
    SetStreaming(){
      this.connection.onclose(()=>{
        console.log('ws disconnected!');
        this.EventBus.$emit('WebSocketDisconnected');
        this.ConnectStreamingHub();
      });
      this.RecvStreaming(this.connection);
    },
    RecvStreaming(){
      this.connection.on("ResponseStreaming", (packet) => {
        this.UnZip(packet);
      });
    },
    ParseJson(json){
      if(json.length<10) return;//이상 패킷으로 예상 됨
      var tweet = JSON.parse(json);
      console.log(tweet);
      if(tweet.id_str!=undefined){
        // console.log(tweet);
        this.$store.dispatch('AddStreaming', tweet);
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
