export default{
	CreateResponsiveTweet(tweet){//vuex메모리 과부하를 방지하기 위해 동적 반응(watch)해야 할 변수만 할당 후 리턴 합니다.
		var obj=new Object();
		obj.isReaded=tweet.isReaded;
		obj.isDelete=tweet.isDelete;
		obj.isFocus=tweet.isFocus;
		obj.qtTweet=tweet.qtTweet;
		obj.id_str=tweet.id_str;
		obj.id=tweet.id;
		obj.full_text=tweet.full_text;
		obj.isMuted=tweet.isMuted;
		obj.created_at=tweet.created_at;
		obj.isHighlight=tweet.isHighlight;
		obj.isOdd=false;//odd, even 색상
		obj.orgTweet=new Object();
		obj.orgTweet.retweeted=tweet.orgTweet.retweeted;
		obj.orgTweet.favorited=tweet.orgTweet.favorited;
		return obj;
	},
	CreateNonResponsiveTweet(resTweet, tweet){//resTweet: 동적 변수 할당 된 트윗, tweet: 원본 트윗
		resTweet.orgTweet=tweet.orgTweet;
		resTweet.orgUser=tweet.orgUser;
		if(tweet.retweeted_status!=undefined){
			resTweet.user=tweet.user;
		}
		resTweet.user=tweet.user;
		resTweet.entities=tweet.entities;
		resTweet.id=tweet.id;
		resTweet.id_str=tweet.id_str;
		resTweet.retweeted_status=tweet.retweeted_status;
	},
	GetTweetIndex(tweet, listTweet){
		var index=0;
		for(var i=0;i<listTweet.length;i++){
			var nTweet = listTweet[i];  
			index=i;
			var nowTweetTime = new Date(nTweet.created_at).getTime();
      var newTweetTime = new Date(tweet.created_at).getTime();
			if(nowTweetTime < newTweetTime){
				index--;//splice때문에--해야 index가 맞음
				if(index<0)
					index=0;
				return index;
			}
		}
		return index;
	},
	TweetInit(tweet){
		var orgUser=undefined;
		var orgTweet=undefined;
		orgUser = tweet.retweeted_status==undefined ? tweet.user :tweet.retweeted_status.user;//리트윗, 원트윗 유저 선택
		orgTweet=tweet.retweeted_status==undefined? tweet : tweet.retweeted_status;//원본 트윗 저장
		tweet.orgUser=JSON.parse(JSON.stringify(orgUser));
		tweet.orgTweet=JSON.parse(JSON.stringify(orgTweet));
		tweet.orgTweet.id=tweet.orgTweet.id_str;
		tweet.id=tweet.id_str;
		tweet.isReaded=false;
		tweet.isDelete=false;
		tweet.isFocus=false;
		tweet.qtTweet=undefined;
		return tweet;
	},
  CheckBlock(tweet, hashBlock){//블락일 경우 return true
    if(tweet.orgTweet.is_quote_status && tweet.orgTweet.quoted_status==undefined) return true;//인용트윗이 있지만 object가 null일 경우 차단

    if(hashBlock==undefined) return;
    var ret=false;
    if(hashBlock.has(tweet.orgUser.id_str)){
      ret=true;
    }
    tweet.orgTweet.entities.user_mentions.forEach((id)=>{
      if(hashBlock.has(id)){
        ret=true;
      }
    })
    return ret;
	},
	CheckMute(tweet, muteOption, id_str){//자신의 트윗이면 뮤트하지 않음
		tweet.isMuted=false;
		if(tweet.orgUser.id_str==id_str){
			return false;
		}
		for(var i =0;i<muteOption.keyword.length;i++){//키워드 뮤트
			if(tweet.orgTweet.full_text.toLowerCase().indexOf(muteOption.keyword[i].toLowerCase())>-1){
				tweet.isMuted=true;
				return true;
			}
		}
		for(var i=0;i<muteOption.user.length;i++){//유저 뮤트
			if(tweet.orgUser.screen_name==muteOption.user[i]){
				tweet.isMuted=true;
				return true;
			}
			var listMention=tweet.orgTweet.entities.user_mentions;
			for(var j=0;j<listMention;j++){
				if(listMention[j].screen_name==muteOption.user[i]){
					tweet.isMuted=true;
					return true;
				}
			}
		}
		for(var i=0;i<muteOption.tweet.length;i++){//트윗 뮤트
			if(tweet.orgTweet.id_str==muteOption.tweet.id_str){
				tweet.isMuted=true;
				return true;
			}
		}
		return false;
	},
	CheckHighlight(tweet, muteOption, myScreenName){//알림 설정 및 자신이 포함된 트윗일 경우 true
		try{
			for(var i=0;i<muteOption.highlight.length;i++){
				if(tweet.orgTweet.full_text.toLowerCase().indexOf(muteOption.highlight[i].toLowerCase())>-1){
					// console.log('high!')
					return true;
				}
			}
			var listMention=tweet.orgTweet.entities.user_mentions;//멘션에 내가 포함된 여부 체크
			for(var i=0;i<listMention.length;i++){
				if(listMention[i].screen_name==myScreenName){
					// console.log('high!')
					return true;
				}
			}
		}
		catch(e){
			// console.log('err high')
			// console.log(tweet);
			// console.log(muteOption)
		}
		
		return false;
	},
	CheckIsMe(tweet, id_str){
	},
	ChangeOddEven(listTweet, index, tweet){
		if(listTweet.length==0) return;
		var isOdd= listTweet[index].isOdd;
		if(index==0){
			tweet.isOdd = !isOdd;
		}
		else{
			for(var i=index;i>-1;i--){
				listTweet[i].isOdd=isOdd;
				isOdd = !isOdd;
			}
		}
	}
}