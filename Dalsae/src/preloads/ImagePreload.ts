import { remote, ipcRenderer } from 'electron';
import Log from 'electron-log';
import path from 'path';
import * as I from '@/Interfaces';
export default class ImagePreload {
  OpenImageWindow(tweet: any, option: I.UIOption) {
    const ipcName = Math.random() * (99999 - 0) + 0;
    // Log.info('tweet id: ' + tweetId);
    const window = new remote.BrowserWindow({
      show: true,
      title: 'dalsae-image',
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
}
