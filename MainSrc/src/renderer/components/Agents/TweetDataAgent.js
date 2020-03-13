export default{
	GetTweetIndex(tweet, listTweet){
		var index=0;
		for(var i=0;i<listTweet.length;i++){
			var nTweet = listTweet[i];  
			index=i;
			var nowTweetTime = new Date(nTweet.created_at);
			var newTweetTime = new Date(tweet.created_at)
			if(nowTweetTime > newTweetTime){
				index--;//splice때문에--해야 index가 맞음
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
		var id = hashBlock[tweet.orgUser.id_str];
		if(id)
			return true;
		else
			return false;
	},
	CheckMute(tweet, muteOption){
		tweet.isMuted=false;
		for(var i =0;i<muteOption.keyword.length;i++){//키워드 뮤트
			if(tweet.orgTweet.full_text.toLowerCase().indexOf(muteOption.keyword[i].toLowerCase())>-1){
				tweet.isMuted=true;
				return true;
			}
		}
		for(var i=0;i<muteOption.user.length;i++){//유저 뮤트
			if(tweet.orgUser.screen_name==muteOption.user[i]){
				return true;
			}
			var listMention=tweet.orgTweet.entities.user_mentions;
			for(var j=0;j<listMention;j++){
				if(listMention[j].screen_name==muteOption.user[i]){
				return true;
				}
			}
		}
		for(var i=0;i<muteOption.tweet.length;i++){//트윗 뮤트
			if(tweet.orgTweet.id_str==muteOption.tweet.id_str){
				return true;
			}
		}
		return false;
	},
	CheckHighlight(tweet, muteOption, myScreenName){//알림 설정 및 자신이 포함된 트윗일 경우 true
		try{
			for(var i=0;i<muteOption.highlight.length;i++){
				if(tweet.orgTweet.full_text.toLowerCase().indexOf(muteOption.highlight[i].toLowerCase())>-1){
					console.log('high!')
					return true;
				}
			}
			var listMention=tweet.orgTweet.entities.user_mentions;//멘션에 내가 포함된 여부 체크
			for(var i=0;i<listMention.length;i++){
				if(listMention[i].screen_name==myScreenName){
					console.log('high!')
					return true;
				}
			}
		}
		catch(e){
			console.log('err high')
			console.log(tweet);
			console.log(muteOption)
		}
		
		return false;
	},
	CheckIsMe(tweet, id_str){
	}
}