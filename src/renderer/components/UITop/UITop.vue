<template>
  <div class="ui-top-normal">
    <div class="ui-propic" v-if="userData!=undefined &&uiOption.isShowPropic && !uiOption.isSmallInput">
        <img class="propic" :src="Propic" :class="{'profile':!uiOption.isBigPropic,'profile-big':uiOption.isBigPropic}"/>
    </div>
    <InputTweet ref="inputTweet" :option="uiOption" v-bind:following="this.following" :tweetText.sync="tweetText" :sendCallBack="this.SendTweet"/>
  </div>
</template>

<script>
import ApiTweet from "../APICalls/TweetCall.js"
import InputTweet from './TweetInput.vue'
export default {
  name: "uitop",
  components:{
    InputTweet
  },
   data () {
    return {
      tweetText:'',
      accountList:undefined,
      selectAccount:undefined,
      replyTweet:undefined,
      userData:undefined
    }
  },
  computed:{
    Propic(){
      if(this.userData==undefined) return '';
      if(this.userData.profile_image_url_https==undefined) return '';
      return this.uiOption.isBigPropic
        ? this.userData.profile_image_url_https.replace("_normal", "_bigger")
        : this.userData.profile_image_url_https;
      
    },
  },
  mounted: function() {//EventBus등록용 함수들
    this.EventBus.$on('Reply', (tweet) => {//트윗 답변 누를 경우 표시 
      this.Reply(tweet);
    });
    this.EventBus.$on('ReplyAll', (tweet) => {//트윗 답변 누를 경우 표시 
      this.ReplyAll(tweet);
    });
    this.EventBus.$on('StartDalsae', ()=>{
      this.UpdateUserData();
    });
    this.EventBus.$on('ResUserInfo', (userInfo)=>{//api콜로 계정 정보를 받아왔을 경우 
      this.userData=userInfo;
    });
  },
  created:function(){
    
  },
  methods:{
    UpdateUserData(){
      this.selectAccount=this.$store.state.Account.selectAccount;
      this.accountList=this.$store.state.Account.accountList;
      this.userData=this.$store.state.Account.selectAccount.userData;
    },
    Reply(tweet){
      this.replyTweet=tweet;
      var str='';
      if(this.selectAccount.userData.screen_name!=tweet.user.screen_name){
        str='@'+tweet.user.screen_name+' ';
      }
      this.$refs.inputTweet.SetReply(str);
      this.EventBus.$emit('FocusInput');
    },
    ReplyAll(tweet){
      this.replyTweet=tweet;
      var arr=[];
      arr.push(tweet.user.screen_name);
      if(arr.find(x=>x==tweet.orgTweet.user.screen_name)==undefined){
        arr.push(tweet.orgTweet.user.screen_name);
      }
      if(tweet.entities.user_mentions!=undefined){
        tweet.entities.user_mentions.forEach(user => {
          if(this.selectAccount.userData.screen_name==user.screen_name) return true;//난 제외
          if(arr.find(x=>x==user.screen_name)==undefined){//중복 안되게
            arr.push(user.screen_name);
          }
        });
      }
      var str='';
      arr.forEach(user=>{
        str+='@'+user+' '
      });
      this.$refs.inputTweet.SetReply(str);
      this.EventBus.$emit('FocusInput');
    },
    SendTweet(){
      var id=0;
      if(this.replyTweet!=undefined){
        id= this.replyTweet.orgTweet.id_str;
      }
      var media = this.$refs.inputTweet.arrImage;
      this.EventBus.$emit('SendTweet', {'text': this.tweetText, 'media': media, 'replyId':id});
      this.replyTweet=undefined;
    },
    ResTweet(tweet){

    }
  },
  props: {
    following:undefined,
    uiOption:undefined,
  },
};
</script>
<style lang="scss" scoped>
.ui-top-normal{
    font-size: 14px !important;
    display: flex;
    background-color: #ffe0e0;
    .propic{
        margin: 4px;
    }
    .ui-propic{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: left;
        width: auto;
    }
    .input-zone{
        flex: 1;
    }
    @mixin profile() {
      object-fit: contain;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
    }
    .profile {
      @include profile();
      width: 48px;
    }
    .profile-big {
      @include profile();
      width: 73px;
    }
}
</style>