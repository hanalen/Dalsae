<template>
  <div class="chain-block-item">
		<ChainBlockItem v-for="(user, index) in listUser" :key="index"/>
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
		}
	},
	props:{
	},
	methods:{

	},
	created:function(){
		ipcRenderer.on('ChainBlock', (event, userInfo, user, listFollowing, listFollower, hashBlock)=>{

		});
		ipcRenderer.on('ShowUser', (event, user)=>{
			
		});
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