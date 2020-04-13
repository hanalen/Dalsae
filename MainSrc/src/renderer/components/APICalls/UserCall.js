function GetHeader(vuex, param){
	OAuth.GetHeader(param.param, param.method, param.url);
}

import axios from 'axios'
import OAuth from '../../OAuth.js'

export default{
	ReqUserInfo(callback, publickey, secretkey){
		// console.log('get userinfo call')
		var url='https://api.twitter.com/1.1/account/verify_credentials.json';
		var method='GET';
		var arr=[];
		axios({
			method:method,
			url:url,
			headers:{
				'Content-Type':'application/x-www-form-urlencoded;encoding=utf-8',
				'Authorization': OAuth.GetHeader(arr, method, url, publickey, secretkey)
			},
		}).then((res)=>{
			// console.log('get userinfo ok');
			callback(res.data);
		}).catch((err)=>{
			// console.log('get userinfo error!');
			console.log(err);
		});
	},
	ReqHome(maxId, sinceId, publickey, secretkey, callback){
		var method='GET';
		var arr=[];
		arr['count']= '40';
		arr['tweet_mode']='extended';
		arr['max_id']=maxId;
		arr['since_id']=sinceId;
		var url = 'https://api.twitter.com/1.1/statuses/home_timeline.json'
		var callUrl=OAuth.GetURL(url, method ,arr);
		axios({
			method:method,
			url:callUrl,
			headers:{
				'Content-Type':'application/x-www-form-urlencoded;encoding=utf-8',
				// 'Access-Control-Allow-Origin':'*',
				'Authorization': OAuth.GetHeader(arr, method, url, publickey, secretkey)
			},
		}).then((res)=>{
			// console.log(res);
			callback(res.data);
		}).catch((err)=>{
			// console.log('get home error!');
			console.log(err);
		});
	},
	ReqMention(maxId, sinceId, publickey, secretkey, callback){
		var method='GET';
		var arr=[];
		arr['count']= '40';
		arr['tweet_mode']='extended';
		// arr['max_id']=((maxId== undefined || maxId==0) ? 0 : maxId);
		// arr['since_id']=((sinceId== undefined || sinceId==0) ? 0 : sinceId);
		var url = 'https://api.twitter.com/1.1/statuses/mentions_timeline.json';
		var callurl= OAuth.GetURL(url, method, arr);
		// console.log('url: '+url)
		axios({
			method:method,
			url:callurl,
			headers:{
				'Content-Type':'application/x-www-form-urlencoded;encoding=utf-8',
				'Authorization': OAuth.GetHeader(arr, method, url, publickey, secretkey)
			},
		}).then((res)=>{
			callback(res.data);
		}).catch((err)=>{
			// console.log('get mention error!');
			console.log(err);
		});
	},
	ReqFavorite(maxId, sinceId, publickey, secretkey, callback){
		var method='GET';
		var arr=[];
		arr['count']= '200';
		arr['tweet_mode']='extended';
		arr['max_id']=maxId;
		arr['since_id']=sinceId;
		var url = 'https://api.twitter.com/1.1/favorites/list.json'
		var callUrl=OAuth.GetURL(url, method ,arr);
		axios({
			method:method,
			url:callUrl,
			headers:{
				'Content-Type':'application/x-www-form-urlencoded;encoding=utf-8',
				// 'Access-Control-Allow-Origin':'*',
				'Authorization': OAuth.GetHeader(arr, method, url, publickey, secretkey)
			},
		}).then((res)=>{
			// console.log(res);
			callback(res.data);
		}).catch((err)=>{
			// console.log('get home error!');
			console.log(err);
		});
  },
  ReqUser(screenName, sinceID, publickey, secretkey, callback){
    var method='GET';
		var arr=[];
		arr['count']= '200';
		arr['tweet_mode']='extended';
		arr['screen_name']=screenName;
		arr['since_id']=sinceID;
    var url = 'https://api.twitter.com/1.1/statuses/user_timeline.json'
		var callUrl=OAuth.GetURL(url, method ,arr);
		axios({
			method:method,
			url:callUrl,
			headers:{
				'Content-Type':'application/x-www-form-urlencoded;encoding=utf-8',
				// 'Access-Control-Allow-Origin':'*',
				'Authorization': OAuth.GetHeader(arr, method, url, publickey, secretkey)
			},
		}).then((res)=>{
			// console.log(res);
			callback(res.data);
		}).catch((err)=>{
			// console.log('get home error!');
			console.log(err);
		});
  },
	ReqDaehwa(tweetid, publickey, secretkey, callback, errCallback){
		var method='GET';
		var arr=[];
		arr['id']=tweetid;
		arr['tweet_mode']='extended'
		var url = 'https://api.twitter.com/1.1/statuses/show.json';
		var callurl= OAuth.GetURL(url, method, arr);
		
		axios({
			method:method,
			url:callurl,
			headers:{
				'Content-Type':'application/x-www-form-urlencoded;encoding=utf-8',
				'Authorization': OAuth.GetHeader(arr, method, url, publickey, secretkey)
			},
		}).then((res)=>{
			callback(res.data);
		}).catch((err)=>{
			// console.log('load daehwa  error!');
			console.log(err);
			errCallback(err);
		});
	},
	FollowingList(userid, cursor, screenName, publickey, secretkey, callback, errCallback){
		var method='GET';
		var arr=[];
		arr['user_id']=userid;
		if(screenName!=undefined || screenName!='')
		arr['screen_name']=screenName;
		if(cursor>0){
			arr['cursor']=cursor;
		}
		arr['count']=200;//max 200
		var url = 'https://api.twitter.com/1.1/friends/list.json';
		var callurl= OAuth.GetURL(url, method, arr);
		console.log('url: '+url)
		axios({
			method:method,
			url:callurl,
			headers:{
				'Content-Type':'application/x-www-form-urlencoded;encoding=utf-8',
				'Authorization': OAuth.GetHeader(arr, method, url, publickey, secretkey)
			},
		}).then((res)=>{
			callback(res.data);
		}).catch((err)=>{
			// console.log('get following list error!');
			console.log(err);
			errCallback(err, cursor);//리밋일 경우에 대비 해서 cursor도 같이 에러 콜백
		});
	},
	FollowerList(userid, cursor, screenName, publickey, secretkey, callback, errCallback){
		var method='GET';
		var arr=[];
		arr['user_id']=userid;
		if(screenName!=undefined || screenName!='')
		arr['screen_name']=screenName;
		if(cursor>0){
			arr['cursor']=cursor;
		}
		arr['count']=200;//max 200
		var url = 'https://api.twitter.com/1.1/followers/list.json';
		var callurl= OAuth.GetURL(url, method, arr);
		// console.log('url: '+url)
		axios({
			method:method,
			url:callurl,
			headers:{
				'Content-Type':'application/x-www-form-urlencoded;encoding=utf-8',
				'Authorization': OAuth.GetHeader(arr, method, url, publickey, secretkey)
			},
		}).then((res)=>{
			callback(res.data);
		}).catch((err)=>{
			// console.log('get follower list error!');
			console.log(err);
			errCallback(err, cursor);//리밋일 경우에 대비 해서 cursor도 같이 에러 콜백
		});
	},
}