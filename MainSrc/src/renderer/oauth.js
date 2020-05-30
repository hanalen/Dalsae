
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

//웹으로 보낼 때 oauth, url 퍼센트 인코딩으로 바꿔야 한다. 
//encodeURIComponent 이 함수를 쓰긴 쓰는데 !, (, ), * 이 인코딩이 되지 않는다. 그래서 해당 문자 4개를 인코딩 해준다.
//get, post 치환 문자가 다르긴 하지만 어차피 문자 있는 건 post만 보내게 된다
//https://stackoverflow.com/questions/13060034/what-is-correct-oauth-percent-encoding
function UrlEncode(value, isOAuth){
	if(value==undefined || value=='') return value;
	if(typeof value!='string') return value;
	let ret=value;
	ret = ret.replace(/!/gi, '%21');
	ret = ret.replace(/\(/gi, '%28');
	ret = ret.replace(/\)/gi, '%29');
	ret = ret.replace(/\*/gi, '%2A');
	ret = ret.replace(/\'/gi, '%27');
	return ret;
}

function CalcSignature(arr, param, method, url, secretKey){
	var timestamp = GetTimestamp();
	var nonce = GetOAuthNonce();
	arr['oauth_timestamp']= timestamp;
	arr['oauth_nonce']= nonce;

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
	var baseStr=CalcBaseString(method, url, str);

	var singKey = APIKeys.ConsumerSecretKey+'&';
	if(secretKey!=undefined){
		singKey += secretKey;//맨 뒤에건 유저 priv key
	}
	var hmacsha1 = require('hmacsha1');
	var hash = hmacsha1(singKey, baseStr);

	arr['oauth_signature']=hash;
	return arr;
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
	str = UrlEncode(str)
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
			str += CalcParamUri(params[item]);
			str+='&';
		});
		str+='&';
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
		arr['oauth_consumer_key']= APIKeys.ConsumerKey;
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
		
		str = str.substring(0, str.length - 1 );//마지막, 지우기
		return str;
	},
}