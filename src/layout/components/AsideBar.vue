<template>
  <div>
    <el-row class="tac">
      <div class="flex h-16 items-center px-6">
        <el-icon class="text-blue-500 text-2xl"><Monitor /></el-icon>
        <span class="ml-2 text-xl font-medium text-blue-500">悠智</span>
      </div>
      <el-col>
        <el-menu
          default-active="/"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          router
        >
        <el-menu-item index="/">
            <el-icon><House /></el-icon>
            <span>日程管理</span>
          </el-menu-item>
          <el-menu-item index="/taskList">
            <el-icon><List /></el-icon>
            <span>任务清单</span>
          </el-menu-item>
          <el-menu-item index="/healthData">
            <el-icon><DataLine /></el-icon>
            <span>健康数据</span>
          </el-menu-item>
          <el-menu-item index="/dataAnalyse">
            <el-icon><TrendCharts /></el-icon>
            <span>数据分析</span>
          </el-menu-item>
          <el-menu-item index="/personalInformation">
            <el-icon><Setting /></el-icon>
            <span>个人设置</span>
          </el-menu-item>
        </el-menu>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
} from "@element-plus/icons-vue";
const handleOpen = (key, keyPath) => {
  // console.log(key, keyPath);
};
const handleClose = (key, keyPath) => {
  // console.log(key, keyPath);
};
</script>

<style lang="scss" scoped>
</style>