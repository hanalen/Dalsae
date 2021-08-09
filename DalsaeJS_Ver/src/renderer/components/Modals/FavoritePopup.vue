<template>
  <div class="favorite-popup">
		<div class="title" :class="{'info':isStarted}">
			<div v-if="isStarted==false">
				<span>자신의 관심글을 가져와 이미지 트윗만 표시 하며 저장 합니다.</span><span>관심글의 관심글 해제, 및 추가, 사용자 팔로잉, 언팔로잉이 가능합니다.</span><span>이 창은 최소 높이 900px에 맞춰져 있습니다.</span><br/>
				<span>메모리 사용량이 높을 수 있으니 주의 바랍니다.</span>
				<button type="button" @click="Start">시작하기</button>
			</div>
			<div v-if="isStarted">
				<span>상태: {{info}} | </span>
				<span>관심글 수: {{this.listTweet.length}} / {{userData.favourites_count}} | 이미지 관심글 수: {{listMediaTweet.length}}</span><br/>
				<span>1~4: 이미지 순서 선택 / ctrl+s: 현재 이미지 저장 / ctrl+a: 전체 이미지 저장 / F: 관심글 저장, 삭제 / Q: 팔로잉, 언팔로잉 / ↑,↓: 트윗 선택</span><br/>
				<button type="button" @click="Start">더 불러오기</button>
			</div>
		</div>
		<div class="body" v-if="listMediaTweet.length>0">
			<div class="favorite-tweet-area">
				<div class="user-area">
					<UserItem v-if="tweet!=undefined" :user="tweet.orgUser"/>
				</div>
				<div class="preview-area" v-if="tweet!=undefined">
					<div class="image-content">
					<!-- <div class="arrow" v-if="tweet.orgTweet.extended_entities.media.length > 1">
						<div class="left-button">
							<i class="fas fa-chevron-left fa-2x" @click="Prev"></i>
						</div>
						<div class="right-button">
							<i class="fas fa-chevron-right fa-2x" @click="Next"></i>
						</div>
					</div> -->
					<div ref="imgDiv" v-show="i==index" v-for="(image,i) in tweet.orgTweet.extended_entities.media" :key="i" class="img-div">
						<img ref="img" :src="ImgPath(image.media_url_https)" class="img-content">
					</div>
				</div>
					<div class="bottom">
						<div v-for="(image,i) in tweet.orgTweet.extended_entities.media" @click="index=i"
							:key="i" class="img-preview">
								<img :src="image.media_url_https" class="bottom-preview"/>
						</div>
					</div>
				</div>
			</div>
			<div class="tweet-panel">
				<TweetList
					ref="favoritePanel"
					:panelName="'favorite'"
					:isShow="true"
					v-show="true"
					v-bind:options="this.$store.state.DalsaeOptions.uiOptions"
					v-bind:tweets="listMediaTweet"
				/>
			</div>
		</div>
		<div class="save-list">
			<div class="panel">
				<DownloadItem ref="downloadItem" v-for="(media, index) in listDownloadMedia" :media="media" :key="index" :path="path"/>
			</div>
		</div>
		<ProfileCall :selectAccount="tokenData"/>
		<UserCall :tokenData="tokenData"/>
		<TweetCall :tokenData="tokenData"/>
  </div>
</template>

