import { ipc } from './preloads/preload';
declare global {
  interface Window {
    ipc: typeof ipc;
  }
}
