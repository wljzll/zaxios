type Method =
  | "get"
  | "GET"
  | "POST"
  | "post"
  | "put"
  | "PUT"
  | "delete"
  | "DELETE";

export interface AxiosInstance {
  <T>(config: AxiosRequestConfig): Promise<AxiosResponse<T>>;
}

// 请求配置接口
export interface AxiosRequestConfig {
  url: string; // 请求地址
  method: Method; // 请求方法
  params?: Record<string, any>; // get方法请求参数
  data?: Record<string, any>; // post方法请求参数
  headers?: Record<string, any>; // 请求header
  timeout?: number; // 超时配置
}

// 返回值接口
export interface AxiosResponse<T = any> {
  data: T; // 真正的data
  status: number; // 状态码
  statusText: string; // 文本形式状态码
  headers: any; // 请求头
  config: AxiosRequestConfig; // 请求配置
  request?: any; // XMLHttpRequest实例
}
