<template>
  <div class="dm-panel">
  </div>
</template>

<script>
import {EventBus} from '../../main.js';
import axios from 'axios'

export default {
  name: "dmpanel",
  props: {
  },
  created:function() {
		this.EventBus.$on('ResDMList', (listDM)=>{
			this.ResDMList(listDM)
		})
  },
  data() {
    return {
			dicDM:[],//dictionary<id(key), List<DM>> 형태
    };
	},
	computed:{
		selectAccount(){
			return this.$store.state.Account.selectAccount;
    }
	},
  methods: {
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
		}
	},
};
</script>

<style lang="scss">

</style>
