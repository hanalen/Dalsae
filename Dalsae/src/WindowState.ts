import fs from 'fs-extra';
import { app, BrowserWindow, Display, screen } from 'electron';
import Log from 'electron-log';

interface OptionWindowState {
  defaultWidth: number;
  defaultHeight: number;
  fileName: string;
  defaultX?: number;
  defaultY?: number;
}

interface WindowState {
  x: number;
  y: number;
  width: number;
  height: number;
  manageWindow?: (window: BrowserWindow | undefined) => void;
}

interface Config {
  state: WindowState;
  fileName: string;
}
const config: Config = { state: { height: 800, width: 600, x: 0, y: 0 }, fileName: '' };
const defaultConfig: WindowState = { height: 800, width: 600, x: 0, y: 0 };

function SaveState(window: BrowserWindow | undefined | null, name: string) {
  if (!window) return;
  const { x, y, width, height } = window.getBounds();
  const state: WindowState = { x: x, y: y, width: width, height: height };
  try {
    const json = JSON.stringify(state);
    fs.writeFileSync(`${app.getPath('userData')}/${name}`, json);
  } catch (e) {}
}

function ReadState(fileName: string): WindowState | undefined {
  try {
    return fs.readJSONSync(`${app.getPath('userData')}/${fileName}`) as WindowState;
  } catch (e) {
    return undefined;
  }
}

function WindowAddEventListener(window: BrowserWindow) {
  if (!window) return;
  window.on('close', (event: Event) => {
    if (!window.isVisible()) SaveState(window, config.fileName);
  });
  window.on('resized', (event: Event) => {
    SaveState(window, config.fileName);
  });
  window.on('moved', (event: Event) => {
    SaveState(window, config.fileName);
  });
}

function ManageWindow(window: BrowserWindow | undefined) {
  if (window) WindowAddEventListener(window);
}

function SetDefaultState(option: OptionWindowState) {
  defaultConfig.width = option.defaultWidth;
  defaultConfig.height = option.defaultHeight;
  defaultConfig.x = option.defaultX ? option.defaultX : 0;
  defaultConfig.y = option.defaultY ? option.defaultY : 0;
  defaultConfig.manageWindow = ManageWindow;
  config.state = defaultConfig;
}

function CheckBound(state: WindowState | undefined, display: Display) {
  if (!state) return false;
  const { x, y, width, height } = display.bounds;
  return (
    state.y >= y &&
    state.y - 100 <= y + height &&
    x <= state.x + state.width - 100 &&
    x + width >= state.x - 100
  );
}
export default function windowState(option: OptionWindowState): WindowState {
  const { fileName } = { ...option };
  SetDefaultState(option);
  config.fileName = option.fileName;

  const state: WindowState | undefined = ReadState(fileName);
  if (!state) return defaultConfig;

  const isInScreen = screen.getAllDisplays().some(display => {
    return CheckBound(state, display);
  });
  if (!isInScreen) return defaultConfig;
  else {
    state.manageWindow = ManageWindow;
    config.state = state;
    return state;
  }
}
