import axios from 'axios'
import OAuth from '../../OAuth.js'

async function Media(media, publickey, secretkey){
		var method='POST';
		var arr=[];
		
		const sendData = new FormData();
		sendData.append('media_data', media.split(',')[1]);
		var url='https://upload.twitter.com/1.1/media/upload.json';
		var callUrl=OAuth.GetURL(url, method ,arr);
		var ret=undefined;
		await axios({
			method:method,
			url:callUrl,
			headers:{
				'Content-Type':'multipart/form-data',
				'Authorization': OAuth.GetHeader(arr, method, url, publickey, secretkey)
			},
			data:sendData
		}).then((res)=>{
			// console.log('media ok');
			console.log(res);
			ret=res;
		}).catch((err)=>{
			// console.log('media error!');
			console.log(err);
		});
		return ret;
}

export default{
	async Tweet(tweetText, replyId, media, publickey, secretkey, callback){
		var method='POST';
		var arr=[];
		arr['status']=tweetText;
		arr['in_reply_to_status_id']=replyId;
		if(media!=undefined){
			var mediaStr='';
			for(var i=0;i<media.length;i++){
				var res = await Media(media[i], publickey, secretkey);
				if(res!=undefined){
					mediaStr+=res.data.media_id_string+',';//미디어 전송용
				}
			}
			arr['media_ids']=mediaStr;
		}

		var url='https://api.twitter.com/1.1/statuses/update.json';
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
			// console.log('retweet ok');
			callback(res.data);
		}).catch((err)=>{
			// console.log('send tweet error!');
			console.log(err);
		});
	},
	QTTweet(tweet, publickey, secretkey, callback, errCallback){
		var method='GET';
		var arr=[];
		arr['id']=tweet.orgTweet.quoted_status_id_str;
		arr['tweet_mode']='extended';
		var url='https://api.twitter.com/1.1/statuses/show.json';
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
			callback(res.data, tweet);
		}).catch((err)=>{
			// console.log('load qt error!');
			console.log(err);
			errCallback(err);
		});
	},
	Retweet(tweetId, publickey, secretkey, callback, errCallback){
		var method='POST';
		var arr=[];
		arr['id']=tweetId;

		var url='https://api.twitter.com/1.1/statuses/retweet/' + tweetId + '.json';
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
			// console.log('retweet ok');
			callback(res.data);
		}).catch((err)=>{
			// console.log('retweet error!');
			console.log(err);
			errCallback(err);
		});
	},
	UnRetweet(tweetId, publickey, secretkey, callback, errCallback){
		var method='POST';
		var arr=[];
		arr['id']=tweetId;

		var url='https://api.twitter.com/1.1/statuses/unretweet/' + tweetId + '.json';
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
			// console.log('un retweet ok');
			callback(res.data);
		}).catch((err)=>{
			// console.log('un retweet error!');
			console.log(err);
			errCallback(err);
		});
	},
	Favorite(tweetId, publickey, secretkey, callback){
		var method='POST';
		var arr=[];
		arr['id']=tweetId;
		
		var url='https://api.twitter.com/1.1/favorites/create.json';
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
			// console.log('fav ok');
			callback(res.data);
		}).catch((err)=>{
			// console.log('fav error!');
			console.log(err);
		});
	},
	UnFavorite(tweetId, publickey, secretkey, callback){
		var method='POST';
		var arr=[];
		arr['id']=tweetId;
		
		var url='https://api.twitter.com/1.1/favorites/destroy.json';
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
			// console.log('un fav ok');
			callback(res.data);
		}).catch((err)=>{
			// console.log('un fav error!');
			console.log(err);
		});
	},
	DeleteTweet(tweetId, publickey, secretkey, callback){
		var method='POST';
		var arr=[];
		arr['id']=tweetId;
		var url='https://api.twitter.com/1.1/statuses/destroy/'+tweetId+'.json';
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
			// console.log('delete tweet ok');
			callback(res.data);
		}).catch((err)=>{
			// console.log('delete tweet error!');
			console.log(err);
		});
	},
}