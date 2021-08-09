<template>
  <div class="ui-top-normal">
    <div class="ui-propic" v-if="userData!=undefined &&uiOption.isShowPropic && !uiOption.isSmallInput" @click="ClickPropic">
        <img class="propic" :src="Propic" :class="{'profile':!uiOption.isBigPropic,'profile-big':uiOption.isBigPropic}"/>
    </div>
    <InputTweet ref="inputTweet" :selectAccount="selectAccount" :userData="userData" :option="uiOption" v-bind:following="this.following"/>
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
    this.EventBus.$on('StartDalsae', ()=>{
      this.UpdateUserData();
    });
    this.EventBus.$on('ResUserInfo', (userInfo)=>{//api콜로 계정 정보를 받아왔을 경우 
      this.userData=userInfo;
    });
    this.EventBus.$on('SendTweet', (text)=>{

    })
  },
  created:function(){
    
  },
  methods:{
    ClickPropic(e){
      this.EventBus.$emit('ShowAccountModal', true);
    },
    UpdateUserData(){
      this.selectAccount=this.$store.state.Account.selectAccount;
      this.accountList=this.$store.state.Account.accountList;
      this.userData=this.$store.state.Account.selectAccount.userData;
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
    background-color: white;
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