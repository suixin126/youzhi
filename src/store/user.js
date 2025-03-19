import { defineStore } from "pinia";
const imgUrl = new URL("@/images/head.jpg", import.meta.url).href;
const userStore = defineStore("user", {
  // 为了完整类型推理，推荐使用箭头函数
  state: () => ({
    userInfo: {
      avatar: imgUrl,
    },
  }),
  // 其他getters和actions
  persist: true,
});

export default userStore;
