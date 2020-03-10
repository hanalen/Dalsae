<template>
	<modal name="input-pin" :width="350" :height="100" @before-open="BeforeOpen">
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
    }
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
    beforeClose (event) {
      console.log('before close')
    }
	}
}
</script>
<style lang="scss">
.input-pin{
	margin: 20px;
}
</style>
