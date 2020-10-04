export type Method = 'get' | 'GET' | 'options' | 'OPTIONS' | 'post' | 'POST';

export default class TwitterAPI {
  async request<TReq, TResp>(url: string, method: Method, params?: TReq): Promise<TResp> {
    try {
      const resp = await fetch(url);
      if (!resp.ok) {
        throw new Error(resp.statusText);
      } else {
        const json = await resp.json();
        return json;
      }
    } catch (e) {
      return e;
    }
  }
}
