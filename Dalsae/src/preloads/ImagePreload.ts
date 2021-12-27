import { BrowserWindow, ipcRenderer } from 'electron';
import Log from 'electron-log';
import path from 'path';
import * as I from '@/Interfaces';
import fs from 'fs';
import Axios from 'axios';
import http from 'http';
import { EIPcType } from '@/mixins';
import * as Sentry from '@sentry/vue';
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
          Sentry.captureMessage('image ok');
        })
        .on('error', function(err) {
          file.end();
          callback(index, 0, true);
          Sentry.captureException(err);
        });
    });
  },
  OpenImageWindow(tweet: I.Tweet, option: I.UIOption, switter: I.Switter) {
    const ipcName = tweet.id.toString();
    const url = `/ImageView?tweetId=${ipcName}`;
    ipcRenderer.send('OpenWindow', {
      url: url,
      title: 'dalsae-image',
      type: 'image',
      ipcName: ipcName
    });
    ipcRenderer.send('RegisterData', { name: `switter_${ipcName}`, data: switter });
    ipcRenderer.send('RegisterData', { name: `option_${ipcName}`, data: option });
    ipcRenderer.send('RegisterData', { name: `tweet_${ipcName}`, data: tweet });
  }
};
