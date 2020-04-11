<template>
  <div class="user-item" v-if="user!=undefined">
		<div class="left">
			<img class="propic" :src="propic" @mousedown="Click"/>
		</div>
		<div class="right">
			<div class="top">
				<div class="profile-name">
					<span class="name">{{user.name}}</span><br/>
					<span class="screen-name">@{{user.screen_name}}</span>
          <span class="follow-by" v-if="user.followed_by">님은 나를 팔로우 하고 있습니다.</span>
				</div>
				<div class="buttons">
          <i @click="ClickContext" class="fas fa-ellipsis-h fa-2x"></i>
					<button class="btn-follow" type="button" @click="ClickFollow">{{FollowText}}</button>
					<button class="btn-follow" type="button" @click="Block" v-if="user.blocking">차단 됨</button>
					<button class="btn-follow" type="button" @click="Block" v-if="user.blocked_by">차단 되어있음</button>
				</div>
			</div>
			<div class="bottom">
				<span class="bio">{{user.description}}</span>
			</div>
		</div>
  </div>
</template>

<script>
export default {
  name: "useritem",
  components: {
  },
  data: function() {
    return {

    };
	},
	props:{
		user:undefined,
	},
  computed:{
    FollowText(){
      return this.user.following? '언팔로우' : '팔로잉'
		},
    propic() {
      return this.user.profile_image_url_https;//.replace("_normal", "_bigger");
    },
  },
  created: function() {
		
  },
  methods: {
		Click(e){
			this.EventBus.$emit('UserClick', this.user);
		},
		ClickContext(e){
			this.EventBus.$emit('ClickContext', {'e':e, 'user': this.user});
		}
  },
};
</script>

<style lang="scss" scoped>
.user-item{
	display: flex;
	padding: 4px;
	width: 100%;
	font-size: 14px;
	border-bottom: 1px solid black;
	.left{
		.propic{
			border-radius: 6px;
			cursor: pointer;
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
					width: 70px;
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
