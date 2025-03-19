import http from "../http/http.js";

// 登录
export const login = (params, headers) => {
  return http.post("/user/login", params, headers);
};

// 注册
export const register = (params, headers) => {
  return http.post("/user/register", params, headers);
};
//退出
export const logout = () => {
  return http.post("/user/exit");
};

//查询用户是否存在
export const userIsExist = (username) => {
  return http.get(`/user/get?userName=${username}`);
};

//获取用户信息
export const getUserInfo = () => {
  return http.get("/user/getInfo");
};

//获取用户一周的学习时长
export const getWeekStudyTime = () => {
  return http.get("/user/workTime");
};

//修改用户密码
export const updatePassword = (params, headers) => {
  return http.post("/user/updatePassword", params, headers);
};

// 获取当日日程信息
export const getTasksInfo = (params) => {
  return http.get("/task/getToday", params);
};

// 添加单个任务
export const addTask = (params, headers) => {
  return http.post("/task/add", params, headers);
};

// 调用大模型
export const addBigTask = (params, headers) => {
  return http.post("/task/plan", params, headers);
};
// 添加大任务
export const addBigTask1 = (params, headers) => {
  return http.post("/task/addPlanedTasks", params, headers);
};
// 修改状态
export const updateStatus = (params, headers) => {
  return http.post("/task/update/status", params, headers);
};
// 查询某日的任务情况
export const getRandomTask = (params) => {
  return http.get(`/task/getOneDay?date=${params.date}`);
};
// 删除任务
export const deleteTask = (params, headers) => {
  return http.post("/task/delete", params, headers);
};
// 模糊查询
export const searchTask = (params) => {
  return http.get(`/task/fuzzySearch?keyword=${params.keyword}`);
};
// 修改任务信息
export const updateTaskInfo = (params, headers) => {
  return http.post("/task/update", params, headers);
};
