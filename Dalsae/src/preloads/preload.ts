import { remote, ipcRenderer } from 'electron';
import Log from 'electron-log';
import path from 'path';
const ipcName = '123';

export default class Preload {
  ClickLink() {
    console.log('asdfasdf');
    const v = new remote.BrowserWindow({
      show: true,
      title: 'image-test',
      webPreferences: {
        // Use pluginOptions.nodeIntegration, leave this alone
        // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
        nodeIntegration: !!process.env.ELECTRON_NODE_INTEGRATION,
        preload: path.join(__dirname, 'preload')
      }
    });
    console.log(`${process.env.WEBPACK_DEV_SERVER_URL as string}test`);
    v.loadURL(`${process.env.WEBPACK_DEV_SERVER_URL as string}test?userid=${ipcName}`);
    v.webContents.openDevTools();
    ipcRenderer.send('AddChannel', { name: ipcName, value: 'value testttt' });
    v.on('ready-to-show', () => {
      //show: true일 경우 호출 안 됨
      Log.info('ready to show');
      v.show();
    });
  }

  GetData(userid: any) {
    //remote.ipcrenderer은 null로 나온다
    Log.info('--------------');
    Log.info('get data'); //testwindow의 preload랑 다른 object!
    Log.info(userid);
    // Log.info(ipcRenderer);
    const v = ipcRenderer.sendSync(userid);
    Log.info('--------------');
    Log.info('synced ipc renderer');
    Log.info(v);
  }
}

type PreloadWindow = typeof window & { preload: Preload };
(window as PreloadWindow).preload = new Preload();

// export default new PreloadImpl();

//axios

// (window as any).asdf = () => {
//   console.log('happy birthday');
// };

// (window as any).create = () => {
//   const v = new remote.BrowserWindow();
//   v.show();
// };
