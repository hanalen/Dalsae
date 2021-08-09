export type Method = 'get' | 'GET' | 'options' | 'OPTIONS' | 'post' | 'POST';
type StringMap = { [key: string]: string };

export interface APIReq<TReq> {
  method?: Method;
  headers?: StringMap;
  data?: TReq;
}
