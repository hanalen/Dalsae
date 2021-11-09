/* eslint-disable @typescript-eslint/camelcase */
import * as I from '@/Interfaces';
import { ESystemBar, ETweetType } from '@/store/Interface';
import { moduleSysbar } from '@/store/modules/SystemBarStore';
import { moduleTweet } from '@/store/modules/TweetStore';
import axios from 'axios';
import { CreateHeader } from './TwitterRequest';
export class UserStreaming {
  private idStr = '';
  private reader!: ReadableStreamDefaultReader<Uint8Array>;
  private decoder = new TextDecoder();
  private json = '';
  private controller!: AbortController;
  private signal!: AbortSignal;
  async Connect(publicKey: string, secretKey: string, idStr: string) {
    this.idStr = idStr;
    this.controller = new AbortController();
    this.signal = this.controller.signal;

    const oauth: I.OAuth = new I.OAuth();
    oauth.SetKey(publicKey, secretKey);

    const method = 'GET';
    const orgUrl = 'https://userstream.twitter.com/1.1/user.json';
    const url = 'http://127.0.0.1:8811/userstream.twitter.com/1.1/user.json';
    fetch(url, {
      method: method,
      headers: CreateHeader(oauth.GetHeader(undefined, method, orgUrl)),
      signal: this.signal
    })
      .then((resp: Response) => {
        this.SteamingResponse.bind(this);
        this.SteamingResponse(resp);
      })
      .catch((err: Error) => {
        this.SteamingResponse.bind(this);
        this.StreamingError(err);
      });
  }
  StopStreaming() {
    console.log('stop streaming!!!  id: ', this.idStr);
    this.controller.abort();
    moduleSysbar.RemoveSystemBar(ESystemBar.EStreaming);
    moduleSysbar.AddSystemBar({
      type: ESystemBar.EErrorStreaming,
      icon: 'mdi-sync-off',
      text: '',
      toolTip: '유저 스트리밍 호흡기 연결 해제 됨'
    });
  }
  private SteamingResponse(response: Response) {
    if (!response.body) return;
    this.reader = response.body.getReader();
    if (this.reader) {
      moduleSysbar.RemoveSystemBar(ESystemBar.EErrorStreaming);
      moduleSysbar.AddSystemBar({
        type: ESystemBar.EStreaming,
        icon: 'mdi-sync',
        text: '',
        toolTip: '유저 스트리밍 호흡기 연결 됨'
      });
    }
    return this.ReadStreaming();
  }
  private StreamingError(err: Error) {
    console.log('Streaming Error');
    console.error(err);
    this.StopStreaming();
    // setTimeout(() => {
    //   this.StartStreaming();
    // }, 3000);
  }
  private async ReadStreaming() {
    console.log('read streaming...');
    const result = await this.reader.read();
    this.AppendJson(result);
  }
  private AppendJson(result: ReadableStreamDefaultReadResult<any>) {
    const chunk = this.decoder.decode(result.value || new Uint8Array(), { stream: !result.done });
    if (chunk !== '\r\n') {
      //keep-alive 패킷이 아닌 게 들어 왔을 때에만 동작
      this.json += chunk;
      if (this.json.charAt(this.json.length - 1) == '\n') {
        //패킷의 마지막 문자는 \r\n, 완성 된 json일 경우에만 파싱 시도
        const listJson = this.json.split('\r\n'); //json 끝문자로 쪼개서 parse시도한다
        for (let i = 0; i < listJson.length; i++) {
          this.ParseJson(listJson[i]);
        }
        this.json = '';
      }
    }
    if (result.done) {
      return this.json;
    } else {
      return this.ReadStreaming();
    }
  }
  private ParseJson(json: string) {
    if (json.length < 10) return; //이상 패킷으로 예상 됨

    try {
      const tweet: I.Tweet = JSON.parse(json);
      if (tweet.id_str != undefined) {
        console.log(tweet);
        moduleTweet.AddTweet({
          tweet: tweet,
          user_id_str: this.idStr,
          type: ETweetType.E_HOME,
          listTweet: undefined
        });
      }
    } catch (ex) {
      console.log(
        '-------------------------------------------------------------------------------------------------------'
      );
      console.log(ex);
      console.log(json);
    }
  }
}
