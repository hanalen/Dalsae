<template>
	<div>
		<span>image~~</span>
		<span>{{tweet}}</span>
		<!-- <span>{{tweet.id_str}}</span> -->
		<button @click="BtnClick">click</button>
	</div>
</template>
<script>
import ApiOAuth from "../APICalls/OAuthCall.js"
import {EventBus} from '../../main.js';

export default {
  name: 'imagemodal',
  data () {
    return {
			tweet:undefined,
    }
	},
	props:{
		// tweet:undefined,
	},	
  mounted:function(){
		console.log(this.tweet);
	},
	created(){
		console.log(this.$router.params)
		console.log(this.$router);
		console.log(this.$router.history.current.query.id);
		console.log(this.$store.state.tweets);
		var id = this.$router.history.current.query.id;
		for (let [key, value] of Object.entries(this.$store.state.tweets)){
			var bfind=false;
			console.log('for')
			value.forEach(function(tempTweet){
				console.log('fore each')
				console.log(tempTweet)
				if(tempTweet.orgTweet.id_str==id){
					this.tweet=tempTweet;
					bfind=true;
					return false;
				}
			}); 
			if(bfind) break;
		};
	},
	methods:{
		BtnClick(){
			this.$router.push('/') // 이동 위치를 입력
		},
	}
}
</script>
<style lang="scss">
.input-pin{
	margin: 20px;
}
</style>
