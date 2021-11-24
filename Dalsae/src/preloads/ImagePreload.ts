import { BrowserWindow, ipcRenderer } from 'electron';
import Log from 'electron-log';
import path from 'path';
import * as I from '@/Interfaces';
import fs from 'fs';
import Axios from 'axios';
import http from 'http';

function CheckFolder(path: string) {
  if (fs.existsSync(path) === false) {
    fs.mkdirSync(path);
  }
}
export const imagePreload = {
  DownloadImage(
    appPath: string,
    media: I.Media,
    index: number,
    callback: (index: number, percent: number, bError: boolean) => void
  ) {
    //progress show, hide 해야 함
    const path = appPath + '/Image/';
    CheckFolder(path);

    const url = media.media_url + ':orig';
    const fileName = media.media_url.substring(media.media_url.lastIndexOf('/'), 9999999999);
    const file = fs.createWriteStream(`${path}${fileName}`);

    http.get(url).on('response', function(res) {
      const header = res.headers['content-length'];
      let len = 0;
      if (header) {
        len = parseInt(header, 10);
      }
      let downloaded = 0;
      res
        .on('data', function(chunk) {
          file.write(chunk);
          downloaded += chunk.length;
          const percent = parseFloat(((100.0 * downloaded) / len).toFixed(2));
          callback(index, percent, false);
        })
        .on('end', function() {
          file.end();
          console.log('down ok~');
        })
        .on('error', function(err) {
          file.end();
          callback(index, 0, true);
          console.log('img down error!!!');
          console.log(err);
        });
    });
  },
  OpenImageWindow(tweet: I.Tweet, option: I.UIOption, switter: I.Switter) {
    const ipcName = tweet.id_str;
    const url = `${process.env.WEBPACK_DEV_SERVER_URL as string}ImageView?tweetId=${ipcName}`;
    ipcRenderer.send('OpenWindow', {
      url: url,
      title: 'dalsae-image',
      type: 'image',
      ipcName: ipcName
    });
    ipcRenderer.send('AddChannel', { name: `image_${ipcName}`, value: JSON.stringify(tweet) });
    ipcRenderer.send('AddChannel', { name: `option_${ipcName}`, value: JSON.stringify(option) });
    ipcRenderer.send('AddChannel', { name: `switter_${ipcName}`, value: JSON.stringify(switter) });
  },
  GetTweet(tweetId: string) {
    const tweet = ipcRenderer.sendSync('image_' + tweetId);
    return tweet;
  },
  GetOption(tweetId: string) {
    const option = ipcRenderer.sendSync('option_' + tweetId);
    return option;
  },
  GetSwitter(tweetId: string) {
    const switter = ipcRenderer.sendSync('switter_' + tweetId);
    return switter;
  }
};
