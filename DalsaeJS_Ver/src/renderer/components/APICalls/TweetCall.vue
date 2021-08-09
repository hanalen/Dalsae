<template>
  <div class="user-call">
  </div>
</template>

<script>
import {EventBus} from '../../main.js';
import ApiTweet from './TweetCall.js';
import OAuth from '../../OAuth.js'
import axios from 'axios'

export default {
  name: "usercall",
  props: {
		tokenData:undefined,
  },
  created() {
  },
  data() {
    return {
    };
  },
  computed:{
    selectAccount(){
			if(this.tokenData)
				return this.tokenData;
			else
      	return this.$store.state.Account.selectAccount;
    }
  },
  methods: {
    SendTweet(tweetText, media, replyId){
			ApiTweet.Tweet(tweetText, replyId, media, this.selectAccount.oauth_token, this.selectAccount.oauth_token_secret, this.ResTweet, this.ErrTweet);
    },
    Retweet(tweetId){
      ApiTweet.Retweet(tweetId, this.selectAccount.oauth_token, this.selectAccount.oauth_token_secret, this.ResRetweet, this.ErrRetweet);
		},
		UnRetweet(tweetId){
			ApiTweet.UnRetweet(tweetId, this.selectAccount.oauth_token, this.selectAccount.oauth_token_secret, this.ResUnRetweet, this.ErrRetweet);
		},
		RetryRetweet(tweetId){
			// ApiTweet.Retweet(tweetId, this.selectAccount.oauth_token, this.selectAccount.oauth_token_secret, this.ResRetweet);
		},
		Favorite(tweetId){
			ApiTweet.Favorite(tweetId, this.selectAccount.oauth_token, this.selectAccount.oauth_token_secret, this.ResFavorite, this.ErrFavorite);
		},
		UnFavorite(tweetId){
			ApiTweet.UnFavorite(tweetId, this.selectAccount.oauth_token, this.selectAccount.oauth_token_secret, this.ResUnFavorite, this.ErrFavorite);
		},
		RetryFavorite(tweetId){
			// ApiTweet.Retweet(tweetId, this.selectAccount.oauth_token, this.selectAccount.oauth_token_secret, this.ResFavoriet);
		},
		DeleteTweet(tweetId){
			ApiTweet.DeleteTweet(tweetId, this.selectAccount.oauth_token, this.selectAccount.oauth_token_secret, this.ResDelete, this.ErrDelete);
		},
    ResTweet(tweet){
			// this.$store.dispatch('SendTweet', tweet);
			// console.log('send Tweet ok')
      console.log(tweet);
    },
    ResRetweet(tweet){
			this.$store.dispatch('Retweet', tweet);
			// console.log('retweet ok')
			// console.log(tweet);
		},
		ReqQTTweet(tweet){
			ApiTweet.QTTweet(tweet, this.selectAccount.oauth_token, this.selectAccount.oauth_token_secret, this.ResQT, this.ErrQT);
		},
		ResQT(qtTweet, tweet){
			this.$store.dispatch('AddQtTweet', {'tweet': tweet, 'qtTweet': qtTweet});
		},
		ErrTweet(err){
			console.log('err tweet')
			this.EventBus.$emit('ApiError', err)
		},
		ErrQT(err){
			// console.log('qt laod error')
			this.EventBus.$emit('ApiError', err)

		},
		ResUnRetweet(tweet){
			this.$store.dispatch('UnRetweet', tweet);
		},
		ResFavorite(tweet){
			if(this.tokenData){
				this.EventBus.$emit('ResFavorite', tweet);
			}
			else{
				this.$store.dispatch('Favorite', tweet);
			}
		},
		ResUnFavorite(tweet){
			if(this.tokenData){
				this.EventBus.$emit('ResUnFavorite', tweet);
			}
			else{
				this.$store.dispatch('UnFavorite', tweet);
			}
		},
		ResDelete(tweet){
			this.$store.dispatch('Delete', tweet);
		},
    ErrRetweet(err, tweetID){
			this.EventBus.$emit('ApiError', err)
      console.log(err);
      this.RetryRetweet(tweetID);
    },
    ErrFavorite(err, tweetID){
			this.EventBus.$emit('ApiError', err)
      console.log(err);
      this.RetryFavorite(tweetID);
		},
		ConfirmRetweet(tweet){
			if(tweet.orgTweet.retweeted){
				this.UnRetweet(tweet.orgTweet.id_str);
			}
			else{
				this.Retweet(tweet.orgTweet.id_str);
			}
		},
		ConfirmSendTweet(vals){
			this.SendTweet(vals['text'], vals['media'], vals['replyId']);
		}
	},
	mounted: function() {//EventBus등록용 함수들
    this.EventBus.$on('SendTweet', (vals) => {
			if(this.$store.state.DalsaeOptions.uiOptions.isSendCheck){
				if(confirm('트윗을 전송 하시겠습니까?')==false) return;
			}
			this.ConfirmSendTweet(vals)
    });
    this.EventBus.$on('Retweet', (tweet) => {
			if(this.$store.state.DalsaeOptions.uiOptions.isSendRTCheck){
				if(confirm('리트윗 하시겠습니까?') == false) return;
			}
			this.ConfirmRetweet(tweet);
		});
		this.EventBus.$on('Favorite', (tweet) => {
			if(tweet.orgTweet.favorited){
        this.UnFavorite(tweet.orgTweet.id_str);
      }
      else{
				this.Favorite(tweet.orgTweet.id_str);
      }
		});
		this.EventBus.$on('LoadQTTweet',(tweet)=>{
			this.ReqQTTweet(tweet);
		});
		this.EventBus.$on('DeleteTweet', (tweet)=>{
			if(tweet.orgUser.id_str==this.selectAccount.userData.id_str){
				this.DeleteTweet(tweet.orgTweet.id_str);
			}
		});
		this.EventBus.$on('LoadDaehwa', (tweet)=>{
			if(!tweet.orgTweet.in_reply_to_status_id_str) return;//대화 없는건 스킵 
			this.$store.dispatch('DaehwaAutoAdd', tweet);//캐시데이터가 있는지부터 체크 

			if(this.$store.state.tweets.daehwa[0].orgTweet.in_reply_to_status_id_str){//캐시 정리가 끝난 후 대화가 있을 경우에 api 콜
				this.EventBus.$emit('LoadingTweetPanel', {'isLoading': true, 'panelName':'daehwa'})
				this.EventBus.$emit('ReqDaehwa', tweet);
			}
			else{
				this.EventBus.$emit('LoadingTweetPanel', {'isLoading': false, 'panelName':'daehwa'})//로딩 뱅글이 끄기위해 호출
				this.EventBus.$emit('FocusPanel', 'daehwa');//패널 변경
			}
		})
	},
};
</script>

<style lang="scss">

</style>
