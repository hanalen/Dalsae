<template>
	<modal name="input-pin" :width="350" :height="100" @before-open="BeforeOpen" @before-close="BeforeClose">
		<div class="input-pin">
			<span>로그인 후 나온 숫자를 입력 해주세요</span>
			<input v-model="pin"/>
			<button type="button" @click="BtnClick"> 확인</button>
		</div>
	</modal>
</template>
<script>
import ApiOAuth from "../APICalls/OAuthCall.js"
import {EventBus} from '../../main.js';

export default {
  name: 'DemoInputPin',
  data () {
    return {
			TempOAuth:[],
			pin:'',
			publicKey:'',
			secretKey:'',
			isIssued:false,
			userid:'',
    }
	},
	created:function(){
		this.EventBus.$on('AddAccount', (userid)=>{
			this.userid=userid;
		});
	},
  mounted:function(){
	
	},
	methods:{
		BeforeOpen(e){
			this.pin='';
			this.ReqToken();
		},
		ReqToken(){
			// var arr=[];
			// arr['oauth_callback']= 'oob';
			ApiOAuth.GetToken(this.ResToken);
		},
		ResToken(oauth){
			console.log('pin oauth');
			console.log(oauth);
			this.publicKey= oauth['oauth_token'];
			this.secretKey= oauth['oauth_token_secret'];
		},
		ResAccessToken(arrOAuth){
			this.isIssued=true;
			this.$store.dispatch('AddToken', arrOAuth);
			this.EventBus.$emit('ClosePopup');
			this.EventBus.$emit('StartDalsae');
			this.EventBus.$emit('SaveAccount');
		},
		BtnClick(e){
			ApiOAuth.GetAccessToken(this.pin, this.publicKey, this.secretKey, this.ResAccessToken);
		},
		beforeOpen (event) {
      console.log('before open')
    },
    BeforeClose (event) {
			if(this.isIssued==false){
				this.$store.dispatch('AccountChange', this.userid);//인증 안 하고 닫아버리면 전에 선택 했던 계정 재선택
				this.EventBus.$emit('StartStreaming');
				this.EventBus.$emit('StartDalsae');
			}
    }
	}
}
</script>
<style lang="scss">
.input-pin{
	margin: 20px;
}
</style>
