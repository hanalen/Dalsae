<template>
	<div class="mute-popup">
		<div class="mute-top">
			<div class="mute-left">
				<div class="keyword-box">
					<span>단어 알림</span>
					<select size='6' v-model="hightlight">
						<option v-for="(item, index) in muteOption.highlight" :key="index">{{item}}</option>
					</select>
					<div class="bottom">
						<input class="text" type="text" v-model="hightlight"/>
						<input class="mute-btn" type="button" value="추가" @click="ClickAddHighlight"/>
						<input class="mute-btn" type="button" value="삭제" @click="ClickDeleteHighlight"/>
					</div>
				</div>
				<div class="keyword-box">
					<span>단어 뮤트</span>
					<select size='6' v-model="keyword">
						<option v-for="(item, index) in muteOption.keyword" :key="index">{{item}}</option>
					</select>
					<div class="bottom">
						<input class="text" type="text" v-model="keyword"/>
						<input class="mute-btn" type="button" value="추가" @click="ClickAddKeyword"/>
						<input class="mute-btn" type="button" value="삭제" @click="ClickDeleteKeyword"/>
					</div>
				</div>
			</div>
			<div class="mute-right">
				<div class="keyword-box">
					<span>유저 뮤트</span>
					<select size='6' v-model="user">
						<option v-for="(item, index) in muteOption.user" :key="index">{{item}}</option>
					</select>
					<div class="bottom">
						<input class="text" type="text" v-model="user"/>
						<input class="mute-btn" type="button" value="추가" @click="ClickAddUser"/>
						<input class="mute-btn" type="button" value="삭제" @click="ClickDeleteUser"/>
					</div>
				</div>
				<div class="keyword-box">
					<span>클라이언트 뮤트</span>
					<select size='6' v-model="client">
						<option v-for="(item, index) in muteOption.client" :key="index">{{item}}</option>
					</select>
					<div class="bottom">
						<input class="text" type="text" v-model="client"/>
						<input class="mute-btn" type="button" value="추가" @click="ClickAddClient"/>
						<input class="mute-btn" type="button" value="삭제" @click="ClickDeleteClient"/>
					</div>
				</div>
			</div>
		</div>
		<div class="mute-bottom">
			<input class="mute-btn" type="button" value="저장" @click="ClickSave"/>
			<input class="mute-btn" type="button" value="취소" @click="ClickCancle"/>
		</div>
	</div>
</template>

<script>
import {EventBus} from '../../main.js';
import { ipcMain } from 'electron';

export default {
	name: 'mutePopup',
	components:{
	},
  data () {
    return {
			muteOption:undefined,
			hightlight:'',
			keyword:'',
			user:'',
			client:'',
			tweet:'',
    }
	},
	props:{
	},
	created: function(){
		var ipcRenderer = require('electron').ipcRenderer;
		ipcRenderer.on('mute_option', (event, muteOption) => {
			this.muteOption=muteOption;
		});
	},
  mounted:function(){
	},
	methods:{
		ClickAddHighlight(e){
			this.muteOption.highlight.push(this.hightlight);
			this.hightlight='';
		},
		ClickDeleteHighlight(e){
			console.log(this.muteOption)
			var index=this.muteOption.highlight.indexOf(this.hightlight);
			if(index<0) return;//삭제 할 게 없을 경우
			console.log(index);
			this.muteOption.highlight.splice(index, 1);
		},
		ClickAddKeyword(e){
			this.muteOption.keyword.push(this.keyword);
			this.keyword='';
		},
		ClickDeleteKeyword(e){
			var index=this.muteOption.keyword.indexOf(this.keyword);
			if(index<0) return;//삭제 할 게 없을 경우
			this.muteOption.keyword.splice(index, 1);
		},
		ClickAddUser(e){
			this.muteOption.user.push(this.user);
			this.user='';
		},
		ClickDeleteUser(e){
			var index=this.muteOption.user.indexOf(this.user);
			if(index<0) return;//삭제 할 게 없을 경우
			this.muteOption.user.splice(index, 1);
		},
		ClickAddClient(e){
			this.muteOption.client.push(this.client);
			this.client='';
		},
		ClickDeleteClient(e){
			var index=this.muteOption.client.indexOf(this.client);
			if(index<0) return;//삭제 할 게 없을 경우
			this.muteOption.client.splice(index, 1);
		},
		ClickSave(e){
			var ipcRenderer = require('electron').ipcRenderer;
			ipcRenderer.send('MuteOptionSave', this.muteOption)
			ipcRenderer.send('CloseMuteOptionPopup');
		},
		ClickCancle(e){
			var ipcRenderer = require('electron').ipcRenderer;
			ipcRenderer.send('CloseMuteOptionPopup');
		},
	}
}
</script>
<style lang="scss" scoped>
.mute-top{
	display: flex;
	flex-direction: row;
}
.keyword-box{
	font-size: 12px;
	padding: 10px;
	width: 260px;
	// height: 140px;
	display: flex;
	flex-direction: column;

	select{
		width: 100%;
		height: 80px;
		margin-bottom: 4px;
	}
	input{
		width: 120px;
	}
	.mute-btn{
		width: 50px;
		font-size: 12px;
	}
}
</style>
