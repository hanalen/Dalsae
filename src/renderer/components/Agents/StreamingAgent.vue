<template>
  <div class="streaming-agent">
  </div>
</template>

<script>
import {EventBus} from '../../main.js';
import axios from 'axios'
import { ipcMain } from 'electron';
import FileStream from 'fs-extra'
export default {
  name: "streamingagent",
  props: {
  },
  created() {
	var exec = require('child_process').execFile;

var fun =function(){
   console.log("fun() start");
   exec('Dalsae.exe', function(err, data) {  
        console.log(err)
        console.log(data.toString());                       
    });  
}
fun();
  },
  data() {
    return {
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
