<template>
  <div class="profile-popup">
    <div class="title-image">
      <img class="img-title" :src="user.profile_banner_url" v-if="user!=undefined"/>
    </div>
    <div class="profile">
      <div class="left">
        <div class="propic">
          <img class="img-propic" :src="propic"/>
        </div>
        <div class="counts">
          <div class="count-left">
            <span>트윗</span><br/>
            <!-- <span>미디어</span><br/> -->
            <span>팔로잉</span><br/>
            <span>팔로워</span><br/>
          </div>
          <div class="count-right" v-if="user!=undefined">
            <span @click="ClickTweet">{{Comma(user.statuses_count)}}</span><br/>
            <!-- <span>{{Comma(user.media_count)}}</span><br/> -->
            <span @click="ClickFollowingList">{{Comma(user.friends_count)}}</span><br/>
            <span @click="ClickFollowerList">{{Comma(user.followers_count)}}</span><br/>
          </div>
        </div>
      </div>
      <div class="right" v-if="user!=undefined">
        <div class="buttons" v-if="user.screen_name!=tokenData.screen_name">
          <i class="fas fa-ellipsis-h fa-2x" @click="ClickContext"></i>
          <button class="btn-follow" type="button" @click="ClickFollow">{{FollowText}}</button>
        </div>
        <div class="profile-name" v-if="user!=undefined">
          <span class="name">{{user.name}}</span>
          <i :class="{'name': true}" v-if="user.protected" class="fas fa-lock"></i><br/>
          <span class="screen-name">@{{user.screen_name}}</span>
          <span class="follow-by" v-if="FollowBy">님은 나를 팔로우 하고 있습니다.</span><br/><br/>
        </div>
        <span v-if="user!=undefined" class="bio">{{user.description}}</span><br/>
        <i :class="{'witch':true}" class="far fa-compass"></i>
        <span v-if="user!=undefined" class="witch">{{user.location}}</span><br/>
        <i :class="{'url':true}" class="fas fa-link fa-2x"></i>
        <a v-if="user!=undefined && user.entities.url!=undefined && user.entities.url.urls.length>0" :href="user.entities.url.urls[0].expanded_url">{{user.entities.url.urls[0].expanded_url}}</a>
        <div class="birth-day">
        </div>
        <div class="join-day">
        </div>
      </div>
    </div>
    <div class="friends-list">
      <UserList ref="userList" :listUser="listUser"/>
    </div>
    <ProfileCall :selectAccount="tokenData"/>
    <ProfileContext ref="context"/>
  </div>
</template>

