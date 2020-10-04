import { remote, ipcRenderer } from 'electron';
import Log from 'electron-log';
import path from 'path';

export default class ImagePreload {
  OpenImageWindow(tweetId: string, tweet: any) {
    Log.info('tweet id: ' + tweetId);
    const window = new remote.BrowserWindow({
      show: true,
      title: 'dalsae-image',
      webPreferences: {
        nodeIntegration: !!process.env.ELECTRON_NODE_INTEGRATION,
        preload: path.join(__dirname, 'preload')
      }
    });
    window.loadURL(`${process.env.WEBPACK_DEV_SERVER_URL as string}Image?tweetId=${tweetId}`);
    window.webContents.openDevTools();
    ipcRenderer.send('AddChannel', { name: `image_${tweetId}`, value: JSON.stringify(tweet) });
  }

  GetTweet(tweetId: string) {
    const tweet = ipcRenderer.sendSync('image_' + tweetId);
    return tweet;
  }
}
