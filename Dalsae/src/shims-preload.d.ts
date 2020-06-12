import PreloadImpl from './preload';

declare global {
  interface Window {
    preload: PreloadImpl;
  }
}
