<template>
  <div class="chain-block-item">
		<span>현재 상태: {{status}}</span><br/>
		<span v-if="!isFollowingList">{{user.screen_name}}의 팔로워를 전부 차단 합니다.</span>
		<span v-if="isFollowingList">{{user.screen_name}}의 팔로잉을 전부 차단 합니다.</span>
		<div class="progress-area" v-if="status != '대기 중'">
			<span>진행 상황: </span>
			<span>{{blockCount}} / {{maxBlockCount}}</span><br/>
			<ProgressBar ref="progress" />
			<span>이미 차단 된 수: {{alreadyHashUser.size}}</span>
			<div class="skip-area" v-if="listSkip.length > 0">
				<span>차단 제외 목록</span><br/>
				<select size='6'>
					<option v-for="(item, index) in listSkip" :key="index">{{item}}</option>
				</select>
			</div>
		</div>
		<div class="select-area" v-if="status=='대기 중'">
			<input type="radio" id="radioFollowing" v-model="isFollowingList" :value="true">
			<label for="radioFollowing">팔로잉을 차단</label>
			<input type="radio" id="radioFollower" v-model="isFollowingList" :value="false"/>
			<label for="radioFollower">팔로워를 차단</label>
			<b-button class="btn" variant="primary" @click="Start">시작하기</b-button>
		</div>
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
			isFollowingList:false,
			maxBlockCount:0,
		}
	},
	props:{
		alreadyHashUser:undefined,
		userInfo:undefined,
		user:undefined,
		listFollowing:undefined,
		listFollower:undefined,
	},
	methods:{
		Start(){
			this.ReqList(-1);
			this.maxBlockCount = this.isFollowingList==true ? this.user.friends_count : this.user.followers_count;
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
				else{
					console.log(item)
				}
			})
			if(res.next_cursor==0){
				this.CheckFriends(res.next_cursor);
			}
			else{
				this.ReqList(res.next_cursor);
			}
		},
		ResErr(err, cursor){
			console.log('err req list')
			const error=err.response.data.errors
			console.log(err.response);
			if(error){
				if(error.length>0){
					if(error[0].code==88){
						this.status='팔로워 불러오기 리밋! 최대 15분 대기\r\n잠시 뒤 현재까지 불러온 좌표를 차단 합니다.';
						setTimeout(() => {//10초 뒤 현재까지 불러온 목록은 일단 차단 진행 
							this.CheckFriends(cursor);
						}, 10000);
					}
					else{
						this.status='뭔가 오류 개발자에게 문의 바람 code:'+error[0].code+ ' / message: '+error[0].message;
					}
				}
				else{
					this.status='알 수 없는 오류 개발자에게 문의 해주세요.'+JSON.stringify(error);
				}
			}
			else{
					this.status='알 수 없는 오류 개발자에게 문의 해주세요.'+JSON.stringify(error);
			}
		},
		CheckFriends(cursor){
			this.listFollowing.forEach((user)=>{
				if(this.hashUser.has(user.id_str)){
					if(this.listSkip.indexOf(user.screen_name+'/'+user.name)>-1)//중복 체크
						this.listSkip.push(user.screen_name+'/'+user.name);
					this.hashUser.delete(user.id_str)
				}
			});
			this.listFollower.forEach((user)=>{
				if(this.hashUser.has(user.id_str)){
					if(this.listSkip.indexOf(user.screen_name+'/'+user.name)>-1)//중복 체크
						this.listSkip.push(user.screen_name+'/'+user.name);
					this.hashUser.delete(user.id_str)
				}
			})
			this.ChainBlock(cursor);
		},
		ChainBlock(cursor=-1){
			console.log('ChainBlock cursor: '+cursor);
			this.status='차단 중...'
			console.log('before start')
			this.hashUser.forEach((id_str)=>{
				ProfileCall.ReqBlock(id_str, this.userInfo.oauth_token, this.userInfo.oauth_token_secret, this.ResBlock, this.ErrBlock)
				console.log('await....')
			})
			if(cursor > 0){
				console.log(cursor)
				this.status='현재까지 불러 온 목록 차단 완료.\r\n잠시 뒤 좌표를 더 불러옵니다.'
				setTimeout(() => this.ReqList(cursor), 60000);//리밋 후 진행 한 경우라 1분 뒤 ids 재요청
			}else{
				// this.status='차단 완료'
			}
			console.log('before clear')//request가 async라 생기는 문제...
			this.hashUser.clear();
			this.EventBus.$emit('UpdateHashBlock', this.hashUser);
		},
		ResBlock(){
			this.blockCount++;
			this.$refs.progress.SetValue((this.blockCount / (this.maxBlockCount - this.listSkip.length - this.alreadyHashUser.size)) * 100);
		},
		ErrBlock(err){
			this.blockCount++;
			// console.log('err block!')
			// console.log(err)
			// const error = err.response;
			// console.log(error)
		}
	},
	created:function(){
	},
  mounted: function() {//EventBus등록용 함수들

	},
  components:{
		ProgressBar,
  },
};
</script>
<style lang="scss" scoped>
.btn {
	font-size: 14px !important;
	height: 30px;
}
.btn{
	margin: 0px 4px;
	width: 120px;
	height: 22px;
	font-size: 14px;
	padding: 0;      
	font-size: 14px !important;
	padding: 0 6px !important;
	height: 30px;
}
</style>