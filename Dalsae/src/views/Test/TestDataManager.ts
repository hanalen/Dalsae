import TweetTestData from './TweetTestData.json';

export interface Option {
  bShow: boolean;
}

export interface Tweet {
  id: number;
  fullText: string;
  name: string;
  isFav: boolean;
}

export class DataManagerImpl {
  listTweet: Tweet[];
  option: Option;

  constructor() {
    this.listTweet = TweetTestData;
    this.option = {
      bShow: false
    };
  }
  public TweetAdd(tweet: Tweet) {
    console.log('called tweet add');
    console.log(tweet);
    this.listTweet.push(tweet);
    console.log(this.listTweet);
  }
}

const DataManager = new DataManagerImpl();
export { DataManager };
