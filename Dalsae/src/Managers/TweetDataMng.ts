import TweetTestData from './favorite_tweet.json';
import * as I from '@/Interfaces';
// import FileStream from 'fs-extra';

export interface Option {
  bShow: boolean;
}

export class TweetDataManagerImpl {
  listTweet: I.Tweet[] | unknown;

  constructor() {
    // const json = FileStream.readJsonSync('./favorite_tweet.json', { throws: false });
    // this.listTweet = JSON.parse(json);
    this.listTweet = TweetTestData as I.Tweet[] | unknown;
  }
  public TweetAdd(tweet: I.Tweet) {
    console.log('called tweet add');
    console.log(tweet);
    // if (this.listTweet) this.listTweet.push(tweet);
  }
}

const TweetDataManager = new TweetDataManagerImpl();
export { TweetDataManager };
