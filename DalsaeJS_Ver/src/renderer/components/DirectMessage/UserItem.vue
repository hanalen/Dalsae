<template>
  <div class="user-item" v-if="user!=undefined" @click="Click">
		<div class="left">
			<img class="propic" :src="user.profile_image_url"/>
		</div>
		<div class="right">
			<div class="top">
				<div class="profile-name">
					<span class="screen-name">@{{user.screen_name}} </span>
					<span class="name">{{user.name}}</span><br/>
				</div>
			</div>
			<div class="bottom">
				<span class="dm-text">{{DMText}}</span>
			</div>
		</div>
  </div>
</template>

<script>
export default {
  name: "useritem",
  components: {
  },
  props:{
    dm:undefined,
    user:undefined,
  },
  data: function() {
    return {
    };
	},
  computed:{
		DMText(){
			var str='';
			if(this.dm.isMe){
				str='나: ';
			}
			str+=this.dm.message_create.message_data.text;
			return str;
		}
  },
  created: function() {
		
  },
  methods: {
		Click(e){
			this.EventBus.$emit('DMUserClick', this.user);
		},
  },
};
</script>

<style lang="scss" scoped>
.user-item{
	display: flex;
	padding: 4px;
	width: 100%;
	cursor: pointer;
	font-size: 14px;
	border-bottom: 1px solid black;
	.left{
		.propic{
			border-radius: 6px;
		}
	}
	.right{
		margin-left: 4px;
		width: 521px;
		.top{
			display: flex;
			justify-content: space-between;
			.profile-name{
				.name{
					font-weight: bold;
				}
				.screen-name{
					// color: #66757f;
				}
				.follow-by{
					color: #66757f;
				}
			}
			.buttons{
				display: flex;
				.btn-follow{
					height: 30px;
					margin-top: 4px;
					width: 80px;
				}
				i{
					font-size:30px;
					margin-top: -5px;
					padding:8px;
					transition: all .5s cubic-bezier(.25,.8,.25,1);
					color:#6ac4fc;
					margin-right:10px;
					&:hover{
						cursor: pointer;
						border-radius: 30px;
						background-color: hsla(0, 0%, 91%,.4);
						transition: all .5s cubic-bezier(.25,.8,.25,1);
					}
				}
			}
		}
		.bottom{
			.bio{

			}
		}
	}
}
</style>
