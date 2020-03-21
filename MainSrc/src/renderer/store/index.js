import Vue from 'vue'
import Vuex from 'vuex'
import OAuth from "../oauth.js"
import axios from 'axios'
// import { createPersistedState, createSharedMutations } from 'vuex-electron'
import createMutationsSharer from "vuex-shared-mutations";
import modules from './modules'
import TweetDataAgent from '../components/Agents/TweetDataAgent.js'
import {EventBus} from '../main.js';
Vue.use(Vuex);
export default new Vuex.Store({
  modules,
  plugins: [
    createMutationsSharer({
      predicate: (mutation, state) => {
        const predicate = ["Account", "Option","FollowerList","AddMention","AddHome","updateOauth","UpdateUserInfo","UpdateAccount",
        "Retweet","UnRetweet","UnFavorite","Favorite","Daehwa","UIOption"];
        // Conditionally trigger other plugins subscription event here to
        // have them called only once (in the tab where the commit happened)
        // ie. save certain values to localStorage
        // pluginStateChanged(mutation, state)
        // console.log('store~~')
        // console.log(state)
        // console.log('pre~')
        // console.log(predicate.indexOf(mutation.type))
        // console.log(mutation);
        // console.log(mutation.type)
        return predicate.indexOf(mutation.type) >= 0;
      }
    })
    // createMutationsSharer({ predicate: ["Account", "Option"] })
    // createPersistedState(),
    // createSharedMutations({ predicate: ["Account", "Option","AddHome"] })
  ],
  strict: false,
  // strict: process.env.NODE_ENV !== 'production',
  state: {
    tweets:
    {
      home:[],
      mention:[],
      fav:[],
      open:[],
      user:[],
      daehwa:[],
    },
    Account:{//로그인 등록 된 계정 목록
      selectAccount:{
        //   'oauth_token':"퍼블릭키다람쥐썬더",
        //   'oauth_token_secret':"비밀의시크릿키",
        userData:undefined
        // {
        //     'id_str': '고유id',
        //     'screen_name': '표시 아이디',
        //     'profile_image_url_https':'인장 경로',    
        // }
      },
      accountList:[
      // {
      //   'oauth_token':"보여지는 키",
      //   'oauth_token_secret':"비밀의 시크릿키",
      //   'screen_name':"유저 아이디",
      //   'user_id':"유저 고유 아이디"
      // },
      ]
      // selectAccount:{
      //   userData:
      //   {
      //     'id_str': '고유id',
      //     'screen_name': '표시 아이디',
      //     'profile_image_url_https':'인장 경로',
      //   }
      // },
      // accountList:[
      // {
      //   'oauth_token':"보여지는 키",
      //   'oauth_token_secret':"비밀의 시크릿키",
      //   'screen_name':"유저 아이디",
      //   'user_id':"유저 고유 아이디"
      // },

      // ]
    },//트위터에서 리스폰스 받은 계정 정보
    DalsaeOptions: {
      uiOptions: {
        isSmallTweet:false,//트윗 한줄 표시
        isShowPropic: true,//인장 표시
        isBigPropic: true,//인장 크게 표시
        isShowPreview:true,//이미지 미리보기 표시
        isUseRead:false,//읽은 트윗 여부

        isSmallInput:false,//트윗 입력칸 작게 표시

        isSendEnter:true,//enter키로 트윗 전송
        isSendCheck:false,//트윗 전송 시 확인
        isSendRTProtected:true,//플텍계 트윗 rt
        isSendRTCheck:false,//rt 시 확인 창

        isShowTweet:true,//이미지 뷰어 트윗 표시
        isShowBottomPreview:true,//이미지 뷰어 하단 미리보기 표시
        isLoadOrgImg:false,//이미지 뷰어 원본 불러오기

        isMuteMention:false,//멘션함도 뮤트
        isShowMute:false,//뮤트된 트윗 우선 표시 여부
      },
      muteOptions: {
        user:[],
        keyword:[],
        tweet:[],
        highlight:[],
      },
      skin:[],
      hotkey:[],
    },
    Blocks:[

    ],
    following:[],
    follower:[],
  },
  mutations: {
    Account(state, account){
      state.Account=account;
    },
    Option(state, option){
      state.DalsaeOptions=option;
    },
    FollowerList(state, listUser){
      listUser.forEach(function(user){
        var temp = state.follower.find(x=>x.id_str==user.id_str);
        if(temp==undefined){
          state.follower.push(user);
        }
      });
    },
    FollowingList(state, listUser){
      listUser.forEach(function(user){
        var temp = state.following.find(x=>x.id_str==user.id_str);
        if(temp==undefined){
          state.following.push(user);
        }
      });
    },
    AddHome(state, listTweet){
      listTweet.forEach(tweet => {
        var id =state.tweets.home.find(x=>x.id_str==tweet.id_str);
        var index = 0;
        if(id==undefined){//중복 넘기기
          TweetDataAgent.TweetInit(tweet);
          if(TweetDataAgent.CheckBlock(tweet, state.Blocks)){
            // console.log('block tweet')
            return;
          }
          if(TweetDataAgent.CheckHighlight(tweet, state.DalsaeOptions.muteOptions, state.Account.selectAccount.userData.screen_name)){
            var func=function(){
              var id =state.tweets.mention.find(x=>x.id_str==tweet.id_str);
              var index = 0;
              if(id==undefined){//중복 넘기기
                TweetDataAgent.TweetInit(tweet);
                if(TweetDataAgent.CheckBlock(tweet, state.Blocks)){
                  return;
                }
                if(TweetDataAgent.CheckMute(tweet, state.DalsaeOptions.muteOptions)){
                  if(state.DalsaeOptions.uiOptions.isShowMute==false && state.DalsaeOptions.uiOptions.isMuteMention){//뮤트 보여줄지 여부 체크
                    return;
                  }
                }
                tweet.isHighlight=true;
                if(state.tweets.mention.length==0){
                  index=0;
                }else{
                  index = TweetDataAgent.GetTweetIndex(tweet, state.tweets.mention);
                }
                var resTweet=TweetDataAgent.CreateResponsiveTweet(tweet);
                state.tweets.mention.splice(index, 0, resTweet);
                TweetDataAgent.CreateNonResponsiveTweet(resTweet, tweet);
        
              }else{
                // console.log('tweet exists')
              }
            }
            func();
          }
          else{
            if(TweetDataAgent.CheckMute(tweet, state.DalsaeOptions.muteOptions)){
              if(state.DalsaeOptions.uiOptions.isShowMute==false && state.DalsaeOptions.uiOptions.isMuteMention){//뮤트 보여줄지 여부 체크
                return;
              }
            }
          }
          if(state.tweets.home.length==0){
            index=0;
          }
          else{
            index = TweetDataAgent.GetTweetIndex(tweet, state.tweets.home);
          }
          var resTweet=TweetDataAgent.CreateResponsiveTweet(tweet);
          state.tweets.home.splice(index, 0, resTweet);
          TweetDataAgent.CreateNonResponsiveTweet(resTweet, tweet);
          // console.log(resTweet)
        }else{
          // console.log('tweet exists')
        }
      });
    },
    AddMention(state, listTweet){
      listTweet.forEach(tweet => {
        var id =state.tweets.mention.find(x=>x.id_str==tweet.id_str);
        var index = 0;
        if(id==undefined){//중복 넘기기
          TweetDataAgent.TweetInit(tweet);
          if(TweetDataAgent.CheckBlock(tweet, state.Blocks)){
            // console.log('block tweet')
            return;
          }
          if(TweetDataAgent.CheckMute(tweet, state.DalsaeOptions.muteOptions)){
            if(state.DalsaeOptions.uiOptions.isShowMute==false && state.DalsaeOptions.uiOptions.isMuteMention){//뮤트 보여줄지 여부 체크
              return;
            }
          }
          tweet.isHighlight=true;
          if(state.tweets.mention.length==0){
            index=0;
          }
          else{
            index = TweetDataAgent.GetTweetIndex(tweet, state.tweets.mention);
          }
          var resTweet=TweetDataAgent.CreateResponsiveTweet(tweet);
          state.tweets.mention.splice(index, 0, resTweet);
          TweetDataAgent.CreateNonResponsiveTweet(resTweet, tweet);

        }else{
          // console.log('tweet exists')
        }
      });
    },
    AddOpen(state, tweet){
      if(state.tweets.open.find(x=>x.id_str==tweet.id_str)==undefined){
        state.tweets.open.splice(0, 0, tweet);
      }
    },
    updateOauth(state, oauth){
      state.OAuthTemp=oauth;
    },
    UpdateUserInfo(state, userinfo){
      state.Account.accountList.forEach(function(account){
        if(account.user_id==userinfo.id_str){//계정 목록에 있는 데이터도 갱신 
          // console.log('userdata update')
          account.userData=userinfo;
          return false;
        }
      });
      state.Account.selectAccount.userData=userinfo;
    },
    UpdateAccount(state, payload){
      var userinfo=payload.userinfo;

      if(userinfo==undefined||Object.keys(userinfo).length==0){
        // console.log('userinfo null');
        return;
      }  
      if(state.Account.accountList==undefined){//json파일이 없었을 경우 해당 list가 null
        state.Account.accountList=[];
      }
      for(var i=0;i<state.Account.accountList.length;i++){
        if(state.Account.accountList[i].user_id==payload.userinfo.user_id){
            // console.log('이미 있다')
            return;
          }
      }
      state.Account.selectAccount=payload.userinfo;
      state.Account.accountList.push(payload.userinfo);
    },
    Retweet(state, tweet){
      for (let [key, value] of Object.entries(state.tweets)){
        value.forEach(function(tempTweet){
          if(tempTweet.orgTweet.id_str==tweet.retweeted_status.id_str){
            tempTweet.orgTweet.retweeted=true;
          }
        }); 
      };
    },
    UnRetweet(state, tweet){
      for (let [key, value] of Object.entries(state.tweets)){
        value.forEach(function(tempTweet){
          if(tempTweet.orgTweet.id_str==tweet.id_str){
            tempTweet.orgTweet.retweeted=false;
          }
        }); 
      };
    },
    Favorite(state, tweet){
      for (let [key, value] of Object.entries(state.tweets)){
        value.forEach(function(tempTweet){
          if(tempTweet.orgTweet.id_str==tweet.id_str){
            tempTweet.orgTweet.favorited=true;
          }
        }); 
      };
    },
    UnFavorite(state, tweet){
      for (let [key, value] of Object.entries(state.tweets)){
        value.forEach(function(tempTweet){
          if(tempTweet.orgTweet.id_str==tweet.id_str){
            tempTweet.orgTweet.favorited=false;
          }
        }); 
      };
    },
    Delete(state, tweet){
      for (let [key, value] of Object.entries(state.tweets)){
        value.forEach(function(tempTweet){
          if(tempTweet.orgTweet.id_str==tweet.id_str){
            tempTweet.isDelete=true;
          }
        }); 
      };
    },
    Daehwa(state, tweet){
      var find=state.tweets.daehwa.find(x=>x.id_str==tweet.id_str);
      if(state.tweets.daehwa.find(x=>x.id_str==tweet.id_str)!=undefined){//중복 넘기기
        // console.log('dh exists!')
        return;
      }
      TweetDataAgent.TweetInit(tweet);
      if(TweetDataAgent.CheckBlock(tweet, state.Blocks)){
        return;
      }
      if(TweetDataAgent.CheckMute(tweet, state.DalsaeOptions.muteOptions)){
        if(state.DalsaeOptions.uiOptions.isShowMute==false && state.DalsaeOptions.uiOptions.isMuteMention){//뮤트 보여줄지 여부 체크
          return;
        }
      }
      state.tweets.daehwa.splice(state.tweets.daehwa.length,0, tweet);//대화는 오래된 트윗이 위에 위치
    },
    DaehwaAutoAdd(state, tweet){
      var list=state.tweets.daehwa;
      if(list.find(x=>x.id_str==tweet.id_str) == undefined){//중복 넘기기
        list.splice(list.length,0,tweet);//대화는 오래된 트윗이 위에 위치
      }
      var nextTweet=tweet;
      for(var i=0 ; i < 100 ; i++){//대충 무한 루프 방지
        if(nextTweet==undefined) break;
        var findTweet = undefined;
        if(nextTweet.orgTweet.in_reply_to_status_id_str==undefined) break; // 대화 끊김
        findTweet = state.tweets.home.find(x=>x.orgTweet.id_str == nextTweet.orgTweet.in_reply_to_status_id_str);
        if(findTweet == undefined){
          findTweet = state.tweets.mention.find(x=>x.orgTweet.id_str == nextTweet.orgTweet.in_reply_to_status_id_str);
        }
        if(findTweet && list.find(x=>x.id_str==tweet.id_str)!=undefined){//캐시가 있을 경우 && 중복이 아닐 경우
          list.splice(list.length,0,findTweet);//대화는 오래된 트윗이 위에 위치
        }
        nextTweet = findTweet;
      }
    },
    ClearDaehwa(state){
      state.tweets.daehwa=[];
    },
    UIOption(state, uiOption){
      state.DalsaeOptions.uiOptions.isSmallTweet=uiOption.isSmallTweet;
      state.DalsaeOptions.uiOptions.isShowPropic=uiOption.isShowPropic;
      state.DalsaeOptions.uiOptions.isBigPropic=uiOption.isBigPropic;
      state.DalsaeOptions.uiOptions.isShowPreview=uiOption.isShowPreview;
      state.DalsaeOptions.uiOptions.isSmallInput=uiOption.isSmallInput;
      state.DalsaeOptions.uiOptions.isSendEnter=uiOption.isSendEnter;
      state.DalsaeOptions.uiOptions.isSendCheck=uiOption.isSendCheck;
      state.DalsaeOptions.uiOptions.isSendRTProtected=uiOption.isSendRTProtected;
      state.DalsaeOptions.uiOptions.isSendRTCheck=uiOption.isSendRTCheck;
      state.DalsaeOptions.uiOptions.isShowTweet=uiOption.isShowTweet;
      state.DalsaeOptions.uiOptions.isShowBottomPreview=uiOption.isShowBottomPreview;
      state.DalsaeOptions.uiOptions.isLoadOrgImg=uiOption.isLoadOrgImg;
      state.DalsaeOptions.uiOptions.isMuteMention=uiOption.isMuteMention;
      state.DalsaeOptions.uiOptions.isShowMute=uiOption.isShowMute;
      state.DalsaeOptions.uiOptions.isUseRead=uiOption.isUseRead;
    },
    AccountChange(state, user_id){
      var account = state.Account.accountList.find(x=>x.user_id==user_id)
      if(account==undefined) return;

      /////////데이터 clear작업///////////
      state.Account.selectAccount=account;
      state.tweets.home=[];
      state.tweets.mention=[];
      state.tweets.fav=[];
      state.tweets.open=[];
      state.tweets.user=[];
      state.tweets.daehwa=[];
    },
    AccountClear(state){
      state.Account.selectAccount=undefined;
      state.tweets.home=[];
      state.tweets.mention=[];
      state.tweets.fav=[];
      state.tweets.open=[];
      state.tweets.user=[];
      state.tweets.daehwa=[];
    },
    SaveMuteOption(state, muteOption){
      state.DalsaeOptions.muteOptions=muteOption;
    },
    AddMentionSingle(state, tweet){
      var id =state.tweets.mention.find(x=>x.id==tweet.id);
      var index = 0;
      if(id==undefined){//중복 넘기기
        if(state.tweets.mention.length==0){
          index=0;
        }
        TweetDataAgent.TweetInit(tweet);
        if(TweetDataAgent.CheckBlock(tweet, state.Blocks)){
          // console.log('block tweet')
          return;
        }
        if(TweetDataAgent.CheckMute(tweet, state.DalsaeOptions.muteOptions)){
          if(state.DalsaeOptions.uiOptions.isShowMute==false && state.DalsaeOptions.uiOptions.isMuteMention){//뮤트 보여줄지 여부 체크
            return;
          }
        }
        tweet.isHighlight=true;
        index = TweetDataAgent.GetTweetIndex(tweet, state.tweets.home);
        state.tweets.mention.splice(index, 0, tweet);

      }else{
        // console.log('tweet exists')
      }
    },
    ShowMuteTweet(state, tweet){
      tweet.isMuted=false;
    },
    TweetRead(state, tweet){
      tweet.isReaded=true;
    },
    AddStreaming(state, tweet){
      var id =state.tweets.home.find(x=>x.id_str==tweet.id_str);
      var index = 0;
      if(id==undefined){//중복 넘기기
        TweetDataAgent.TweetInit(tweet);
        if(TweetDataAgent.CheckBlock(tweet, state.Blocks)){
          // console.log('block tweet')
          return;
        }
        if(TweetDataAgent.CheckHighlight(tweet, state.DalsaeOptions.muteOptions, state.Account.selectAccount.userData.screen_name)){
          var func=function(){
            var id =state.tweets.mention.find(x=>x.id_str==tweet.id_str);
            var index = 0;
            if(id==undefined){//중복 넘기기
              TweetDataAgent.TweetInit(tweet);
              if(TweetDataAgent.CheckBlock(tweet, state.Blocks)){
                return;
              }
              if(TweetDataAgent.CheckMute(tweet, state.DalsaeOptions.muteOptions)){
                if(state.DalsaeOptions.uiOptions.isShowMute==false && state.DalsaeOptions.uiOptions.isMuteMention){//뮤트 보여줄지 여부 체크
                  return;
                }
              }
              tweet.isHighlight=true;
              if(state.tweets.mention.length==0){
                index=0;
              }else{
                index = TweetDataAgent.GetTweetIndex(tweet, state.tweets.mention);
              }
              var resTweet=TweetDataAgent.CreateResponsiveTweet(tweet);
              state.tweets.mention.splice(index, 0, resTweet);
              TweetDataAgent.CreateNonResponsiveTweet(resTweet, tweet);
            }else{
              // console.log('tweet exists')
            }
          }
          func();
        }
        else{
          if(TweetDataAgent.CheckMute(tweet, state.DalsaeOptions.muteOptions)){
            if(state.DalsaeOptions.uiOptions.isShowMute==false && state.DalsaeOptions.uiOptions.isMuteMention){//뮤트 보여줄지 여부 체크
              return;
            }
          }
        }
        if(state.tweets.home.length==0){
          index=0;
        }
        else{
          index = TweetDataAgent.GetTweetIndex(tweet, state.tweets.home);
        }
        var resTweet=TweetDataAgent.CreateResponsiveTweet(tweet);
        state.tweets.home.splice(index, 0, resTweet);
        TweetDataAgent.CreateNonResponsiveTweet(resTweet, tweet);
      }else{
        // console.log('tweet exists')
      }
    },
    AddQtTweet(state, vals){
      var tweet=vals['tweet'];
      var qtTweet=vals['qtTweet'];
      TweetDataAgent.TweetInit(qtTweet);
      tweet.qtTweet=qtTweet;
    }
  },
  methods:{
  },
  actions: {
    Account(context, account){
      context.commit('Account', account);
    },
    Option(context, option){//최초 파일 로드 시 넣는 놈
      context.commit('Option', option);
    },
    UIOption(context, uioption){//옵션 변경 시 호출 되는 놈
      context.commit('UIOption', uioption);
    },
    FollowerList(context, listUsers){
      context.commit('FollowerList', listUsers);
    },
    FollowingList(context, listUsers){
      context.commit('FollowingList', listUsers);
    },
    AddHome(context, listTweet){
      context.commit('AddHome', listTweet);
    },
    AddMention(context, listTweet){
      context.commit('AddMention', listTweet);
    },
    AddOpen(context, tweet){
      context.commit('AddOpen', tweet);
    },
    UpdateUser(context, user){
      context.commit('UpdateUserInfo', user);
    },
    AddToken(context, oauth){
      context.commit('UpdateAccount', {userinfo:oauth});
    },
    Retweet(context, tweet){
      context.commit('Retweet', tweet)
    },
    UnRetweet(context, tweet){
      context.commit('UnRetweet', tweet)
    },
    Favorite(context, tweet){
      context.commit('Favorite', tweet)
    },
    UnFavorite(context, tweet){
      context.commit('UnFavorite', tweet)
    },
    ClearDaehwa(context){
      context.commit('ClearDaehwa');
    },
    Daehwa(context, tweet){
      context.commit('Daehwa', tweet);
    },
    DaehwaAutoAdd(context, tweet){//대화 불러오기 시 캐시된 데이터가 있는지 확인 
      context.commit('DaehwaAutoAdd', tweet);
    },
    Delete(context, tweet){
      context.commit('Delete', tweet);
    },
    AccountChange(context, user_id){
      context.commit('AccountChange', user_id);
    },
    AccountClear(context){
      context.commit('AccountClear');
    },
    SaveMuteOption(context, muteOption){
      context.commit('SaveMuteOption', muteOption)
    },
    AddMentionSingle(context, tweet){
      context.commit('AddMentionSingle', tweet);
    },
    ShowMuteTweet(context, tweet){
      context.commit('ShowMuteTweet', tweet);
    },
    TweetRead(context, tweet){
      context.commit('TweetRead', tweet);
    },
    AddStreaming(context, tweet){
      context.commit('AddStreaming', tweet);
    },
    AddQtTweet(context, vals){
      context.commit('AddQtTweet', vals)
    },
  }
});
