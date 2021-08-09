<template>
	<div class="profile-context" v-show="isShow">
		<div class="back" @mousedown="Close">
		</div>
		<div class="context" :style="{'left':x+'px','top':y+'px'}">
			<div class="context-item" v-if="user!=undefined && user.following" @click="ClickOffRetweet">
				<span>리트윗 끄기</span>
			</div>
			<div class="context-item" @click="ClickMute">
				<span>뮤트 하기</span>
			</div>
			<div class="context-item" @click="ClickBlock">
				<span>{{user.blocking ? '차단 해제' : '차단 하기' }}</span>
			</div>
			<div class="context-item" @click="ClickChainBlock">
				<span>체인 블락 하기</span>
			</div>
		</div>
	</div>
</template>

<script>
export default {
  name: "profilecontext",
  components: {
  },
  data: function() {
    return {
			isShow:false,
			x: 300,
			y: 0,
			user:undefined,
    };
	},
	props:{
	},
  computed:{
  },
  created: function() {
		
  },
  methods: {
		Close(e){
			this.isShow=false;
		},
		Show(e, user){
			this.user=user;
			this.isShow=true;
			this.x=e.clientX-40;
			this.y=e.clientY-10;
		},
		ClickOffRetweet(){
			this.EventBus.$emit('RetweetOff', this.user)
			this.isShow=false;
		},
		ClickMute(){
			this.EventBus.$emit('Mute', this.user);
			this.isShow=false;
		},
		ClickBlock(e){
			this.EventBus.$emit('ReqBlock', this.user)
			this.isShow=false;
		},
		ClickChainBlock(e){
			var ipcRenderer = require('electron').ipcRenderer;
			ipcRenderer.send('OpenChainBlockPopup', this.user);
			if(process.env.NODE_ENV === 'development') {//개발 환경에서 프로필 팝업이 떠있으면 체블 창이 안 뜨는 버그 있음 ㅡㅡ
				this.EventBus.$emit('CloseProfilePopup')
			}

		}
  },
};
</script>

<style lang="scss" scoped>
.profile-context{
	width: 600px;
	height: 900px;
	background-color: rgba(165, 165, 165, 0.39);
	position: fixed;
	left: 0;
	top: 0;
	.back{
		width: 600px;
		height: 900px;
		background-color: rgba(165, 165, 165, 0.39);
		position: fixed;
		left: 0;
		top: 0;
	}
	.context{
		position: fixed;
		background-color:white;
		z-index: 20;
		width: 120px;
		border-radius: 10px;
		// height: 500px;
		.context-item{
			width: 100%;
			padding:4px;
			height: 30px;
			border-bottom: dashed 1px rgb(211, 211, 211);
			span{
				margin-left: 10px;
			}
		}
		.context-item:hover{
			background-color: rgb(211, 211, 211);
			border-radius: 10px;
		}
	}
}
</style>
