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
    tokenData:undefined,
  },
  created() {
  },
  data() {
    return {
      isAddNewAccount:false,
      isLoadingHome:false,
      isLoadingMention:false,
      isLoadingFav:false,
      isLoadingDaehwa:false,
      isLoadingUser:false,
    };
  },
  computed:{
    selectAccount(){
      if(this.tokenData!=undefined){//해당 컴포넌트를 다른 윈도우에서 쓸 경우 props를 사용
        return this.tokenData;
      }
      else{
        return this.$store.state.Account.selectAccount;
      }
    }
  },
  methods: {
    StartDalsae(){
			this.ReqHome(undefined, undefined);
      this.ReqMention(undefined, undefined);
      this.ReqFavorite(undefined, undefined);
      this.ReqUserInfo();
      if(this.selectAccount.userData==undefined){//OAuth인증 진행 시 userdata없으므로 정보 수신 수 각종 req를 날린다
        this.isAddNewAccount=true;
      }
      else{
        this.ReqFollowingList();
        this.ReqFollowerList();
        this.ReqBlockIds(-1);
        this.EventBus.$emit('GetDMList');
      }
    },
    ReqHome(maxId, sinceId){
      if(this.isLoadingHome){//이미 로딩 중이면 넘기기
        console.log('이미 홈 로딩 중');
        return;
      }
      this.EventBus.$emit('LoadingTweetPanel', {'isLoading': true, 'panelName':'home'})
      this.isLoadingHome=true;
      ApiUser.ReqHome(maxId, sinceId, this.selectAccount.oauth_token, this.selectAccount.oauth_token_secret, this.ResHome, this.ErrHome);
    },
    ReqMention(maxId, sinceId, publickey, secretkey, callback){
      if(this.isLoadingMention){//이미 로딩 중이면 넘기기
        console.log('이미 멘션 로딩 중');
        return;
      }
      this.EventBus.$emit('LoadingTweetPanel', {'isLoading': true, 'panelName':'mention'})
      this.isLoadingMention=true;
      ApiUser.ReqMention(maxId, undefined, this.selectAccount.oauth_token, this.selectAccount.oauth_token_secret, this.ResMention, this.ErrMention);
    },
    ReqFavorite(maxId, sinceId){
      this.EventBus.$emit('LoadingTweetPanel', {'isLoading': true, 'panelName':'favorite'})
      this.isLoadingFav=true;
      ApiUser.ReqFavorite(maxId, undefined, this.selectAccount.oauth_token, this.selectAccount.oauth_token_secret, this.ResFavorite, this.ErrResFavorite, this.ErrFavorite);
    },
    ReqUserTweet(screenName, maxid, sinceId){
      this.EventBus.$emit('LoadingTweetPanel', {'isLoading': true, 'panelName':'user'})
      this.isLoadingUser=true;
      this.EventBus.$emit('FocusPanel', 'user');
      ApiUser.ReqUser(screenName, undefined, this.selectAccount.oauth_token, this.selectAccount.oauth_token_secret, this.ResUser, this.ErrUser);
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
      var userid=this.selectAccount.userData.id_str;
      if(cursor==undefined){
        cursor=-1;
      }
      ApiUser.FollowerList(userid, cursor, undefined, this.selectAccount.oauth_token, this.selectAccount.oauth_token_secret,
                             this.ResFollower, this.ErrResFollower);
    },
    ReqUserData(id_str){
      ApiUser.UserData(id_str, this.selectAccount.oauth_token, this.selectAccount.oauth_token_secret, this.ResUserData, this.ErrResUserData);
    },
    ReqBlockIds(cursor){
      if(process.env.NODE_ENV === 'development') return;//개발환경에서는 차단 목록 안 땡기자...
        ApiUser.BlockIds(cursor, this.selectAccount.oauth_token, this.selectAccount.oauth_token_secret, this.ResBlockIds, this.ErrBlockIds);
    },
	  ResUserInfo(userinfo){
      this.$store.dispatch('UpdateUser', userinfo);
      this.EventBus.$emit('ResUserInfo', userinfo);
      this.EventBus.$emit('SaveAccount');
      if(this.isAddNewAccount){
        this.isAddNewAccount=false;
        this.ReqFollowingList();
        this.ReqFollowerList();
        this.EventBus.$emit('ReqDMList')
      }
    },
    ResHome(listTweet){
      this.isLoadingHome=false;
      this.$store.dispatch('AddHome', listTweet);
      this.EventBus.$emit('LoadingTweetPanel', {'isLoading': false, 'panelName': 'home'});
    },
    ResMention(listTweet){
      this.isLoadingMention=false;
      this.$store.dispatch('AddMention', listTweet);
      this.EventBus.$emit('LoadingTweetPanel', {'isLoading': false, 'panelName': 'mention'});
    },
    ResFavorite(listTweet){
      this.isLoadingFav=false;
      if(this.tokenData==undefined){
        this.$store.dispatch('AddFavorite', listTweet);
      }
      else{
        this.EventBus.$emit('ResFavoriteList', listTweet);
      }
      this.EventBus.$emit('LoadingTweetPanel', {'isLoading': false, 'panelName': 'favorite'});
    },
		ResDaehwa(tweet){
      this.isLoadingDaehwa=false;
      this.EventBus.$emit('LoadingTweetPanel', {'isLoading': false, 'panelName': 'daehwa'});
      this.$store.dispatch('Daehwa', tweet);
      this.EventBus.$emit('FocusDaehwa');
    },
    ResUser(listTweet){
      this.isLoadingUser=false;
      this.EventBus.$emit('LoadingTweetPanel', {'isLoading': false, 'panelName': 'user'});
      this.$store.dispatch('AddUserTweet', listTweet);
    },
    ResFollowing(resUsers){
      this.$store.dispatch('FollowingList', resUsers.users);
      if(resUsers.next_cursor!=0){//다 땡겨왔을 경우 0으로 옴
        this.ReqFollowingList(resUsers.next_cursor);
      }
      // console.log(resUsers)
    },
    ResFollower(resUsers){
      this.$store.dispatch('FollowerList', resUsers.users);
      if(resUsers.next_cursor!=0){//다 땡겨왔을 경우 0으로 옴
        this.ReqFollowerList(resUsers.next_cursor);
      }
      // console.log(resUsers)
    },
    ResUserData(user){
      this.EventBus.$emit('ResUserData', user)
    },
    ResBlockIds(data){
      this.$store.dispatch('BlockIds', data.ids);
      if(data.next_cursor_str!='0'){
        this.ReqBlockIds(data.next_cursor_str);
      }
      console.log('block ids')
      console.log(data)
    },
    ErrHome(err){
      this.isLoadingHome=false;
      this.EventBus.$emit('LoadingTweetPanel', {'isLoading': false, 'panelName': 'home'});
    },
    ErrMention(err){
      this.isLoadingMention=false;
      this.EventBus.$emit('LoadingTweetPanel', {'isLoading': false, 'panelName': 'mention'});
    },
    ErrFavorite(err){
      this.isLoadingFav=false;
      this.EventBus.$emit('LoadingTweetPanel', {'isLoading': false, 'panelName': 'favorite'});
    },
    ErrUser(err){
      this.isLoadingUser=false;
      this.EventBus.$emit('LoadingTweetPanel', {'isLoading': false, 'panelName': 'user'});
    },
    ErrResFavorite(err){
      this.EventBus.$emit('LoadingTweetPanel', {'isLoading': false, 'panelName': 'favorite'});
      this.EventBus.$emit('ErrFavoriteList', err);
      console.log(err)
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
      // console.log('err load daehwa');
      console.log(err);
    },
    ErrResUserData(err){
      this.EventBus.$emit('ErrResUserData', err);
    },
    ErrBlockIds(err, cursor){
      console.log(err);
      setTimeout(() => this.ReqBlockIds(cursor), 60000);//리밋일 경우 1분 뒤 재요청
    }
  },
  mounted: function() {//EventBus등록용 함수들
    this.EventBus.$on('StartDalsae', () => {
      this.StartDalsae();
      // console.log('start dalsae recv')
      this.EventBus.$emit('StartStreaming');
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
    this.EventBus.$on('ReqFavorite', (vals) => {
      if(vals==undefined)
        this.ReqFavorite(undefined, undefined);
      else if(vals){
        var maxid = vals['maxid']
        var sinceid = vals['sinceid']
        this.ReqFavorite(maxid, sinceid)
      }
    });
    this.EventBus.$on('Reqqqqq', () => {
			this.StartDalsae();
    });
    this.EventBus.$on('ReqDaehwa', (tweet)=>{
      this.ReqDaehwa(tweet);
    });
    this.EventBus.$on('LoadUserTweet', (screenName)=>{
      this.ReqUserTweet(screenName)
    })
    this.EventBus.$on('GetUserData', (id_str)=>{
      console.log('GetUserData! id_str: '+id_str);
      this.ReqUserData(id_str);
    })
	},
};
</script>

<style lang="scss">

</style>
