import { AxiosRequestConfig, AxiosResponse } from "./types";
import AxiosInterceptorManager, {
  Interceptor,
} from "./AxiosInterceptorsManager";
import qs from "qs";
import parse from "parse-headers";

// Axios的interceptors属性的接口
interface Interceptors {
  request: AxiosInterceptorManager<AxiosRequestConfig>; // 请求拦截器实例
  response: AxiosInterceptorManager<AxiosResponse>; // 响应拦截器实例类型
}

// 默认配置项
let defaults:AxiosRequestConfig = {
  method: 'get',
  timeout: 0,
  headers: {
    common: {
      accept: 'application/json'
    }
  },
  // 默认get请求存在 data 将data转换成表单格式
  transformRequest: function (data: Record<string, any>, headers: Record<string, any>) {
    headers['content-type'] = 'application/x-www-form-urlencoded';
    return qs.stringify(data);
  },
  // 默认将返回值转换成JSON字符串
  transformResponse: function (data: any) {
      if (typeof data === 'string') data = JSON.parse(data);
      return data;
  }
}

let getStyleMethods = ['get', 'head', 'delete', 'option'];
getStyleMethods.forEach((method:string) => {
  defaults.headers![method] = {};
})

let postStyleMethods = ['post', 'put', 'patch'];
postStyleMethods.forEach((method:string) => {
   defaults.headers![method] = {};
})
let allMethods = [...getStyleMethods, ...postStyleMethods];

export default class Axios {
  public defaults: AxiosRequestConfig = defaults
  // 实例属性 存放两个拦截器方法
  public interceptors: Interceptors = {
    request: new AxiosInterceptorManager<AxiosRequestConfig>(), // 接收AxiosRequestConfig的AxiosInterceptorManager实例
    response: new AxiosInterceptorManager<AxiosResponse>(), // 接收AxiosResponse的AxiosInterceptorManager实例
  };
  // Promise<AxiosRequestConfig | AxiosResponse<T>> 为什么Promise的泛型要传入一个联合类型?
  request<T>(config: AxiosRequestConfig): Promise<AxiosRequestConfig | AxiosResponse<T>> {
    if (config.transformRequest && config.data) config.data = config.transformRequest(config.data, config.headers = {});
    config.headers = Object.assign(this.defaults.headers, config.headers);
    // 构建数组 等待依次执行
    const chain: Interceptor[] = [
      {
        onFulFilled: this.dispatchRequest,
        onRejected: undefined,
      },
    ];
    // 将请求拦截器依次添加到 chain的头部 先添加的请求拦截器后执行
    this.interceptors.request.interceptors.forEach(
      (interceptor: Interceptor<AxiosRequestConfig> | null) => {
        interceptor && chain.unshift(interceptor);
      }
    );

    // 将相应拦截器依次添加到 chain的尾部 先添加的相应拦截器先执行
    this.interceptors.response.interceptors.forEach(
      (interceptor: Interceptor<AxiosResponse> | null) => {
        interceptor && chain.push(interceptor);
      }
    );
    
    // 构建初始promise：如果有请求拦截器将config传递给请求拦截器 如果没有就直接传递给dispatchRequest
    let promise: Promise<AxiosRequestConfig | AxiosResponse<T>> = Promise.resolve(config);

    // 循环执行chain的每一项 将promise then中return的值交给下一个处理
    while (chain.length) {
      const { onFulFilled, onRejected } = chain.shift()!;
      promise.then(onFulFilled, onRejected);
    }
    return promise;
  }
  dispatchRequest<T>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return new Promise<AxiosResponse<T>>((resolve, reject) => {
      // 结构参数
      let { method = "get", url, params, headers, data, timeout } = config;
      // 实例化XMLHttpRequest对象
      let request: XMLHttpRequest = new XMLHttpRequest();
      // 有参数 处理参数
      if (params) {
        let paramsString = qs.stringify(params);
        url = url + (url!.indexOf("?") === -1 ? "?" : "&") + paramsString;
      }
      request.open(method, url!, true);
      request.responseType = "json";
      request.onreadystatechange = () => {
        if (request.readyState === 4 && request.status !== 0) {
          if (request.status >= 200 && request.status < 300) {
            // 组装response
            let response: AxiosResponse = {
              data: request.response,
              status: request.status,
              statusText: request.statusText,
              headers: parse(request.getAllResponseHeaders()),
              config: config,
              request,
            };
            if (config.transformResponse) {
              response.data = config.transformResponse(response.data);
            }
            // resolve Promise
            resolve(response);
          } else {
            reject(
              new Error(`Request failed with status code ${request.status}`)
            );
          }
        }
      };
      // 如果有请求头 添加请求头
      if (headers) {
        for (const key in headers) {
          if (key === "common" || allMethods.includes(key)) {
            for (let key2 in headers[key]) {
              request.setRequestHeader(key2, headers[key][key2]);
            }
          } else {
            request.setRequestHeader(key, headers[key]);
          }
        }
      }
      // 有请求体 处理请求体
      let body: string | null = null;
      if (data && typeof data === "object") {
        body = JSON.stringify(data);
      }
      // 网络错误处理
      request.onerror = function () {
        reject(new Error("NetWork Error"));
      };
      if (config.cancelToken) {
        config.cancelToken.then((reason: string) => {
          request.abort();
          setTimeout(() => {
            reject(reason);
          }, 0);
        });
      }
      // 超时错误处理
      if (timeout) {
        request.timeout = timeout;
        request.ontimeout = function () {
          reject(new Error(`timeout of ${timeout}ms exceeded`));
        };
      }
      request.send(body);
    });
  }
}
