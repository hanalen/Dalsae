import axios from 'axios'
import OAuth from '../../OAuth.js'

export default{
	DMList(cursor, publickey, secretkey, callback, errCallback){
		var method='GET';
		var arr=[];
		arr['count']='50';
		arr['cursor']=cursor;
		var url='https://api.twitter.com/1.1/direct_messages/events/list.json';
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
			// console.log('dm list ok~')
			// console.log(res)
			callback(res.data);
		}).catch((err)=>{
			console.log('dm list err!');
			console.log(err)
			errCallback(err);
		});
	},
	DMShow(id, publickey, secretkey, callback, errCallback){
		var method='GET';
		var arr=[];
		arr['id']=id;
		var url='https://api.twitter.com/1.1/direct_messages/events/show.json';
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
			// console.log('dm show ok~')
			// console.log(res)
			callback(res.data);
		}).catch((err)=>{
			console.log('dm list err!');
			console.log(err)
			errCallback(err);
		});
	},
}