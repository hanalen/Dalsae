<template>
  <div class="streaming-agent" v-if="selectAccount!=undefined">
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
// 	var exec = require('child_process').execFile;

// var fun =function(){
//    console.log("fun() start");
//    exec('Dalsae.exe', function(err, data) {  
//         console.log(err)
//         console.log(data.toString());                       
//     });  
// }
// fun();
    this.ConnectStreamingHub();
  },
  data() {
    return {
      connection:undefined,
    };
  },
  methods: {
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
    AxiosProxy(){
      var arr=[];
      var url="https://userstream.twitter.com/1.1/user.json";
      axios.get("http://127.0.0.1", {
        proxy: {
          host: "127.0.0.1",
          port: 8811
        },
         headers:{
          'Content-Type':'application/x-www-form-urlencoded;encoding=utf-8',
          'Authorization': OAuth.GetHeader(arr, 'GET', '127.0.0.1', APIKey.ConsumerKey, APIKey.ConsumerSecretKey)
			  },
      })
      .then(response => {
        console.log(response)
      })
      .catch(error => {
        console.log(error);
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
    SetStreaming(){
      this.connection.onclose(()=>{
        console.log('ws disconnected!');
        this.EventBus.$emit('WebSocketDisconnected');
        this.ConnectStreamingHub();
      });
      this.RecvStreaming(this.connection);
    },
    RecvStreaming(){
      this.connection.on("ResponseStreaming", (json) => {
        console.log(json)
        // this.EventBus.$emit('MonitorEvent', door);
      });
    },
	},
	mounted: function() {//EventBus등록용 함수들
  
	},
};
</script>

<style lang="scss">

</style>
