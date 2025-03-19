<script setup>
import { onBeforeMount, ref } from "vue";
const isLoading = ref(true);
const days = [
  "星期日",
  "星期一",
  "星期二",
  "星期三",
  "星期四",
  "星期五",
  "星期六",
];

onBeforeMount(() => {
  isLoading.value = localStorage.getItem("isLoading") ? false : true;
  setTimeout(() => {
    isLoading.value = false;
    localStorage.setItem("isLoading", "false");
  }, 1000);
  let dayItem = ref("");
  const AppToday = new Date();
  dayItem = days[AppToday.getDay()];
  localStorage.setItem(dayItem, 1);
  if (dayItem === "星期一") {
    localStorage.removeItem("星期二");
    localStorage.removeItem("星期三");
    localStorage.removeItem("星期四");
    localStorage.removeItem("星期五");
    localStorage.removeItem("星期六");
    localStorage.removeItem("星期日");
  }
});
</script>

<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<style scoped>

</style>
