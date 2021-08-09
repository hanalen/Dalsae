<template>
  <div class="chat-box" v-if="user!=undefined">
		<div class="name-area" @click="ClickBack">
			<span>＜ @{{user.screen_name}} {{user.name}}</span>
		</div>
		<ChatItem v-for="(item, index) in listDM" :key="index" :dm="item"/>
		<div class="input-area">
			 <textarea
        ref="inputTweet"
        v-model="tweetTextBinding"
        spellcheck="false"
        class="text"
      />
		</div>
  </div>
</template>

<script>
import ChatItem from './ChatItem.vue'
export default {
	name: "chatbox",
	components:{
		ChatItem,
	},
  props: {
    user:undefined,
    listDM:undefined,
  },
  created:function() {
		
  },
  data() {
    return {
    };
	},
	computed:{
	},
  methods: {
		SetData(user, listDM){
			this.user=user;
			// this.listDM=
		},
		ClickBack(e){
			this.EventBus.$emit('CloseChatBox');
		},
	},
};
</script>

<style lang="scss">
.chat-box{
	width: calc(100vh-350px);
	// background-color: gray;
	.name-area{
		padding: 10px;
		cursor: pointer;
		border-bottom: 1px solid black;
		margin-bottom: 10px;
	}
	.input-area{
 		position:fixed;
    padding: 4px;
    left: 0px;
    bottom: 0px;
    width: 100%;
		.text {
			font-family: "맑은 고딕";
			box-sizing: border-box;
			max-height: 150px;
			resize: none;
			width: 100%;
			outline: none;
		}
	}
}
</style>
