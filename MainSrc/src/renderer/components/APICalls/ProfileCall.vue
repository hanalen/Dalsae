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
			ApiProfile.ReqProfile(screenName);
		});
		this.EventBus.$on('ReqBlock', (user) => {
			ApiProfile.ReqProfile(screenName);
		});
		this.EventBus.$on('ReqMute', (screenName) => {
			ApiProfile.ReqProfile(screenName);
		});
		this.EventBus.$on('ReqFollowingList', (screenName) => {
			ApiProfile.ReqProfile(screenName);
		});
		this.EventBus.$on('ReqFollowerList', (screenName) => {
			ApiProfile.ReqProfile(screenName);
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
				ApiProfile.ReqUnFollow(screenName, this.selectAccount.oauth_token, this.selectAccount.oauth_token_secret,
					this.ResProfile, this.ErrProfile);
			else
				ApiProfile.ReqFollow(screenName, this.selectAccount.oauth_token, this.selectAccount.oauth_token_secret,
					this.ResProfile, this.ErrProfile);
		},
		ReqBlock(user){
			if(user.blocking)
				ApiProfile.ReqUnBlock(screenName, this.selectAccount.oauth_token, this.selectAccount.oauth_token_secret, 
					this.ResProfile, this.ErrProfile);
			else
				ApiProfile.ReqBlock(screenName, this.selectAccount.oauth_token, this.selectAccount.oauth_token_secret, 
					this.ResProfile, this.ErrProfile);
		},
		ReqFollowingList(screenName){
			ApiProfile.ReqFollowingList(screenName, this.selectAccount.oauth_token, this.selectAccount.oauth_token_secret, 
				this.ResProfile, this.ErrProfile);
		},
		ReqFollwerList(screenName){
			ApiProfile.ReqFollowerList(screenName, this.selectAccount.oauth_token, this.selectAccount.oauth_token_secret, 
				this.ResProfile, this.ErrProfile);
		},
		ReqMute(user){
			// ApiProfile.ReqProfile(screenName, this.selectAccount.oauth_token, this.selectAccount.oauth_token_secret, this.ResProfile, this.ErrProfile);
		},
		ResProfile(user){
			this.EventBus.$emit('ResProfile', user);
		},
		ResFollow(user){

		},
		ResUnFollow(user){

		},
		ResBlock(user){

		},
		ResUnBlock(user){

		},
		ResFollwerList(listUser){

		},
		ResFollwingList(listUser){

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
