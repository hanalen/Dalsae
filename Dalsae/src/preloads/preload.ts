import { remote } from 'electron';
export interface Preload {
  asdf: () => void;
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
  asdf() {
    console.log('asdfasdf');
    const v = new remote.BrowserWindow();
    v.show();
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
