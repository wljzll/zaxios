import { AxiosRequestConfig, AxiosResponse } from "./types";
import qs from "qs";
import parse from "parse-headers";

export default class Axios {
  request(config: AxiosRequestConfig): Promise<AxiosResponse> {
    return this.dispatchRequest(config);
  }
  dispatchRequest(config: AxiosRequestConfig): Promise<AxiosResponse> {
    return new Promise((resolve, reject) => {
      // 结构参数
      let { method = "get", url, params, headers, data, timeout } = config;
      // 实例化XMLHttpRequest对象
      let request: XMLHttpRequest = new XMLHttpRequest();
      // 有参数 处理参数
      if (params) {
        let paramsString = qs.stringify(params);
        url = url + (url.indexOf("?") == -1 ? "?" : "&") + paramsString;
      }
      request.open(method, url, true);
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
          request.setRequestHeader(key, headers[key]);
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