<script>
const app = require('electron').remote.app
import ProfileCall from '../APICalls/ProfileCall.vue'
import TweetCall from '../APICalls/TweetCall.vue'
import UserCall from '../APICalls/UserCall.vue'
import UserItem from './Profile/UserItem.vue'
// import UserCall from '../APICalls/UserCall.js'
import TweetDataAgent from '../Agents/TweetDataAgent.js'
import TweetList from '../Tweet/Tweetlist.vue'
import ProgressBar from '../Common/ProgressBar.vue'
import DownloadItem from './Favorite/DownloadItem.vue'
export default {
  name: "favoritepopup",
  components: {
		TweetList,
		ProgressBar,
		ProfileCall,
    DownloadItem,
		UserItem,
		TweetCall,
		UserCall,
  },
  data: function() {
    return {
			path:'',
			info:'',
			isStarted:false,
			userData:undefined,
      tokenData:undefined,
			index:0,
			listMediaTweet:[],//미디어(사진)이 포함된 관심글 목록
			tweet:undefined,
			listTweet:[],//관심글 원본 트윗, 메모리 절약을 위해 id_str만 저장 한다. List<string>
      listDownloadMedia:[],//다운로드 큐 데이터
    };
  },
  computed:{

  },
  created: function() {
	  this.$nextTick(()=>{
      document.addEventListener('keydown', this.KeyDown);
    });

    var ipcRenderer = require('electron').ipcRenderer;
		ipcRenderer.on('UserData', (event, tokenData, configPath) => {
			this.tokenData=tokenData;
			this.userData=tokenData.userData;
			if(configPath){
				this.path=configPath.path;
			}
			else{
				this.path=app.getPath('userData');
			}
		});
		this.EventBus.$on('FocusedTweet', (index)=>{
			this.tweet=this.listMediaTweet[index];
			this.index=0;
		})

		this.EventBus.$on('ResFavoriteList', (listTweet)=>{
			this.ResFavoriteList(listTweet);
		})

		this.EventBus.$on('ErrFavoriteList', (err)=>{
			this.ErrFavoriteList(err);
		});

		this.EventBus.$on('ResFollow', (vals)=>{
			var user=vals['user']
			var follow=vals['follow']
			this.listMediaTweet.forEach((item)=>{
				if(item.orgUser.id_str==user.id_str){
					item.orgUser.following=follow;
				}
			})
		})

		this.EventBus.$on('DownloadComplete', (media)=>{
			media.isComplete=true;
		})
		this.EventBus.$on('ResFavorite', (tweet)=>{
			for(var i=0;i<this.listMediaTweet.length;i++){
				if(tweet.id_str==this.listMediaTweet[i].id_str){
					this.listMediaTweet[i].orgTweet.favorited=true;
					break;
				}
			}
		});
		this.EventBus.$on('ResUnFavorite', (tweet)=>{
			for(var i=0;i<this.listMediaTweet.length;i++){
				if(tweet.id_str==this.listMediaTweet[i].id_str){
					this.listMediaTweet[i].orgTweet.favorited=false;
					break;
				}
			}
		});
		this.CheckComplete();
  },
  methods: {
		KeyDown(e){
			if(e.key=='1' || e.key=='2' || e.key=='3'|| e.key=='4'){
				var index=Number(e.key);
				index--;
				if(index>=this.tweet.orgTweet.extended_entities.media.length) return;
				this.index=index;
			}
			else if(e.key.toUpperCase()=='S' && e.ctrlKey){
				this.Save(this.index)
      }
      else if(e.key.toUpperCase()=='A' && e.ctrlKey){
				this.SaveAll()
			}
			else if(e.key.toUpperCase()=='F' && !e.ctrlKey && !e.altKey && !e.shiftKey){
				this.EventBus.$emit('Favorite', this.tweet);
			}
			else if(e.key.toUpperCase()=='Q' && !e.ctrlKey && !e.altKey && !e.shiftKey){
				this.EventBus.$emit('ReqFollow', this.tweet.orgUser);
			}
		},
		CheckComplete(){
			if(this.$refs.downloadItem){
				this.$refs.downloadItem.forEach((item)=>{
					if(item.isComplete){
						var index = this.listDownloadMedia.findIndex(x=>x.id_str==item.media.id_str)
						if(index>-1)
							this.listDownloadMedia.splice(index,1);
					}
				})
			}
			setTimeout(() => {
				this.CheckComplete();
			}, 3000);
		},
		Save(index){
			var media =this.tweet.extended_entities.media[index];
			media.isComplete=false;
			this.listDownloadMedia.push(media)
		},
		SaveAll(){
      this.tweet.extended_entities.media.forEach((media)=>{
				media.isComplete=false;
        this.listDownloadMedia.push(media)
      })
		},
		ImgPath(org){
			return org;
		},
    Comma(num){
      var str = String(num);
      return str.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		},
		Start(e){
			this.isStarted=true;
			this.ReqFaoviteList();
		},
		ReqFaoviteList(){
			this.info='불러오는 중...'
			var maxid='0';
			if(this.listTweet.length>0){
				maxid = this.listTweet[this.listTweet.length-1];
			}
			this.EventBus.$emit('ReqFavorite', {'maxid': maxid, 'sinceid': '0'})
		},
		ResFavoriteList(listTweet){
			listTweet.forEach((tweet)=>{
				var newTweet = TweetDataAgent.TweetInit(tweet);
				newTweet.isMuted=false;
				if(newTweet.orgTweet.extended_entities)
					if(newTweet.orgTweet.extended_entities.media.length>0){
						if(newTweet.orgTweet.extended_entities.media[0].type=='photo')
							this.listMediaTweet.push(newTweet);
				}
				this.listTweet.push(newTweet.orgTweet.id_str);
			})
			this.info='대기 중'
			if(listTweet.length==0||this.userData.favourites_count==this.listTweet.length){//끝
				this.info='불러오기 완료'
				return;
			}
			else{
				// this.ReqFaoviteList();
			}
		},
		ErrFavoriteList(err){
			this.info='불러오기 제한! 자동으로 불러옵니다. 최대 대기 시간: 15분'
			setTimeout(() => {
				this.ReqFaoviteList();
			}, 60000);
		},
		Prev(e){

		},
		Next(e){

		}
  },
};
</script>

