// V: AxiosRequestConfig 或 AxiosResponse
// 拦截器第一个参数是AxiosRequestConfig 或 AxiosResponse返回AxiosRequestConfig 或 AxiosResponse或者Promise<AxiosRequestConfig 或 AxiosResponse>
export interface OnFulfilledFn<V> {
  (value: V): V | Promise<V>;
}
export interface OnRejectedFn {
  (error: any): any;
}

// T 如果是AxiosRequestConfig 就是请求拦截器
// T 如果是AxiosResponse 就是响应拦截器
export interface Interceptor<T = any> {
  onFulFilled: OnFulfilledFn<T>;
  onRejected?: OnRejectedFn;
}

// V: AxiosRequestConfig 请求拦截器的类
// V: AxiosResponse 响应拦截器的类
export default class AxiosInterceptorManager<V> {
  interceptors: Array<Interceptor<V> | null> = []; // 请求拦截器的实例存放请求拦截器 响应拦截器的实例存放响应拦截器
  use(onFulFilled: OnFulfilledFn<V>, onRejected?: OnRejectedFn): number {
    this.interceptors.push({
      onFulFilled,
      onRejected,
    });
    return this.interceptors.length - 1;
  }
  eject(id: number): void {
    if (this.interceptors[id]) {
      this.interceptors[id] = null;
    }
  }
}
