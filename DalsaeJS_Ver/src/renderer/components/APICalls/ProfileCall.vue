<template>
  <div class="profile-call">
  </div>
</template>

<script>
import {EventBus} from '../../main.js';
import ApiProfile from './ProfileCall';
import OAuth from '../../OAuth.js'
import axios from 'axios'

export default {
  name: "profilecall",
  props: {
		selectAccount:undefined,
  },
  mounted:function() {
		this.EventBus.$on('ReqProfile', (screenName) => {
			this.ReqProfile(screenName)
		});
		this.EventBus.$on('ReqFollow', (user) => {
			this.ReqFollow(user);
		});
		this.EventBus.$on('ReqBlock', (user) => {
			this.ReqBlock(user)
		});
		this.EventBus.$on('ReqMute', (screenName) => {
			// this.req
		});
		this.EventBus.$on('ReqFollowingList', (user) => {
			this.ReqFollowingList(user.screen_name);
		});
		this.EventBus.$on('ReqFollowerList', (user) => {
			this.ReqFollowerList(user.screen_name)
		});
  },
  data() {
    return {
      
    };
  },
  methods: {
		ReqProfile(screenName){
			ApiProfile.ReqProfile(screenName, this.selectAccount.oauth_token, this.selectAccount.oauth_token_secret,
			this.ResProfile, this.ErrProfile);
		},
		ReqFollow(user){
			if(user.following)
				ApiProfile.ReqUnFollow(user.screen_name, this.selectAccount.oauth_token, this.selectAccount.oauth_token_secret,
					this.ResUnFollow, this.ErrFollow);
			else
				ApiProfile.ReqFollow(user.screen_name, this.selectAccount.oauth_token, this.selectAccount.oauth_token_secret,
					this.ResFollow, this.ErrFollow);
		},
		ReqBlock(user){
			if(user.blocking)
				ApiProfile.ReqUnBlock(user.id_str, this.selectAccount.oauth_token, this.selectAccount.oauth_token_secret, 
					this.ResUnBlock, this.ErrBlock);
			else
				ApiProfile.ReqBlock(user.id_str, this.selectAccount.oauth_token, this.selectAccount.oauth_token_secret, 
					this.ResBlock, this.ErrBlock);
		},
		ReqFollowingList(screenName){
			ApiProfile.ReqFollowingList(screenName, this.selectAccount.oauth_token, this.selectAccount.oauth_token_secret, 
				this.ResFollwingList, this.ErrFollowingList);
		},
		ReqFollowerList(screenName){
			ApiProfile.ReqFollowerList(screenName, this.selectAccount.oauth_token, this.selectAccount.oauth_token_secret, 
				this.ResFollwerList, this.ErrFollwerList);
		},
		ReqMute(user){
			// ApiProfile.ReqProfile(screenName, this.selectAccount.oauth_token, this.selectAccount.oauth_token_secret, this.ResProfile, this.ErrProfile);
		},
		ResProfile(user){
			this.EventBus.$emit('ResProfile', user);
		},
		ResFollow(user){
			this.EventBus.$emit('ResFollow', {'user':user, 'follow':true});
		},
		ResUnFollow(user){
			this.EventBus.$emit('ResFollow', {'user':user, 'follow':false});
		},
		ResBlock(user){
			this.EventBus.$emit('ResBlock', {'user':user, 'block':true})
		},
		ResUnBlock(user){
			this.EventBus.$emit('ResBlock', {'user':user, 'block':false})
		},
		ResFollwerList(listUser){
			this.EventBus.$emit('ResFollowerList', listUser)
		},
		ResFollwingList(listUser){
			this.EventBus.$emit('ResFollowingList', listUser)
		},
		ErrProfile(err){

		},
		ErrFollow(err){

		},
		ErrBlock(err){

		},
		ErrFollwerList(err){

		},
		ErrFollowingList(err){

		},
  },
};
</script>

<style lang="scss">

</style>
