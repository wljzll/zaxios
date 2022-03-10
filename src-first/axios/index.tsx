import Axios from "./axios";

function createInstance() {
  // 创建Axios实例
  let context = new Axios();
  // bind原型上的request方法
  let instance = Axios.prototype.request.bind(context);
  // 将Axios原型和实例上的属性方法都复制到instance上一份
  instance = Object.assign(instance, Axios.prototype, context);
  // 返回Axios实例的request方法
  return instance;
}

// 每次执行createInstance都会创建新的实例
var axios = createInstance();

export default axios;
export * from "./types";
