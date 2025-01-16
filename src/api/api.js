import http from '../http/http.js'

// 登录
export const login = (params, headers) => {
    return http.post('/user/login',params, headers)
}

// 注册
export const register = (params, headers) => {
    return http.post("/user/register", params, headers)
}