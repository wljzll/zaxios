import Axios from "./axios";
import { AxiosInstance } from "./types";
import {CancelToken, isCancel} from './cancel'

function createInstance(): AxiosInstance {
  // 创建Axios实例
  let context = new Axios();
  // bind原型上的request方法
  let instance = Axios.prototype.request.bind(context);
  // 将Axios原型和实例上的属性方法都复制到instance上一份
  instance = Object.assign(instance, Axios.prototype, context);
  // 返回Axios实例的request方法
  return instance as AxiosInstance;
}

// 每次执行createInstance都会创建新的实例
var axios = createInstance();
axios.CancelToken = new CancelToken();
axios.isCancel = isCancel;
// axios实际上是Axios类的request方法
export default axios;
export * from "./types";