<style lang="scss" scoped>
.favorite-popup{
	// color: white;
	font-size: 14px;
	width: 100vw;
	height: 100vh;
	.title{//설명 및 상태 표시줄
		min-height: 100px;
		height: auto;
		overflow: none;
		.info{//시작 전 설명
			// height: 100vh !important;
		}
	}
	.body{
		width: 100vw;
		min-height: calc(100vh-300px);
		height: 700px;
		background-color: rgb(227, 255, 162);
		display: flex;
		.favorite-tweet-area{
			width: 50%;
			background-color: rgb(161, 161, 161);
			.user-area{
				max-height: 100px;
				min-height: 100px;
				overflow:hidden;
				background-color: rgb(255, 213, 197);
				.img-propic{

				}
			}
			.preview-area{
				width: 100%;
				height: 800px;
				.img-big{

				}	
				.bottom{
					height: 100px;
					width: 100%;
					display: flex;
					background-color: black;
					bottom: 10px;
					.img-preview{
						display: inline-block;
						flex-direction: column;
						width: 25%;
						// height: 25%;
						width: 100px;
						height: 100px;
						max-height: 100px;
						max-width: 25%;
						.bottom-preview{
							width: 100px;
							height: 100px;
							object-fit: cover;
							border-radius: 12px;
						}
						.bottom-preview:hover{
							cursor: pointer;
						}
						progress{
							width: 100px;
						}
					}
				}
			}
		}
		.tweet-panel{
			width: 50%;
			background-color: wheat;
		}
	}
	.save-list{
		width: 100%;
		height: 150px;
		background-color: black;
    .panel{
      overflow-x: none;
			overflow-y: none;
      display: flex;
      flex-direction: row-reverse;
			align-items: flex-start;
			 justify-content: flex-end;
    }
	}
}
.arrow{
	position: relative;
}
.right-button{
	position:absolute;
	right:20px;
	top:50%;
	color:white;
}
.left-button{
	position:absolute;
	left:20px;
	top:50%;
	color:white;
}
.image-content{
	// height: 100%;
	border-radius: 10px;
	overflow: hidden;
	margin:auto;
	.img-div{
		height: 500px;
		display:flex;
		justify-content: center;
		align-items: center;
		.img-content{
			display: block;
			object-fit: scale-down;
			margin: auto;
			max-width: 100%;
			max-height: 100%;
			height: auto;
			cursor: pointer;
			// vertical-align: middle;
			.zoom{
				object-fit: cover;
				max-width: none !important;
				max-height: none !important;
			}
		}
	}
}
</style>
