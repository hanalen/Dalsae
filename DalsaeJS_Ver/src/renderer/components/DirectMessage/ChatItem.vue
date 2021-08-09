<template>
	<div class="chat-area">
		<div class="chat-item" v-if="dm!=undefined" :class="{'my-chat': dm.isMe, 'other-chat':!dm.isMe}">
			<img class="propic" :src="user.profile_image_url" v-if="!dm.isMe"/>
			<span class="chat" :class="{'my-chat': dm.isMe, 'other-chat':!dm.isMe}">{{dm.message_create.message_data.text}}</span>
		</div>
		<div class="time">
			<span :class="{'my-time': dm.isMe, 'other-time':!dm.isMe}">{{dm.created_timestamp}}</span>
		</div>
	</div>
</template>

<script>
export default {
  name: "chatbox",
  props: {
		dm:undefined,
		user:undefined,
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
		
	},
};
</script>

<style lang="scss">
.my-time{
	margin-right: 20px;
	display: flex;
	justify-content: flex-end;
}
.other-time{
	margin-left: 68px;
	display: flex;
	justify-content: flex-start;
}
.chat-item{
	min-height: 48px;
	margin-bottom: 10px;
	.chat{
		max-width: 70%;
		margin-left: 10px;
		padding: 10px;
		border-radius: 10px;
	}
	.chat.my-chat{
		background-color: #e3f4ff;
	}
	.chat.other-chat{
		background-color: rgb(212, 212, 212);
	}
	.propic{
		border-radius: 8px;
	}
}
.my-chat{
	display: flex;
	justify-content: flex-end;
	margin-right: 10px;
	// text-align: right;
}
.other-chat{
	display: flex;
	justify-content: flex-start;
	margin-left: 10px;
	// text-align: left;
}
</style>
