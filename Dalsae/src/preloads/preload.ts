import { remote } from 'electron';
export interface Preload {
  // asdf: () => void;
  asdf2: () => void;
  asdf3: () => void;
  asdf4: () => void;
}

class PreloadImpl implements Preload {
  //  constructor() {
  //   type PreloadWindow = typeof window & { preload: PreloadImpl };
  //   (window as PreloadWindow).preload = new PreloadImpl();
  // }
  // private static _instence: PreloadImpl;
  // static Instence() {
  //   if (!this._instence) {
  //   }
  // }
  ClickLink() {
    console.log('asdfasdf');
    const v = new remote.BrowserWindow({
      show: false,
      webPreferences: {
        // Use pluginOptions.nodeIntegration, leave this alone
        // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
        nodeIntegration: !!process.env.ELECTRON_NODE_INTEGRATION
        // preload: path.join(__dirname, 'preload')
      }
    });
    // router.push()
    // v.loadURL(URL.format());
    v.loadURL(`${process.env.WEBPACK_DEV_SERVER_URL as string}/test`);
    v.webContents.openDevTools();
    v.on('ready-to-show', () => {
      console.log('show!');
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
}

type PreloadWindow = typeof window & { preload: PreloadImpl };
(window as PreloadWindow).preload = new PreloadImpl();

// export default new PreloadImpl();

//axios

// (window as any).asdf = () => {
//   console.log('happy birthday');
// };

// (window as any).create = () => {
//   const v = new remote.BrowserWindow();
//   v.show();
// };
