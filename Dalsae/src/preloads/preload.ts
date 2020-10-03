import { BrowserWindow, remote } from 'electron';
// export interface Preload {
//   // asdf: () => void;
//   asdf2: () => void;
//   asdf3: () => void;
//   asdf4: () => void;
// }
import Log from 'electron-log';
import path from 'path';

export default class Preload {
  // constructor() {
  //   type PreloadWindow = typeof window & { preload: PreloadImpl };
  //   (window as PreloadWindow).preload = new PreloadImpl();
  // }
  // private static _instence: PreloadImpl;
  // static Instence() {
  //   if (!this._instence) {
  //   }
  // }
  listWindow: BrowserWindow[] = [];
  ClickLink() {
    console.log('asdfasdf');
    const v = new remote.BrowserWindow({
      show: false,
      title: 'image-test',
      webPreferences: {
        // Use pluginOptions.nodeIntegration, leave this alone
        // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
        nodeIntegration: !!process.env.ELECTRON_NODE_INTEGRATION,
        preload: path.join(__dirname, 'preload')
      }
    });
    // router.push()
    // v.loadURL(URL.format());
    console.log(`${process.env.WEBPACK_DEV_SERVER_URL as string}test`);
    v.loadURL(`${process.env.WEBPACK_DEV_SERVER_URL as string}test`);
    v.webContents.openDevTools();
    this.listWindow.push(v);
    console.log(this.listWindow);
    v.on('ready-to-show', () => {
      console.log('show!');
      // remote.ipcRenderer.send('Image', 'test');
      // console.log(ipcRenderer);
      // ipcRenderer.send('Image', 'test');
      v.show();
    });
  }
  asdf2() {
    console.log('asdfasdf');
  }
  asdf3() {
    console.log('asdfasdf');
  }
  asdf4() {
    console.log('asdfasdf');
  }

  GetData() {
    Log.info('get data'); //testwindow의 preload랑 다른 object!
    if (this.listWindow.length === 0) return;
    const win = this.listWindow[0];
    Log.info(this.listWindow[0]);
    Log.info(win.title);
    this.listWindow.splice(0, 1);
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
