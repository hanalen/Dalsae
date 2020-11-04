import { remote, ipcRenderer } from 'electron';
import Log from 'electron-log';
import path from 'path';
let ipcName = Math.random() * (99999 - 0) + 0;
import ImagePreload from './ImagePreload';
export default class Preload {
  image: ImagePreload = new ImagePreload();
  ClickLink() {
    ipcName = Math.random() * (99999 - 0) + 0;
    console.log('asdfasdf');
    const v = new remote.BrowserWindow({
      show: true,
      title: 'image-test',
      webPreferences: {
        // Use pluginOptions.nodeIntegration, leave this alone
        // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
        webSecurity: false,
        nodeIntegration: !!process.env.ELECTRON_NODE_INTEGRATION,
        preload: path.join(__dirname, 'preload')
      }
    });
    console.log(`${process.env.WEBPACK_DEV_SERVER_URL as string}test`);
    v.loadURL(`${process.env.WEBPACK_DEV_SERVER_URL as string}test?userid=${ipcName}`);
    v.webContents.openDevTools();
    ipcRenderer.send('AddChannel', { name: ipcName, value: 'value is ' + ipcName });
    v.on('ready-to-show', () => {
      //show: true일 경우 호출 안 됨
      Log.info('ready to show');
      v.show();
    });
  }

  GetData(userid: any): string {
    //remote.ipcrenderer은 null로 나온다
    Log.info('--------------');
    Log.info('get data'); //testwindow의 preload랑 다른 object!
    Log.info(userid);
    // Log.info(ipcRenderer);
    const v = ipcRenderer.sendSync(userid);
    Log.info('--------------');
    Log.info('synced ipc renderer');
    Log.info(v);
    return v;
  }
}

type PreloadWindow = typeof window & { preload: Preload };
(window as PreloadWindow).preload = new Preload();
