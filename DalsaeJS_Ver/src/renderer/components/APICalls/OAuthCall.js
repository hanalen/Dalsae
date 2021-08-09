function GetHeader(vuex, param){
	OAuth.GetHeader(param.param, param.method, param.url);
}

import axios from 'axios'
import OAuth from '../../OAuth.js'

export default{
	GetToken(callback){
		console.log('GetToken');
		var url='https://api.twitter.com/oauth/request_token';
		var method='POST';

		var arr=[];
		arr['oauth_callback']= 'oob';//redirect 페이지 없는 parameter

		axios({
			method:method,
			url:url,
			headers:{
				'Content-Type':'application/x-www-form-urlencoded;encoding=utf-8',
				// 'Access-Control-Allow-Origin':'*',
				'Authorization': OAuth.GetHeader(arr, method, url)
			},
		}).then((res)=>{
			console.log('GetToken success');
			// console.log(res);
			var arrOAuth={};
			var splitOne = res.data.split('&');
			for(var i=0;i<splitOne.length;i++){
				var pair = splitOne[i].split('=');
				arrOAuth[pair[0]]=pair[1];
			}
      const { shell } = require('electron')
			var url = 'https://api.twitter.com/oauth/authorize?oauth_token='+arrOAuth.oauth_token;
      shell.openExternal(url);
			callback(arrOAuth);
		}).catch((err)=>{
			// console.log('get token error!');
			console.log(err);
		});
	},
	GetAccessToken(pin, publickey, secretkey, callback){
		// console.log('token pin: '+pin);
		var url='https://api.twitter.com/oauth/access_token';
		var method='POST';
		var arr=[];
		arr['oauth_verifier']= pin.toString();
		axios({
			method:method,
			url:url,
			headers:{
				'Content-Type':'application/x-www-form-urlencoded;encoding=utf-8',
				// 'Access-Control-Allow-Origin':'*',
				'Authorization': OAuth.GetHeader(arr, method, url, publickey, secretkey)
			},
		}).then((res)=>{
			// console.log('GetToken success');
			// console.log('token success');
			// console.log(res);
			var arrOAuth={};
			var splitOne = res.data.split('&');
			for(var i=0;i<splitOne.length;i++){
				var pair = splitOne[i].split('=');
				arrOAuth[pair[0]]=pair[1];
			}
			// console.log(arrOAuth);
			callback(arrOAuth);
		}).catch((err)=>{
			// console.log('get token error!');
			console.log(err);
		});
	}
}