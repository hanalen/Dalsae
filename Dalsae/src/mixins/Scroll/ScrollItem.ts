export interface ScrollItem<T> {
  data: T;
  height: number;
  scrollTop: number;
  isResized: boolean;
  key: string;
}
