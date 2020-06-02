<template>
  <div class="chain-block-item">
		<span>{{user.screen_name}}의 {{strFollow}}를 전부 차단 합니다.</span>
		<span>{{status}}</span><br/>
		<span>{{blockCount}} / {{maxBlockCount}}</span><br/>
		<ProgressBar ref="progress" />
		<select size='6'>
			<option v-for="(item, index) in listSkip" :key="index">{{item}}</option>
		</select>
		<input type="button" value="시작하기" @click="Start"/>
  </div>
</template>

<script>
import ProfileCall from '../../APICalls/ProfileCall.js'
import ProgressBar from '../../Common/ProgressBar.vue'
export default {
	name: "chainblockitem",
	data:function(){
		return{
			hashUser:new Set(),
			status:'대기 중',
			listSkip:[],
			blockCount:0,
		}
	},
	props:{
		isFollowingList:{
			type:Boolean,
			default:true,
		},
		userInfo:undefined,
		user:undefined,
		listFollowing:undefined,
		listFollower:undefined,
	},
  computed:{
		maxBlockCount(){
			return this.hashUser.size - this.listSkip.length;
		},
		strFollow(){
			return this.isFollowingList ? '팔로잉' : '팔로워';
		}
	},
	methods:{
		Start(){
			this.ReqList(-1);
		},
		ReqList(cursor){
			this.status='좌표를 불러오는 중...'
			if(this.isFollowingList)
				ProfileCall.ReqFollowingIds(cursor, this.user.screen_name, this.userInfo.oauth_token, this.userInfo.oauth_token_secret,
						this.ResList, this.ResErr);
			else
				ProfileCall.ReqFollowerIds(cursor, this.user.screen_name, this.userInfo.oauth_token, this.userInfo.oauth_token_secret,
						this.ResList, this.ResErr);
		},
		ResList(res){
      res.ids.forEach((item)=>{
        if(!this.hashUser.has(item)){
          this.hashUser.add(item);
        }
			})
			if(res.next_cursor==0){
				this.CheckFriends();
			}
			else{
				this.ReqList(res.next_cursor);
			}
		},
		ResErr(err){
			console.log('err req list')
			console.log(err)
			this.status='좌표 불러오기 실패';
		},
		CheckFriends(){
			this.listFollowing.forEach((user)=>{
				if(this.hashUser.has(user.id)){
					this.listSkip.push(user);
					this.hashUser.delete(user.id)
				}
			});
			this.listFollower.forEach((user)=>{
				if(this.hashUser.has(user.id)){
					this.listSkip.push(user);
					this.hashUser.delete(user.id)
				}
			})
			this.ChainBlock();
		},
		ChainBlock(){
			this.status='차단 중...'
			return;
			this.hashUser.forEach((id)=>{
				ProfileCall.ReqBlock(id, this.userInfo.oauth_token, this.userInfo.oauth_token_secret, this.ResBlock, this.ErrBlock)
			})
			this.EventBus.$emit('UpdateHashBlock', this.hashUser);
		},
		ResBlock(){
			this.blockCount++;
			this.$refs.progress.SetValue((this.blockCount / this.hashUser.size) * 100);
		},
		ErrBlock(err){
			console.log('err block!')
			console.log(err)
		}
	},
	created:function(){
		if(this.isFollowingList){
			this.status=this.user.screen_name+'의 팔로잉 전체를 차단 합니다. 대기 중';
		}
		else{
			this.status=this.user.screen_name+'의 팔로워 전체를 차단 합니다. 대기 중';
		}
	},
  mounted: function() {//EventBus등록용 함수들

	},
  components:{
		ProgressBar,
  },
};
</script>
<style lang="scss" scoped>

</style>