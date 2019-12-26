
var OAuth=
{
	OAuthConsumerKey:APIKeys.ConsumerKey,
	OAuthConsumerSecret:APIKeys.ConsumerSecretKey,
	OAuthSignatureMethod:'HMAC-SHA1',
	OAuthSignature:'',
	OAuthVersion:'1.0',
	OAuthTimestamp:'',
	oauth_callback:'oob',
	OAuthNonce:'',
	OAuthToken:'',
	UserSecretKey:'',
}

var encoding = require("encoding");
import APIKeys from './APIKey.js'


function GetTimestamp(){
	return Math.floor(Date.now() / 1000).toString();//timestamp용 계산

}

function GetOAuthNonce(){
	var tick= (Date.now()*10000)+62135596800;//원소스
	
	return StringToBase64(tick);
}

function StringToBase64(str){//string to base64
	str = str.toString();
	return btoa(String.fromCharCode.apply(null, new Uint8Array(new Buffer(str, "ascii"))));
}

function ReqHome(){
	console.log('req home');
	// OAuthRefresh();
}

function CalcSignature(arr, param, method, url, secretKey){
	var timestamp = GetTimestamp();
	var nonce = GetOAuthNonce();
	arr['oauth_timestamp']= timestamp;
	arr['oauth_nonce']= nonce;

	// var arr=[];
	// arr['oauth_version']= '1.0';
	// arr['oauth_consumer_key']= Keys.ConsumerKey;
	// arr['oauth_signature_method']= 'HMAC-SHA1';
	// arr['oauth_token']= publicKey;
	// console.log('calc signature arr')
	// console.log(arr)
	// console.log('----')
	Object.keys(param).forEach(function(key){
		arr[key]=param[key];
	});

	var keys=Object.keys(arr).sort();

	var str='';
	keys.forEach(function(item){
		if(arr[item]==undefined || arr[item]=='') return true;
		str += item+'=';
		str +=CalcParamUri(arr[item]);
		str+='&';
	});

	str = str.substring(0, str.length - 1 );//마지막& 지우기
	console.log('str: '+str);
	var baseStr=CalcBaseString(method, url, str);

	//Keys.ConsumerSecretKey
	var singKey = APIKeys.ConsumerSecretKey+'&';
	if(secretKey!=undefined){
		singKey += secretKey;//맨 뒤에건 유저 priv key
	}
	// console.log('snkey: '+singKey)
	var hmacsha1 = require('hmacsha1');
	var hash = hmacsha1(singKey, baseStr);

	arr['oauth_signature']=hash;
	// console.log(arr);
	return arr;
	// return hash;
}

function CalcBaseString(method, url, paramStr){
	return method+'&'+CalcParamUri(url)+'&'+CalcParamUri(paramStr);
}

function CalcParamUri(text){
	var str=''
	var limit = 100;
	if(text==undefined)
		return str;
	if (text.Length > limit)//media등은 길어서 나눠서 해야됨
	{
		var loops = text.Length / limit;
		var i=0;
		for (i = 0; i <= loops; i++)
		{
			if (i < loops)
			{
				str+=encodeURIComponent(text.Substring(100 * i, limit));
			}
			else
			{
				str+=encodeURIComponent(text.Substring(limit * i));
			}
		}
	}
	else
	{
		str+=encodeURIComponent(text);
	}
	str = str.replace(/!/g, '%21');//!가 인코딩 안 되는 문제가 있다람쥐썬더!!!!!
	return str;
}


export default{
	GetURL(url, method, arr){
		if(method=='POST'){
			return url;
		}
		else if(method=='GET'){
			var keys=Object.keys(arr).sort();

			var str=url+'?';
			keys.forEach(function(item){
				if(arr[item]==undefined || arr[item]=='') return true;
				str += item+'=';
				str +=encodeURIComponent(arr[item]);
				str+='&';
			});
			
			return str.substring(0, str.length - 1 );//마지막& 지우기
		}
	},
	CreateData(params){
		var keys=Object.keys(params).sort();

		var str='';
		keys.forEach(function(item){
			if(params[item]==undefined || params[item]=='') return true;
			str += item+'=';
			str +=encodeURIComponent(params[item]);
			str+='&';
		});
		str+='&';
		str = str.replace(/!/g, '%21');
		return str.substring(0, str.length - 1 );//마지막& 지우기
	},
	UpdateToken(publicKey, secretKey){
		OAuth.OAuthToken=publicKey;
		OAuth.UserSecretKey=secretKey;
	},
	Req(){
		OAuthRefresh();
	},

	GetToken(){
		
	},
	GetHeader(param, method, url, publicKey, secretKey){
		var arr=[];
		arr['oauth_version']= '1.0';
		arr['oauth_consumer_key']= APIKeys.ConsumerKey;//APIKeys.ConsumerKey;
		// arr['oauth_timestamp']= timestamp;
		// arr['oauth_nonce']= nonce;
		arr['oauth_signature_method']= 'HMAC-SHA1';
		arr['oauth_token']= publicKey;

		var arr2 = CalcSignature(arr, param, method, url, secretKey);

		Object.keys(param).forEach(function(key){
			arr[key]=param[key];
		});

		var keys=Object.keys(arr);

		var str='OAuth ';
		keys.forEach(function(item){
			if(arr[item]==undefined || arr[item]=='') return true;
			str += item+'=';
			str +='"'+CalcParamUri(arr[item])+'"';
			str+=',';
		});
		
		// var keys2=Object.keys(arr2);//파라메터 키!!!
		// str+=' oauth_callback="oob"';

		str = str.substring(0, str.length - 1 );//마지막, 지우기
		console.log('header: '+str);
		return str;
	},
}