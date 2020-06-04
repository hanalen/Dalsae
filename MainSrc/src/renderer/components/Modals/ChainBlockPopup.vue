<template>
	<div class="chain-block-popup">
		<div class="user-search-area">
			<span>아이디를 입력 하여 검색 합니다.</span>
			<input type="text" v-model="strSearch" @keydown.enter="KeyDownEnter"/>
			<input type="button" @click="ClickSearch" value="검색"/>
		</div>
		<div class="chain-block-item">
			<ChainBlockItem v-for="(user, index) in listUser" :key="index" :user="user" :userInfo="userInfo"
			:listFollowing="listFollowing" :listFollower="listFollower" :hashUser="hashBlock"/>
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
			strSearch:'',
			listUser:[],
			userInfo:undefined,
			listFollowing:[],
			listFollower:[],
			hashBlock:new Set(),
		}
	},
	props:{
	},
	methods:{
		KeyDownEnter(){
			this.Search();
		},
		ClickSearch(){
			this.Search();
		},
		Search(){
			ipcRenderer.send('ShowProfile', this.strSearch, this.userInfo, this.listFollower);
		}
	},
	created:function(){
		ipcRenderer.on('ChainBlock', (event, userInfo, user, listFollowing, listFollower, hashBlock)=>{
			this.userInfo=userInfo;
			this.listUser.push(user);
			this.listFollowing=listFollowing;
			this.listFollower=listFollower;
			if(hashBlock)
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