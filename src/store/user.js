import { defineStore } from "pinia";

const userStore = defineStore("user", {
  // 为了完整类型推理，推荐使用箭头函数
  state: () => {
    return {
      userInfo: {
        avatar:
          "https://ai-public.mastergo.com/ai/img_res/c8458fa65be755b3454edbc742e77195.jpg",
        username: "李杰",
        stuId: "202231036333",
        phone: "15236589645",
        email: "2566348569@qq.com",
        password: "123",
      },
      token: "",
      tasks: [
        {
          name: "任务1", // 任务名字
          timeEnd: "2024-01-20 23:22", // 截至日期
          priority: "高", // 优先级
          span: ["学习"], // 标签
          state: 0, // 状态
          timeStart: '2022-02-22 22:22',// 开始日期,
          subTasks: [],
        },
        {
          name: "任务2", // 任务名字
          timeEnd: "2024-01-20 23:22", // 截至日期
          priority: "高", // 优先级
          span: ["学习"], // 标签
          state: 1, // 状态
          timeStart: '2022-02-22 22:22',// 开始日期
          subTasks: [],
        },
        {
          name: "任务3", // 任务名字
          timeEnd: "2024-01-20 23:22", // 截至日期
          priority: "高", // 优先级
          span: ["学习"], // 标签
          state: 0, // 状态
          timeStart: '2022-02-22 22:22',// 开始日期
          subTasks: [],
        },
      ],
      healthy: {
        point: 80,// 指数
        footNum: 100,// 步数
        sleepTime: 6, // 睡眠时长
        studyTime: 4, // 专注时长
        state: "",
        sportTime: 60, // 运动时长
        bpm: 82, // 心率
        sportAdvice: '今日步数已达标，建议傍晚进行20分钟中等强度有氧运动', // 运动建议
        foodAdvice: '注意补充蛋白质，建议增加水果摄入量', // 饮食建议
        sleepAdvice: '睡眠质量良好，建议保持规律作息时间', // 睡眠建议
      }
    };
  },
});

export default userStore;
