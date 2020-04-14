<template>
  <div class="favorite-popup">
		<div class="title" :class="{'info':isStarted}">
			<div v-if="isStarted==false">
				<span>설명설명설명</span>
				<button type="button" @click="Start">시작하기</button>
			</div>
			<div v-if="isStarted">
				<span>상태 표시 바~</span>
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
								<ProgressBar ref="progress" :percent="listProgressPercent[i]"/>
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
				<DownloadItem v-for="(media, index) in listDownloadMedia" :media="media" :key="index"/>
			</div>
		</div>
  </div>
</template>

<script>
const app = require('electron').remote.app
import UserItem from './Profile/UserItem.vue'
import UserCall from '../APICalls/UserCall.js'
import TweetDataAgent from '../Agents/TweetDataAgent.js'
import TweetList from '../Tweet/Tweetlist.vue'
import ProgressBar from '../Common/ProgressBar.vue'
import DownloadItem from './Favorite/DownloadItem.vue'
export default {
  name: "favoritepopup",
  components: {
		TweetList,
    ProgressBar,
    DownloadItem,
		UserItem,
  },
  data: function() {
    return {
			path:'',
			isStarted:false,
      tokenData:undefined,
			index:0,
			listFollowing:[],
			listMediaTweet:[],
			listProgressPercent:Array(0,0,0,0),
			tweet:undefined,
			listTweet:[],
      listSaveMedia:[],
      listDownloadMedia:[],
    };
  },
  computed:{

  },
  created: function() {
		const { deflate, unzip } = require('zlib');
		const buffer = Buffer.from(this.zip, 'base64');
		unzip(buffer, (err, buffer) => {
			if (err) {
			}
			var json = buffer.toString();
			this.listTweet=JSON.parse(json);
			this.listTweet.forEach((tweet)=>{
				var newTweet = TweetDataAgent.TweetInit(tweet);
				newTweet.isMuted=false;
				this.listMediaTweet.push(newTweet);
			})
			this.tweet=this.listMediaTweet[3];
		});
	  this.$nextTick(()=>{
			console.log('next tick')
      document.addEventListener('keydown', this.KeyDown);
    });

    var ipcRenderer = require('electron').ipcRenderer;
		ipcRenderer.on('UserData', (event, tokenData, listFollowing) => {
      this.listFollowing=listFollowing;
      this.tokenData=tokenData;
		});
		this.EventBus.$on('FocusedTweet', (index)=>{
			this.tweet=this.listMediaTweet[index];
			this.index=0;
		})
		
  },
  methods: {
		KeyDown(e){
			if(e.key=='1' || e.key=='2' || e.key=='3'|| e.key=='4'){
				var index=Number(e.key);
				if(index>=this.tweet.orgTweet.extended_entities.media.length) return;
			}
			else if(e.key.toUpperCase()=='S' && e.ctrlKey){
				this.Save(this.index)
      }
      else if(e.key.toUpperCase()=='A' && e.ctrlKey){
				this.SaveAll()
			}
		},
		Save(index){
			this.listDownloadMedia.push(this.tweet.extended_entities.media[index])
      // this.listDownloadMedia.splice(0,0,this.tweet.extended_entities.media[index])
      // console.log('save index: '+index);
		},
		SaveAll(){
      console.log('save all')
      this.tweet.extended_entities.media.forEach((media)=>{
        this.listDownloadMedia.push(media)
        // this.listDownloadMedia.splice(0,0,media)
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
	background-color: black;
	.title{//설명 및 상태 표시줄
		height: 100px;
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
		background-color: yellowgreen;
    .panel{
      overflow-x: scroll;
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
