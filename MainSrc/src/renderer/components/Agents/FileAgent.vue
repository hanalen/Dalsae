<template>
  <div class="user-call">
  </div>
</template>

<script>
const app = require('electron').remote.app
import {EventBus} from '../../main.js';
import axios from 'axios'
import FileStream from 'fs-extra'
export default {
  name: "fileagent",
  props: {
  },
  created() {
		const { ipcRenderer } = require('electron');
		ipcRenderer.on('ConfigPath',(event, path)=>{
			if(path == undefined){
				this.configPath = app.getPath('userData');
			}
			else{
				this.configPath=path.path;
			}
			this.CheckFolders();
			this.LoadAll();
		});
		ipcRenderer.on('ConfigChange',(event, path)=>{
			this.ConfigChange(path);
		});
		this.EventBus.$on('LoadFiles', () => {
      ipcRenderer.send('GetConfigPath');
		});
		this.EventBus.$on('SaveAccount',()=>{
			this.SaveAccount();
		});
		this.EventBus.$on('SaveOption',()=>{
			this.SaveOption();
		});
  
  },
  data() {
    return {
			configPath:'',
    };
  },
  computed:{
    selectAccount(){
      return this.$store.state.Account.selectAccount;
		},
		accountPath(){
			return this.configPath + '/Dalsae/Data/Switter.json';
		},
		optionFilePath(){
			return this.configPath + "/Dalsae/Data/option.json"
		},
		hotkeyFilePath(){
			return this.configPath + "/Dalsae/Data/hotkey.ini"
		},
		dataFolderPath(){
			return this.configPath + "/Dalsae/Data"
		},
		skinFolderPath(){
			return this.configPath + "/Dalsae/Skin"
		},
		imageFolderPath(){
		 return this.configPath + "/Dalsae/Image"
		},
		tempFolderPath(){
			return this.configPath + "/Dalsae/Temp"
		},
		soundFolderPath(){
			return this.configPath + "/Dalsae/Sound"
		},
  },
  methods: {
		ConfigChange(config){//config: object
			const fs = require('fs-extra');
			if(config==undefined){
				this.configPath = app.getPath('userData');
				this.CheckFolders();
			}
			else if(fs.existsSync(config.path)==false){
				try{
					fs.mkdirsSync(config.path);
					this.configPath=config.path;
				}
				catch(err){//폴더 생성에 문제가 있는 거이므로 기본값으로 넣고 종료
					console.log(err)
					this.configPath = app.getPath('userData')
				}
			}
			else{
				var pathFrom = this.configPath;
				this.configPath=config.path;
				console.log('path from: '+pathFrom)
				console.log('path to: '+this.configPath)
				this.CheckFolders();
				this.SaveAll();
			}
		},
		CheckFolders(){
			const fs = require('fs-extra');
			if(fs.existsSync(this.dataFolderPath)==false){
				fs.mkdirsSync(this.dataFolderPath);
			}
			if(fs.existsSync(this.skinFolderPath)==false){
				fs.mkdirsSync(this.skinFolderPath);
			}
			if(fs.existsSync(this.imageFolderPath)==false){
				fs.mkdirsSync(this.imageFolderPath);
			}
			if(fs.existsSync(this.tempFolderPath)==false){
				fs.mkdirsSync(this.tempFolderPath);
			}
			if(fs.existsSync(this.soundFolderPath)==false){
				fs.mkdirsSync(this.soundFolderPath);
			}
		},
		SaveAll(){
			this.SaveAccount();
			this.SaveOption();
		},
		SaveAccount(){
			const fs = require('fs-extra');
			var account = this.$store.state.Account;
			fs.writeJson(this.accountPath, account, 'utf-8')
			.then(() => {
				console.log('success!')
			})

		},
		SaveOption(){
			const fs = require('fs-extra');
			var option = this.$store.state.DalsaeOptions;
			fs.writeJson(this.optionFilePath, option, 'utf-8')
			.then(() => {
				console.log('option save success!')
			})
		},
  	LoadAll(){
			const fs = require('fs-extra');
			if(fs.existsSync(this.accountPath)){
				const account = fs.readJsonSync(this.accountPath, { throws: false });
				this.$store.dispatch('Account', account);
			}
			if(fs.existsSync(this.optionFilePath)){
				const account = fs.readJsonSync(this.optionFilePath, { throws: false });
				this.$store.dispatch('Option', account);
			}
			this.EventBus.$emit('FileLoaded');
		}
	},
};
</script>

<style lang="scss">

</style>
