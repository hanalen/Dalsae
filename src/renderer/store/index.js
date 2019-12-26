import Vue from 'vue'
import Vuex from 'vuex'
import OAuth from "../oauth.js"
import axios from 'axios'
// import { createPersistedState, createSharedMutations } from 'vuex-electron'
import createMutationsSharer from "vuex-shared-mutations";
import modules from './modules'

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
        console.log('store~~')
        console.log(state)
        console.log('pre~')
        console.log(predicate.indexOf(mutation.type))
        console.log(mutation);
        console.log(mutation.type)
        return predicate.indexOf(mutation.type) >= 0;
      }
    })
    // createMutationsSharer({ predicate: ["Account", "Option"] })
    // createPersistedState(),
    // createSharedMutations({ predicate: ["Account", "Option","AddHome"] })
  ],
  strict: process.env.NODE_ENV !== 'production',
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
        isShowPropic: true,//인장 표시
        isBigPropic: true,//인장 크게 표시
        isShowPreview:true,//이미지 미리보기 표시

        isSmallInput:false,//트윗 입력칸 작게 표시

        isSendEnter:true,//enter키로 트윗 전송
        isSendCheck:false,//트윗 전송 시 확인
        isSendRTProtected:true,//플텍계 트윗 rt
        isSendRTCheck:false,//rt 시 확인 창

        isShowTweet:true,//이미지 뷰어 트윗 표시
        isShowBottomPreview:true,//이미지 뷰어 하단 미리보기 표시
        isLoadOrgImg:false,//이미지 뷰어 원본 불러오기

        isMuteMention:false,//멘션함도 뮤트

      },
      muteOptions: {
        user:[],
        keyword:[],
        tweet:[],
      },
      skin:[],
      hotkey:[],
    },
    Friends:[
      {
        following:[],
        follower:[]
      }
    ],
    following:[],
    follower:[],
  },
  mutations: {
    Account(state, account){
      console.log('mute account')
      console.log(account)
      state.Account=account;
    },
    Option(state, option){
      console.log('mute option')
      console.log(option)
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
        var id =state.tweets.home.find(x=>x.id==tweet.id);
        var index = 0;
        if(id==undefined){//중복 넘기기
          if(state.tweets.home.length==0){
            index=0;
          }
          for(var i=state.tweets.home.length-1;i>-1;i--){
            var nTweet = state.tweets.home[i];  
            index=i;
            if(nTweet.created_at <= tweet.created_at){
              index++;
              break;
            }
          }
          var orgUser=undefined;
          var orgTweet=undefined;
          orgUser = tweet.retweeted_status==undefined ? tweet.user :tweet.retweeted_status.user;//리트윗, 원트윗 유저 선택
          orgTweet=tweet.retweeted_status==undefined? tweet : tweet.retweeted_status;//원본 트윗 저장
          tweet.orgUser=JSON.parse(JSON.stringify(orgUser));
          tweet.orgTweet=JSON.parse(JSON.stringify(orgTweet));
          state.tweets.home.splice(index, 0, tweet);

        }else{
          console.log('tweet exists')
        }
      });
    },
    AddMention(state, listTweet){
      listTweet.forEach(tweet => {
        var id =state.tweets.mention.find(x=>x.id==tweet.id);
        var index = 0;
        if(id==undefined){//중복 넘기기
          if(state.tweets.mention.length==0){
            index=0;
          }
          for(var i=state.tweets.mention.length-1;i>-1;i--){
            var nTweet = state.tweets.mention[i];  
            index=i;
            if(nTweet.created_at <= tweet.created_at){
              index++;
              break;
            }
          }
          var orgUser=undefined;
          var orgTweet=undefined;
          orgUser = tweet.retweeted_status==undefined ? tweet.user :tweet.retweeted_status.user;//리트윗, 원트윗 유저 선택
          orgTweet=tweet.retweeted_status==undefined? tweet : tweet.retweeted_status;//원본 트윗 저장
          tweet.orgUser=JSON.parse(JSON.stringify(orgUser));
          tweet.orgTweet=JSON.parse(JSON.stringify(orgTweet));
          state.tweets.mention.splice(index, 0, tweet);

        }else{
          console.log('tweet exists')
        }
      });
    },
    updateOauth(state, oauth){
      state.OAuthTemp=oauth;
    },
    UpdateUserInfo(state, userinfo){
      state.Account.accountList.forEach(function(account){
        if(account.id_str==userinfo.id_str){//계정 목록에 있는 데이터도 갱신 
          account.userData=userinfo;
          return false;
        }
      });
      state.Account.selectAccount.userData=userinfo;
    },
    UpdateAccount(state, payload){
      var userinfo=payload.userinfo;

      if(userinfo==undefined||Object.keys(userinfo).length==0){
        console.log('userinfo null');
        return;
      }  
      if(state.Account.accountList==undefined){//json파일이 없었을 경우 해당 list가 null
        state.Account.accountList=[];
      }
      for(var i=0;i<state.Account.accountList.length;i++){
        if(state.Account.accountList[i].user_id==payload.userinfo.user_id){
            console.log('이미 있다')
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
          if(tempTweet.orgTweet.id_str==tweet.retweeted_status.id_str){
            tempTweet.orgTweet.retweeted=false;
          }
        }); 
      };
    },
    Favorite(state, tweet){
      for (let [key, value] of Object.entries(state.tweets)){
        value.forEach(function(tempTweet){
          if(tempTweet.orgTweet.id_str==tweet.retweeted_status.id_str){
            tempTweet.orgTweet.favorited=true;
          }
        }); 
      };
    },
    UnFavorite(state, tweet){
      for (let [key, value] of Object.entries(state.tweets)){
        value.forEach(function(tempTweet){
          if(tempTweet.orgTweet.id_str==tweet.retweeted_status.id_str){
            tempTweet.orgTweet.favorited=false;
          }
        }); 
      };
    },
    Delete(state, tweet){
      for (let [key, value] of Object.entries(state.tweets)){
        value.forEach(function(tempTweet){
          if(tempTweet.orgTweet.id_str==tweet.id_str){
            value.pop(tempTweet);
          }
        }); 
      };
    },
    Daehwa(state, tweet){
      if(state.tweets.daehwa.find(x=>x.id==tweet.id)!=undefined){//중복 넘기기
        return;
      }
      tweet.orgUser = tweet.retweeted_status==undefined ? tweet.user :tweet.retweeted_status.user;//리트윗, 원트윗 유저 선택
      tweet.orgTweet=tweet.retweeted_status==undefined? tweet : tweet.retweeted_status;//원본 트윗 저장
      state.tweets.daehwa.push(tweet);
    },
    ClearDaehwa(state){
      console.log('clear dh')
      state.tweets.daehwa=[];
    },
    UIOption(state, uiOption){
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
    },
  },
  methods:{
  },
  actions: {
    Account(context, account){
      console.log('action account')
      console.log(account)
      context.commit('Account', account);
    },
    Option(context, option){//최초 파일 로드 시 넣는 놈
      console.log('action option')
      console.log(option)
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
    Delete(context, tweet){
      context.commit('Delete', tweet);
    },
    GetImage({commit}){
      commit('')
    },
    getCount ({ commit }) {
      browser.runtime.sendMessage({type: "storeinit", key: "count"}).then(count => {
        commit('setCount', count)
      })
    }
  }
});
