import axios, { AxiosResponse } from "./axios";
// const baseURL = "http://localhost:8080";

export interface User {
  username: string;
  password: string;
}

// let user: User = {
//   username: "zhufeng",
//   password: "123456",
// };

// console.time("cost");
// axios.interceptors.request.use((config: AxiosRequestConfig) => {
//   console.log(1);
//   console.timeEnd("cost");
//   config.headers!.name += "1";
//   return config;
//   //return Promise.reject('在1处失败了!');
// });

// let request_interceptor = axios.interceptors.request.use(
//   (config: AxiosRequestConfig) => {
//     console.log(2);
//     config.headers!.name += "2";
//     return config;
//   }
// );

// axios.interceptors.request.use((config: AxiosRequestConfig) => {
//   console.log(3);
//   return new Promise<AxiosRequestConfig>(function (resolve) {
//     setTimeout(function () {
//       config.headers!.name += "3";
//       resolve(config);
//     }, 3000);
//   });
// });

// axios.interceptors.request.eject(request_interceptor);



// axios.interceptors.response.use((response: AxiosResponse) => {
//   response.data.username += "1";
//   return response;
// });

// let response_interceptor = axios.interceptors.response.use(
//   (response: AxiosResponse) => {
//     response.data.username += "2";
//     return response;
//   }
// );

// axios.interceptors.response.use((response: AxiosResponse) => {
//   response.data.username += "3";
//   return response;
//   //return Promise.reject('失败了');
// });

// axios.interceptors.response.eject(response_interceptor);


// console.time('cost1')
// axios<User>({
//   method: "post",
//   url: baseURL + "/post",
//   headers: { "Content-Type": "application/json", name: "name" },
//   data: user,
// })
//   .then((response: AxiosRequestConfig | AxiosResponse<User>) => {
//     console.log(response);
//     console.timeEnd("cost1");
//     return response.data as User;
//   })
//   .then((data: User) => {
//     console.log(data);
//   })
//   .catch(function (error: any) {
//     console.log("error", error);
//   });
// axios({
//   method: "get",
//   url: baseURL + "/get",
//   // params: user,
//   data: user
// })
//   .then((res: AxiosResponse) => {
//     console.log(res);
//     return res.data;
//   })
//   .then((data: User) => {
//     console.log(`第二个then${data}`);
//   })
//   .catch((error: any) => {
//     console.log(`错误:${error}`);
//   });


const CancelToken = axios.CancelToken;
const source = CancelToken.source();
axios<User>({
    method: 'post',
    baseURL: 'http://localhost:8080',
    url: '/post_timeout?timeout=2000',
    timeout: 3000,
    cancelToken: source.token
}).then((response: AxiosResponse<User>) => {
    console.log(response);
    return response.data as User;
}).then((data: User) => {
    console.log(data);
}).catch(function (error: any) {
    if (axios.isCancel(error)) {
        console.log('请求取消', error);
    } else {
        console.log('error', error);
    }
});
source.cancel('用户取消请求');
