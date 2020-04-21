<template>
  <div class="dm-panel">
		<div class="title">
			<span>
				쪽지
			</span>
		</div>
		<UserItem v-for="(user, index) in listUser" :key="index" :user="user" :dm="GetLastDM(user)"/>
		<ChatBox v-if="isShowChat" :user="selectAccount.userData" :listDM="showListDM"/>
  </div>
</template>

<script>
import {EventBus} from '../../main.js';
import axios from 'axios'
import ChatBox from './ChatBox.vue'
import UserItem from './UserItem.vue'

export default {
	name: "dmpanel",
	components:{
		ChatBox,
		UserItem,
	},
  props: {
  },
  created:function() {
		this.EventBus.$on('DMUserClick', (uesr)=>{
			this.EventBus.$emit('ReqUserData', user.id_str)
		})
		this.EventBus.$on('ResUserData', (user)=>{
			if(this.listUser.find(x=>x.id_str==user.id_str)==undefined)//중복 회피
				this.listUser.push(user);
		});
		this.EventBus.$on('ErrResUser',(err)=>{
			console.log(err)
		})
		this.EventBus.$emit('ReqDMList')
		this.EventBus.$on('ResDMList', (listDM)=>{
			console.log(listDM)
			this.ResDMList(listDM)
		});
  },
  data() {
    return {
			isShowChat:false,
			listUser:[],
			dicDM:[],//dictionary<id(key), List<DM>> 형태
			showUser:undefined,
			showListDM:[]
    };
	},
	computed:{
		selectAccount(){
			return this.$store.state.Account.selectAccount;
    }
	},
  methods: {
		GetLastDM(user){
			var list = this.dicDM[user.id_str];
			return list[list.length-1];
		},
		ResDMList(listDM){
			if(listDM.events){//dm 있는지 체크
				if(listDM.events.length==0) return;
			}

			listDM.events.forEach((dm)=>{
				var id='';//대화 상대 id
				if(dm.message_create.sender_id==this.selectAccount.user_id){
					dm.isMe=true;
					id=dm.message_create.target.recipient_id;
				}
				else{
					dm.isMe=false;
					id=dm.message_create.sender_id;
				}
				if(id in this.dicDM == false){//새 유저 등록일 경우 dicDM에 키, list 추가 후 추가
					this.dicDM[id]=[];
					this.dicDM[id].push(dm);
				}
				else{
					if(this.dicDM[id].find(x=>x.id==dm.id)==undefined){//중복 체크
						this.dicDM[id].push(dm);
					}
				}
			});
			this.AddUserData();
		},
		AddUserData(){
			var keys=Object.keys(this.dicDM);
			console.log('dic dm keys')
			console.log(keys)
			var start = new Date();
			keys.forEach((id_str)=>{
				var user=undefined;
				for(var i=0;i<this.$store.state.following.length;i++){
					if(this.$store.state.following[i].id_str==id_str){
						user=this.$store.state.following[i];
						break;
					}
				}
				if(user == undefined){
					for(var i=0;i<this.$store.state.follower.length;i++){
						if(this.$store.state.follower[i].id_str==id_str){
							user=this.$store.state.follower[i];
							break;
						}
					}
				}
				if(user){
					if(this.listUser.find(x=>x.id_str==user.id_str)==undefined)//중복 회피
						this.listUser.push(user);
				}
				else{
					console.log('get user data!!!')
					this.EventBus.$emit('GetUserData', id_str);
				}
			})
			var end=new Date();
			console.log('---start, end----')
			console.log(start)
			console.log(end)
		},
	},
};
</script>

<style lang="scss" scoped>
.dm-panel{
	.title{
		font-size: 20px;
		height: 30px;
		width: 100%;
		border: 1px solid black;
	}
}

</style>
