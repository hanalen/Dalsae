<template>
	<div class="chain-block-popup">
		<div class="chain-block-item">
			<ChainBlockItem v-for="(user, index) in listUser" :key="index"/>
		</div>
	</div>
</template>

<script>
import ChainBlockItem from './ChainBlock/ChainBlockItem.vue'
import { ipcRenderer } from 'electron';
export default {
	name: "chainblockitem",
	data:function(){
		return{
			listUser:[],
			userInfo:undefined,
			listFollowing:[],
			listFollower:[],
			hashBlock:undefined,
		}
	},
	props:{
	},
	methods:{

	},
	created:function(){
		ipcRenderer.on('ChainBlock', (event, userInfo, user, listFollowing, listFollower, hashBlock)=>{
			this.userInfo=userInfo;
			this.listUser.push(user);
			this.listFollowing=listFollowing;
			this.listFollower=listFollower;
			this.hashBlock=hashBlock;
		});
		ipcRenderer.on('ShowUser', (event, user)=>{
			this.listUser.push(user);
		});
		this.EventBus.$on('UpdateHashBlock', (hashBlock)=>{
			hashBlock.forEach((user)=>{
				if(!this.hashUser.has(user)){
					this.hashBlock.add(user);
				}
			});
		})
	},
  mounted: function() {//EventBus등록용 함수들

	},
  components:{
		ChainBlockItem,
  },
};
</script>
<style lang="scss" scoped>

</style>