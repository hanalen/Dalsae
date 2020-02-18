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
						<input class="mute-btn" type="button" value="추가"/>
						<input class="mute-btn" type="button" value="삭제"/>
					</div>
				</div>
				<div class="keyword-box">
					<span>단어 뮤트</span>
					<select size='6' v-model="hightlight">
						<option v-for="(item, index) in muteOption.highlight" :key="index">{{item}}</option>
					</select>
					<div class="bottom">
						<input class="text" type="text" v-model="hightlight"/>
						<input class="mute-btn" type="button" value="추가"/>
						<input class="mute-btn" type="button" value="삭제"/>
					</div>
				</div>
			</div>
			<div class="mute-right">
				<div class="keyword-box">
					<span>유저 뮤트</span>
					<select size='6' v-model="hightlight">
						<option v-for="(item, index) in muteOption.highlight" :key="index">{{item}}</option>
					</select>
					<div class="bottom">
						<input class="text" type="text" v-model="hightlight"/>
						<input class="mute-btn" type="button" value="추가"/>
						<input class="mute-btn" type="button" value="삭제"/>
					</div>
				</div>
				<div class="keyword-box">
					<span>클라이언트 뮤트</span>
					<select size='6' v-model="hightlight">
						<option v-for="(item, index) in muteOption.highlight" :key="index">{{item}}</option>
					</select>
					<div class="bottom">
						<input class="text" type="text" v-model="hightlight"/>
						<input class="mute-btn" type="button" value="추가"/>
						<input class="mute-btn" type="button" value="삭제"/>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import {EventBus} from '../../main.js';

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
