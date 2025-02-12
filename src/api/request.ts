const baseUrl = "http://127.0.0.1:11000/api/iic/"

import { errTips, topErrorTips } from "@/utils";
// 请求加载动画
import axios from "axios";
import { useStore } from "@/stores"

const request = axios.create({
    baseURL: baseUrl,
    timeout: 1000 * 3,
})

// 请求拦截器
request.interceptors.request.use((config) => {
    const store = useStore();
    const token = store.currentToken; // 获取token
    if (token && token.length > 0) {
        config.headers['token'] = token; // 设置请求头携带token
    }
    return config;
}, error => {
    return Promise.reject(error);
})

// 响应拦截器
request.interceptors.response.use(response => {
    if(response.data.status == 5500){
        topErrorTips(response.data.message)
    }
    return response;
}, error => {
    return Promise.reject(error);
});

export default request;