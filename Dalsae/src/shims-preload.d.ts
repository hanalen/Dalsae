import PreloadImpl from './preloads/preload';

declare global {
  interface Window {
    preload: PreloadImpl;
  }
}
