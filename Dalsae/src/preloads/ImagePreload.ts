import { remote, ipcRenderer } from 'electron';
import Log from 'electron-log';
import path from 'path';
import * as I from '@/Interfaces';
import http from 'http';
import fs from 'fs';
import Axios from 'axios';
export default class ImagePreload {
  OpenImageWindow(tweet: any, option: I.UIOption) {
    const ipcName = Math.random() * (99999 - 0) + 0;
    // Log.info('tweet id: ' + tweetId);
    const window = new remote.BrowserWindow({
      show: true,
      title: 'dalsae-image',
      width: 1900,
      height: 1200,
      webPreferences: {
        webSecurity: false,
        nodeIntegration: !!process.env.ELECTRON_NODE_INTEGRATION,
        enableRemoteModule: true,
        preload: path.join(__dirname, 'preload')
      }
    });
    window.loadURL(`${process.env.WEBPACK_DEV_SERVER_URL as string}ImageView?tweetId=${ipcName}`);
    window.webContents.openDevTools();
    ipcRenderer.send('AddChannel', { name: `image_${ipcName}`, value: JSON.stringify(tweet) });
    ipcRenderer.send('AddChannel', { name: `option_${ipcName}`, value: JSON.stringify(option) });
  }

  GetTweet(tweetId: string) {
    const tweet = ipcRenderer.sendSync('image_' + tweetId);
    return tweet;
  }

  GetOption(tweetId: string) {
    const option = ipcRenderer.sendSync('option_' + tweetId);
    return option;
  }

  DownloadImage(media: I.Media, callback: (percent: number) => void) {
    //progress show, hide 해야 함
    const url = media.media_url + ':orig';
    const fileName = media.media_url.substring(media.media_url.lastIndexOf('/'), 9999999999);
    const file = fs.createWriteStream('Data/Image/' + fileName);
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
          callback(percent);
        })
        .on('end', function() {
          file.end();
          console.log('down ok~');
        })
        .on('error', function(err) {
          file.end();
          console.log('img down error!!!');
          console.log(err);
        });
    });
  }
}
