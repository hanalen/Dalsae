<template>
  <div class="dm-call">
  </div>
</template>

<script>
import {EventBus} from '../../main.js';
import DMCall from './DMCall.js';
import OAuth from '../../OAuth.js'
import axios from 'axios'

export default {
  name: "dmcall",
  props: {
  },
  created:function() {
		// DMCall.DMList(undefined, this.selectAccount.oauth_token, this.selectAccount.oauth_token_secret, this.ResDMList, this.ErrDMList)
		this.EventBus.$on('ReqDMList',()=>{
			DMCall.DMList(undefined, this.selectAccount.oauth_token, this.selectAccount.oauth_token_secret, this.ResDMList, this.ErrDMList)
		});
  },
  data() {
    return {
    };
	},
	computed:{
		selectAccount(){
			return this.$store.state.Account.selectAccount;
    }
	},
  methods: {
		ResDMList(data){//dm 목록 api 콜 리스폰스
			if(data.events.length==0) return;//dm 없음
			this.EventBus.$emit('ResDMList', data);
		},
		ErrDMList(err){

		},
		ResDMShow(data){

		},
		ErrDMShow(err){
		},
	},
};
</script>

<style lang="scss" scoped>

</style>
