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
import Main from '../../main.js'
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
	components:{
		Main
	},
  mounted:function(){
		console.log('image popup~!')
		console.log(this)
		console.log(EventBus)
		console.log(Main);
		// console.log(main.app);
		// console.log(this.tweet);
		setTimeout(() => {
			console.log('mounted time out')			
			console.log(this.tweet);
		}, 1000);
	},
	created(){
		var ipcRenderer = require('electron').ipcRenderer;
		ipcRenderer.on('tweet', (event, tweet) => {
			console.log('tweet recv');
			this.tweet=tweet;
		});
		// console.log(this.$router.params)
		// console.log(this.$router);
		// console.log(this.$router.history.current.query.id);
		// console.log(this.$store.state.tweets);
		// var id = this.$router.history.current.query.id;
		// for (let [key, value] of Object.entries(this.$store.state.tweets)){
		// 	var bfind=false;
		// 	console.log('for')
		// 	value.forEach(function(tempTweet){
		// 		console.log('fore each')
		// 		console.log(tempTweet)
		// 		if(tempTweet.orgTweet.id_str==id){
		// 			this.tweet=tempTweet;
		// 			bfind=true;
		// 			return false;
		// 		}
		// 	}); 
		// 	if(bfind) break;
		// };
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
