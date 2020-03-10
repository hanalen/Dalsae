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

    // this.AxiosProxy();
    // return;
    // var http = require("http");
    // var arr=[];
    // var url="https://userstream.twitter.com/1.1/user.json";
    // var options = {
    //   host: "127.0.0.1",
    //   port: 8811,
    //   path: "",
    //   timeout: 300,
    //   headers:{
		// 		'Content-Type':'application/x-www-form-urlencoded;encoding=utf-8',
		// 		'Authorization': OAuth.GetHeader(arr, 'GET', url, APIKey.ConsumerKey, APIKey.ConsumerSecretKey)
		// 	},
    // };
    // http.get(options, function(res) {
    //   console.log('gettttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt')
    //   console.log(res);
    //   res.pipe(process.stdout);
    // }).error((err)=>{
    //     console.log('err')
    //     console.log(err)
    // });

    this.ConnectStreamingHub();
  },
  data() {
    return {
      connection:undefined,
    };
  },
  computed:{
  
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
