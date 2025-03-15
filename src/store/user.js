import { defineStore } from "pinia";

const userStore = defineStore("user", {
  // 为了完整类型推理，推荐使用箭头函数
  state: () => {
    return {
      userInfo:{
        avatar:'https://ai-public.mastergo.com/ai/img_res/c8458fa65be755b3454edbc742e77195.jpg',
        username:'李杰',
        stuId:'202231036333',
        phone:'15236589645',
        email:'2566348569@qq.com',
        password:'123',
      },
      token:'',
    };
  },
});

export default userStore
