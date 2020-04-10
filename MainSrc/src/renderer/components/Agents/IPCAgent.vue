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
    ipcRenderer.on('WindowFocused', (event)=>{
      this.EventBus.$emit('FocusInput');
    });
    ipcRenderer.on('SaveHotkey', (event, hotkey)=>{
      this.$store.dispatch('Hotkey', hotkey)
    });
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
