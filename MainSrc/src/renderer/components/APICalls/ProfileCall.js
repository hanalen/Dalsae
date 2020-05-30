function GetHeader(vuex, param){
	OAuth.GetHeader(param.param, param.method, param.url);
}

import axios from 'axios'
import OAuth from '../../OAuth.js'
//다 파라메터 screen_name, count
//			url = "https://api.twitter.com/1.1/friendships/create.json"; //팔로우
//url = "https://api.twitter.com/1.1/friendships/destroy.json";//언팔
//url = "https://api.twitter.com/1.1/friends/list.json";//팔로잉 목록
//url = "https://api.twitter.com/1.1/followers/list.json";//팔로워 모록
// url = "https://api.twitter.com/1.1/blocks/create.json";///블락
// url = "https://api.twitter.com/1.1/blocks/destroy.json";//언블락
// url = "https://api.twitter.com/1.1/users/show.json";//프로필 불러오기



export default{
	ReqProfile(screenName, publickey, secretkey, callback, errCallback){
		var url='https://api.twitter.com/1.1/users/show.json';
		var method='GET';
		var arr=[];
		arr['screen_name']= screenName;
		var callUrl=OAuth.GetURL(url, method ,arr);
		var sendData=OAuth.CreateData(arr);
		axios({
			method:method,
			url:callUrl,
			headers:{
				'Content-Type':'application/x-www-form-urlencoded;encoding=utf-8',
				'Authorization': OAuth.GetHeader(arr, method, url, publickey, secretkey)
			},
			data:sendData
		}).then((res)=>{
			callback(res.data);
		}).catch((err)=>{
			// console.log('get userinfo error!');
			console.log(err);
			// errCallback(err);
		});
	},
	ReqFollow(screenName, publickey, secretkey, callback, errCallback){
		var url='https://api.twitter.com/1.1/friendships/create.json';
		var method='POST';
		var arr=[];
		arr['screen_name']= screenName;
		var callUrl=OAuth.GetURL(url, method ,arr);
		var sendData=OAuth.CreateData(arr);
		axios({
			method:method,
			url:callUrl,
			headers:{
				'Content-Type':'application/x-www-form-urlencoded;encoding=utf-8',
				'Authorization': OAuth.GetHeader(arr, method, url, publickey, secretkey)
			},
			data:sendData
		}).then((res)=>{
			// console.log('get userinfo ok');
			callback(res.data);
		}).catch((err)=>{
			// console.log('get userinfo error!');
			console.log(err);
			errCallback(err);
		});
	},
	ReqUnFollow(screenName, publickey, secretkey, callback, errCallback){
		var url='https://api.twitter.com/1.1/friendships/destroy.json';
		var method='POST';
		var arr=[];
		arr['screen_name']= screenName;
		var callUrl=OAuth.GetURL(url, method ,arr);
		var sendData=OAuth.CreateData(arr);
		axios({
			method:method,
			url:callUrl,
			headers:{
				'Content-Type':'application/x-www-form-urlencoded;encoding=utf-8',
				'Authorization': OAuth.GetHeader(arr, method, url, publickey, secretkey)
			},
			data:sendData
		}).then((res)=>{
			// console.log('get userinfo ok');
			callback(res.data);
		}).catch((err)=>{
			// console.log('get userinfo error!');
			console.log(err);
			errCallback(err);
		});
	},
	ReqBlock(id, publickey, secretkey, callback, errCallback){
		var url='https://api.twitter.com/1.1/blocks/create.json';
		var method='POST';
		var arr=[];
		arr['user_id']= id;
		var callUrl=OAuth.GetURL(url, method ,arr);
		var sendData=OAuth.CreateData(arr);
		axios({
			method:method,
			url:callUrl,
			headers:{
				'Content-Type':'application/x-www-form-urlencoded;encoding=utf-8',
				'Authorization': OAuth.GetHeader(arr, method, url, publickey, secretkey)
			},
			data:sendData
		}).then((res)=>{
			// console.log('get userinfo ok');
			callback(res.data);
		}).catch((err)=>{
			// console.log('get userinfo error!');
			console.log(err);
			errCallback(err);
		});
	},
	ReqUnBlock(screenName, publickey, secretkey, callback, errCallback){
		var url='https://api.twitter.com/1.1/blocks/destroy.json';
		var method='POST';
		var arr=[];
		arr['screen_name']= screenName;
		var callUrl=OAuth.GetURL(url, method ,arr);
		var sendData=OAuth.CreateData(arr);
		axios({
			method:method,
			url:callUrl,
			headers:{
				'Content-Type':'application/x-www-form-urlencoded;encoding=utf-8',
				'Authorization': OAuth.GetHeader(arr, method, url, publickey, secretkey)
			},
			data:sendData
		}).then((res)=>{
			// console.log('get userinfo ok');
			callback(res.data);
		}).catch((err)=>{
			// console.log('get userinfo error!');
			console.log(err);
			errCallback(err);
		});
	},
	ReqFollowerList(screenName, publickey, secretkey, callback, errCallback){
		var url='https://api.twitter.com/1.1/followers/list.json';
		var method='GET';
		var arr=[];
		arr['count']='200';
		arr['screen_name']= screenName;
		var callUrl=OAuth.GetURL(url, method ,arr);
		var sendData=OAuth.CreateData(arr);
		axios({
			method:method,
			url:callUrl,
			headers:{
				'Content-Type':'application/x-www-form-urlencoded;encoding=utf-8',
				'Authorization': OAuth.GetHeader(arr, method, url, publickey, secretkey)
			},
			data:sendData
		}).then((res)=>{
			// console.log('get userinfo ok');
			callback(res.data);
		}).catch((err)=>{
			// console.log('get userinfo error!');
			console.log(err);
			errCallback(err);
		});
	},
	ReqFollowingList(screenName, publickey, secretkey, callback, errCallback){
		var url='https://api.twitter.com/1.1/friends/list.json';
		var method='GET';
		var arr=[];
		arr['count']='200';
		arr['screen_name']= screenName;
		var callUrl=OAuth.GetURL(url, method ,arr);
		var sendData=OAuth.CreateData(arr);
		axios({
			method:method,
			url:callUrl,
			headers:{
				'Content-Type':'application/x-www-form-urlencoded;encoding=utf-8',
				'Authorization': OAuth.GetHeader(arr, method, url, publickey, secretkey)
			},
			data:sendData
		}).then((res)=>{
			// console.log('get userinfo ok');
			callback(res.data);
		}).catch((err)=>{
			// console.log('get userinfo error!');
			console.log(err);
			errCallback(err);
		});
	},
	ReqFollowingIds(cursor, screenName, publickey, secretkey, callback, errCallback){
		var url='https://api.twitter.com/1.1/friends/ids.json';
		var method='GET';
		var arr=[];
		arr['count']='5000';
		arr['screen_name']= screenName;
		arr['cursor']=cursor;
		var callUrl=OAuth.GetURL(url, method ,arr);
		var sendData=OAuth.CreateData(arr);
		axios({
			method:method,
			url:callUrl,
			headers:{
				'Content-Type':'application/x-www-form-urlencoded;encoding=utf-8',
				'Authorization': OAuth.GetHeader(arr, method, url, publickey, secretkey)
			},
			data:sendData
		}).then((res)=>{
			// console.log('get userinfo ok');
			callback(res.data);
		}).catch((err)=>{
			// console.log('get userinfo error!');
			console.log(err);
			errCallback(err);
		});
	},
	ReqFollowerIds(cursor, screenName, publickey, secretkey, callback, errCallback){
		var url='https://api.twitter.com/1.1/followers/ids.json';
		var method='GET';
		var arr=[];
		arr['count']='5000';
		arr['screen_name']= screenName;
		arr['cursor']=cursor;
		var callUrl=OAuth.GetURL(url, method ,arr);
		var sendData=OAuth.CreateData(arr);
		axios({
			method:method,
			url:callUrl,
			headers:{
				'Content-Type':'application/x-www-form-urlencoded;encoding=utf-8',
				'Authorization': OAuth.GetHeader(arr, method, url, publickey, secretkey)
			},
			data:sendData
		}).then((res)=>{
			// console.log('get userinfo ok');
			callback(res.data);
		}).catch((err)=>{
			// console.log('get userinfo error!');
			console.log(err);
			errCallback(err);
		});
	},
}