<template>
  <div class="user-call">
  </div>
</template>

<script>
import {EventBus} from '../../main.js';
import axios from 'axios'
import FileStream from 'fs-extra'
export default {
  name: "fileagent",
  props: {
  },
  created() {
  },
  data() {
    return {
			accountPath:'Data/Switter.json',
			optionFilePath : "Data/option.json",
			hotkeyFilePath : "Data/hotkey.ini",

			dataFolderPath : "Data",
			skinFolderPath : "Skin",
			imageFolderPath : "Image",
			tempFolderPath : "Temp",
			soundFolderPath : "Sound",
    };
  },
  computed:{
    selectAccount(){
      return this.$store.state.Account.selectAccount;
    }
  },
  methods: {
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
			
			fs.writeJson('./package.json', {name: 'fs-extra'})
			.then(() => {
				console.log('success!')
			})
			.catch(err => {
				console.error(err)
			})
		},
		SaveAccount(){
			const fs = require('fs-extra');
			var account = this.$store.state.Account;
			fs.writeJson(this.accountPath, account)
			.then(() => {
				console.log('success!')
			})

		},
		SaveOption(){
			const fs = require('fs-extra');
			var option = this.$store.state.DalsaeOptions;
			fs.writeJson(this.optionFilePath, option)
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
	mounted: function() {//EventBus등록용 함수들
    this.EventBus.$on('LoadFiles', () => {
			this.CheckFolders();
			this.LoadAll();
		});
		this.EventBus.$on('SaveAccount',()=>{
			this.SaveAccount();
		});
		this.EventBus.$on('SaveOption',()=>{
			this.SaveOption();
		});
  
	},
};
</script>

<style lang="scss">

</style>
