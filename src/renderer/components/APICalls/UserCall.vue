<template>
  <div class="user-call">
  </div>
</template>

<script>
import {EventBus} from '../../main.js';
import ApiUser from './UserCall.js';
import OAuth from '../../OAuth.js'
import axios from 'axios'

export default {
  name: "usercall",
  props: {
  },
  created() {
  },
  data() {
    return {
      isLoadingHome:false,
      isLoadingMention:false,
      isLoadingFav:false,
      isLoadingDaehwa:false,
    };
  },
  computed:{
    selectAccount(){
      return this.$store.state.Account.selectAccount;
    }
  },
  methods: {
    StartDalsae(){
			this.ReqHome(undefined, undefined);
			this.ReqMention(undefined, undefined);
			this.ReqUserInfo();
      // this.ReqFollowingList();
      // this.ReqFollowerList();
    },
    ReqHome(maxId, sinceId){
      if(this.isLoadingHome){//이미 로딩 중이면 넘기기
        console.log('이미 홈 로딩 중');
        return;
      }
      this.EventBus.$emit('LoadingTweetPanel', {'isLoading': true, 'panelName':'home'})
      this.isLoadingHome=true;
      ApiUser.ReqHome(maxId, sinceId, this.selectAccount.oauth_token, this.selectAccount.oauth_token_secret, this.ResHome);
    },
    ReqMention(maxId, sinceId, publickey, secretkey, callback){
      if(this.isLoadingMention){//이미 로딩 중이면 넘기기
        console.log('이미 멘션 로딩 중');
        return;
      }
      this.EventBus.$emit('LoadingTweetPanel', {'isLoading': true, 'panelName':'mention'})
      this.isLoadingMention=true;
      ApiUser.ReqMention(maxId, undefined, this.selectAccount.oauth_token, this.selectAccount.oauth_token_secret, this.ResMention);
    },
    ReqDaehwa(tweet){
      if(this.isLoadingDaehwa){
        console.log('이미 대화 로딩중');
        return;
      }
      var tweetid=tweet.orgTweet.in_reply_to_status_id_str;
      if(tweetid==undefined||tweetid==0){
        return;
      }
      this.isLoadingDaehwa=true;
      ApiUser.ReqDaehwa(tweet.orgTweet.in_reply_to_status_id_str, this.selectAccount.oauth_token, this.selectAccount.oauth_token_secret, this.ResDaehwa, this.ErrResDaewha);
    },
    ReqUserInfo(){
      ApiUser.ReqUserInfo(this.ResUserInfo, this.selectAccount.oauth_token, this.selectAccount.oauth_token_secret);
    },
    ReqFollowingList(cursor){
      console.log('req following list')
      var userid=this.selectAccount.userData.id_str;
      if(cursor==undefined){
        cursor=-1;
      }
      ApiUser.FollowingList(userid, cursor, undefined, this.selectAccount.oauth_token, this.selectAccount.oauth_token_secret,
                             this.ResFollowing, this.ErrResFollowing);
    },
    ReqFollowerList(cursor){
      console.log('req follower list')
      var userid=this.selectAccount.userData.id_str;
      if(cursor==undefined){
        cursor=-1;
      }
      ApiUser.FollowerList(userid, cursor, undefined, this.selectAccount.oauth_token, this.selectAccount.oauth_token_secret,
                             this.ResFollower, this.ErrResFollower);
    },
	  ResUserInfo(userinfo){
      this.$store.dispatch('UpdateUser', userinfo);
      this.EventBus.$emit('ResUserInfo', userinfo);
    },
    ResHome(listTweet){
      this.isLoadingHome=false;
      this.$store.dispatch('AddHome', listTweet);
      this.EventBus.$emit('LoadingTweetPanel', {'isLoading': false, 'panelName': 'home'});
      console.log(listTweet);
    },
    ResMention(listTweet){
      this.isLoadingMention=false;
      this.$store.dispatch('AddMention', listTweet);
      this.EventBus.$emit('LoadingTweetPanel', {'isLoading': false, 'panelName': 'mention'});
    },
		ResDaehwa(tweet){
      this.isLoadingDaehwa=false;
      this.EventBus.$emit('LoadingTweetPanel', {'isLoading': false, 'panelName': 'daehwa'});
      this.$store.dispatch('Daehwa', tweet);
      this.EventBus.$emit('FocusPanel', 'daehwa');
		},
    ResFollowing(resUsers){
      if(resUsers.next_cursor!=0){//다 땡겨왔을 경우 0으로 옴
        this.ReqFollowingList(resUsers.next_cursor);
      }
      console.log(resUsers)
      this.$store.dispatch('FollowingList', resUsers.users);
    },
    ResFollower(resUsers){
      if(resUsers.next_cursor!=0){//다 땡겨왔을 경우 0으로 옴
        this.ReqFollowerList(resUsers.next_cursor);
      }
      console.log(resUsers)
      this.$store.dispatch('FollowerList', resUsers.users);
    },
    ErrResFollowing(err, cursor){
      console.log(err);
      setTimeout(() => this.ReqFollowingList(cursor), 60000);//리밋일 경우 1분 뒤 재요청
    },
    ErrResFollower(err, cursor){
      console.log(err);
      setTimeout(() => this.ReqFollowerList(cursor), 60000);//리밋일 경우 1분 뒤 재요청
    },
    ErrResDaewha(err){
      this.isLoadingDaehwa = false;
      console.log('err load daehwa');
      console.log(err);
    }
  },
  mounted: function() {//EventBus등록용 함수들
    this.EventBus.$on('StartDalsae', () => {
			this.StartDalsae();
    });
    this.EventBus.$on('ReqHome', () => {
      var maxid=undefined;
      try{
        var leng = this.$store.state.tweets.home.length-1;
        var maxid=this.$store.state.tweets.home[leng].id;
        console.log(this.$store.state.tweets.home[leng].full_text);
      }
      catch(e){
        console.log('req home error')
        console.log(e)
      }
      // console.log('req home max id: '+maxid);
			this.ReqHome(undefined, maxid);
    });
    this.EventBus.$on('ReqMention', () => {
			this.StartDalsae();
    });
    this.EventBus.$on('ReqFavorite', () => {
			this.StartDalsae();
    });
    this.EventBus.$on('Reqqqqq', () => {
			this.StartDalsae();
    });
    this.EventBus.$on('ReqDaehwa', (tweet)=>{
      this.ReqDaehwa(tweet);
    });
	},
};
</script>

<style lang="scss">

</style>