<script>
const app = require('electron').remote.app
import ProfileCall from '../APICalls/ProfileCall.vue'
import UserList from './Profile/UserList.vue'
import ProfileContext from './Profile/ProfileContext.vue'
export default {
  name: "profilepopup",
  components: {
    ProfileCall,
    UserList,
    ProfileContext,
  },
  data: function() {
    return {
      screenName:'',
      tokenData:undefined,
      user:undefined,
      listUser:[],
      listFollower:[],
    };
  },
  computed:{
    FollowBy(){
      for(var i=0;i<this.listFollower.length;i++)
        if(this.user.screen_name==this.listFollower[i].screen_name)
          return true;
    },
    FollowText(){
      return this.user.following? '언팔로우' : '팔로잉'
    },
    propic() {
      if(this.user==undefined) return '';
      return this.user.profile_image_url_https.replace("_normal", "_bigger");
    },
  },
  created: function() {
    var ipcRenderer = require('electron').ipcRenderer;
		ipcRenderer.on('Profile', (event, screenName, userData, listFollower) => {
      this.listFollower=listFollower;
      this.tokenData=userData;
      this.screenName=screenName;
      this.$nextTick(()=>{
        this.EventBus.$emit('ReqProfile', screenName);
      })
		});
    this.EventBus.$on('ResProfile', (user)=>{
      this.user=user;
    })
    this.EventBus.$on('ResFollow', (vals)=>{
      var bUser = vals['user']
      if(this.user.screen_name==bUser.screen_name)
        this.user.following=vals['follow'];
      this.listUser.forEach((user)=>{
        if(user.screen_name==bUser.screen_name)
          user.following=vals['follow'];
      })
    })
    this.EventBus.$on('ResBlock', (vals)=>{
      var bUser = vals['user']
      if(this.user.screen_name==bUser.screen_name)
        this.user.blocking=vals['block'];
      this.listUser.forEach((user)=>{
        if(user.screen_name==bUser.screen_name)
          user.blocking=vals['block'];
      })
    })
    this.EventBus.$on('ResFollowingList', (listUser)=>{
      this.listUser=listUser.users
    })
    this.EventBus.$on('ResFollowerList', (listUser)=>{
      this.listUser=listUser.users
    })
    this.EventBus.$on('UserClick', (user)=>{
      this.user=user;
    });
    this.EventBus.$on('ClickContext', (vals)=>{
      this.ShowContext(vals['e'], vals['user']);
    })
    this.EventBus.$on('Block', (user)=>{

    });
    this.EventBus.$on('RetweetOff', (user)=>{
      
    });
    this.EventBus.$on('Mute', (user)=>{

    });
    this.EventBus.$on('CloseProfilePopup', ()=>{
      close();
    })
  },
  methods: {
    Comma(num){
      var str = String(num);
      return str.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    ShowContext(e, user){
      console.log('show context')
      console.log(e);
      console.log(user)
      this.$refs.context.Show(e, user);
    },
    ClickContext(e){
      this.ShowContext(e, this.user);
    },
    ClickTweet(e){
     var ipcRenderer = require('electron').ipcRenderer;
	  	ipcRenderer.send('LoadUserTweet', this.user.screen_name);
    },
    ClickFollow(e){
      this.EventBus.$emit('ReqFollow', this.user);
    },
    ClickFollowingList(e){
      this.$refs.userList.ChangeList(this.user.name, this.user.screen_name, true)
      this.EventBus.$emit('ReqFollowingList', this.user);
    },
    ClickFollowerList(e){
      this.$refs.userList.ChangeList(this.user.name, this.user.screen_name, false)
      this.EventBus.$emit('ReqFollowerList', this.user);
    },
  },
};
</script>

<style lang="scss" scoped>
.profile-popup{
  width: 600px;
  height: 900px;
  box-sizing: content-box;
  border:1px solid black;
  padding: 4px;
  font-size: 14px;
  .title-image{
    width: 100%;
    height: 203px;
    .img-title{
      width: 100%;
      height: 200px;
      object-fit: contain;
      border-radius: 10px;
    }
  }
  .profile{
    display: flex;
    border-bottom: dashed 2px #66757f;
    .left{
      margin-top: -40px;
      width: 140px;
      height: 240px;
      padding: 4px;
      .propic{
        .img-propic{
          border-radius: 8px;
          border: 4px solid white;
          margin-left: 20px;
        }
      }
      .counts{
        display: flex;
        .count-left{
          background-color: white;
          font-size: 14px;
          text-align: right;
          width: 56px;
        }
        .count-right{
          text-align: left;
          font-size: 14px;
          color: #66757f;
          margin-left: 2px;
          width: 74px;
          span:hover{
            cursor: pointer;
          }
        }
      }
    }
    .right{
      width: 452px;
      height: 200px;
      .buttons{
        float: right;
        display: flex;
        margin-right: 4px;
        .btn-follow{
          height: 30px;
          width: 80px;
          margin-top: 6px;
        }
      }
      .profile-name{
        max-width: 310px;
        .name{
          font-weight: bold;
          font-size: 16px;
        }
        .screen-name{
        }
        .follow-by{
          color: #66757f;
        }
      }
      .witch{
        color: #66757f;
        margin-right: 2px;
      }
      .url{
        color: #66757f;
        font-size: 12px;
        margin-right: 2px;
      }
    }
  }
}
.buttons i{
  font-size:30px;
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
</style>
