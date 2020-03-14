<template>
	<div class="modal-account-select" @click="Close">
		<div class="account-list">
			<div class="account" v-for="(item, index) in this.$store.state.Account.accountList" :key="index">
				<img :src="Propic(item)" @click="AccountChange(item)"/> 
			</div>
			<i class="far fa-plus-square fa-5x" @click="AddAccount"></i>
		</div>
	</div>
</template>
<script>
import {EventBus} from '../../main.js';

export default {
	name: 'accountselectmodal',
	components:{
	},
  data () {
    return {
    }
	},
	props:{

	},
	computed:{
	
	},
	created: function(){
	},
  mounted:function(){

	},
	methods:{
 		Propic(userData){
			return this.$store.state.DalsaeOptions.uiOptions.isBigPropic
				? userData.userData.profile_image_url_https.replace("_normal", "_bigger")
				: userData.userData.profile_image_url_https;
		},
		AccountChange(userData){
			if(this.$store.state.Account.selectAccount.user_id != userData.user_id){//같은 계정이 아닐때만 변경 진행
				this.EventBus.$emit('StopStreaming');
				this.$store.dispatch('AccountChange', userData.user_id);//vuex로 사용자 id_str만 던져서 계정 변경 
				this.EventBus.$emit('StartStreaming');
				this.EventBus.$emit('StartDalsae');
			}
			this.EventBus.$emit('ShowAccountModal', false);
		},
		Close(e){
			this.EventBus.$emit('ShowAccountModal', false);
		},
		AddAccount(e){
			this.EventBus.$emit('StopStreaming');
			this.$store.dispatch('AccountClear');
			this.$modal.show('input-pin', {
				show: true
			});
			this.Close(undefined);
		},
	}
}
</script>
<style lang="scss" scoped>
.modal-account-select{
	z-index: 999;
	position: fixed;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	padding: 20px;
	overflow: none;
	background-color: rgba(0, 0, 0, 0.7);
}
.account-list{
	display: flex;
	flex-direction: column;
	.account{
		margin-bottom: 10px;
	}
	.account img{
		// width: 100px;
		border-radius: 10px;
	}
	i{
		margin-top: -5px;
		color: #ffe0e0;
	}
}
</style>
