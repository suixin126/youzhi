import http from '../http/http.js'
import request from '../request/request.js'

// 登录
export const login = (params, headers) => {
    return http.post('/user/login', params, headers)
}

// 注册
export const register = (params, headers) => {
    return http.post("/user/register", params, headers)
}
//退出
export const logout = () => {
    return http.post("/user/exit")
}

//查询用户是否存在
export const userIsExist = (username) => {
    return http.get(`/user/get?userName=${username}`)
}

//获取用户信息
export const getUserInfo = () => {
    return http.get("/user/getInfo")
}

//获取用户一周的学习时长
export const getWeekStudyTime = () => {
    return http.get("/user/workTime")
}

//修改用户信息
export const updatePassword = (params, headers) => {
    return http.post("/user/updatePassword", params, headers)
}

// 获取当日日程信息
export const getTasksInfo = (params) => {
    return http.get("/task/getToday", params)
}

// 添加单个任务
export const addTask = (params, headers) => {
    return http.post("/task/add", params, headers);
}

// 调用大模型
export const addBigTask = (params, headers) => {
    return http.post("/task/plan", params, headers);
}