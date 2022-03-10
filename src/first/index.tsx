import { application } from "express";
import axios, { AxiosResponse } from "axios";
const baseURL = "http://localhost:8080";

export interface User {
  username: string;
  password: string;
}

let user: User = {
  username: "zhufeng",
  password: "123456",
};

// GET请求
// axios({
//   method: "get",
//   url: baseURL + "/get",
//   params: user,
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

// // POST请求
// axios({
//   method: "post",
//   url: baseURL + "/post",
//   headers: { "Content-Type": "application/json" },
//   data: user,
// })
//   .then((res: AxiosResponse) => {
//     console.log(res);
//     return res.data;
//   })
//   .then((data: User) => {
//     console.log(`第二个then: ${JSON.stringify(data)}`);
//   })
//   .catch((error: any) => {
//     console.log(`错误:${error}`);
//   });

// // 网络错误
// setTimeout(() => {
//   axios({
//     method: "post",
//     url: baseURL + "/post",
//     headers: { "Content-Type": "application/json" },
//     data: user,
//   })
//     .then((response: AxiosResponse) => {
//       console.log(response);
//       return response.data;
//     })
//     .then((data: User) => {
//       console.log(data);
//     })
//     .catch(function (error: any) {
//       console.log(error);
//     });
// }, 5000);

// // 超时错误
// axios({
//   method: "post",
//   url: baseURL + "/post_timeout?timeout=3000",
//   headers: { "Content-Type": "application/json" },
//   timeout: 1000,
//   data: user,
// })
//   .then((response: AxiosResponse) => {
//     console.log(response);
//     return response.data;
//   })
//   .then((data: User) => {
//     console.log(data);
//   })
//   .catch(function (error: any) {
//     console.log(error);
//   });

// 状态码错误
axios({
  method: "post",
  url: baseURL + "/post_status?code=300",
  headers: { "Content-Type": "application/json" },
  timeout: 1000,
  data: user,
})
  .then((response: AxiosResponse) => {
    console.log(response);
    return response.data;
  })
  .then((data: User) => {
    console.log(data);
  })
  .catch(function (error: any) {
    console.log(error);
  });
