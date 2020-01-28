<template>
	<div class="modal-account-select">
		<div class="account-list">
			<div class="account" v-for="(item, index) in this.$store.state.Account.accountList" :key="index">
				<img :src="Propic(item)"/> 
			</div>
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
		Propic(userData){
			console.log(userData);
			return this.$store.state.DalsaeOptions.uiOptions.isBigPropic
          ? userData.profile_image_url_https.replace("_normal", "_bigger")
          : userData.profile_image_url_https;
		}
	},
	created: function(){
		console.log(this.$store.state.Account.accountList)
	},
  mounted:function(){

	},
	mounted(){
	},
	methods:{
 	
	}
}
</script>
<style lang="scss" scoped>
.modal-account-select{
	background-color: #00000062;
}
.account-list{
	display: flex;
	flex-direction: column;
}
</style>
