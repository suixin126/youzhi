<template>
  <div class="headBar-contain">
    <!-- 顶部搜索栏 -->
    <div class="mb-8 flex items-center justify-between">
      <div class="relative flex-1 max-w-2xl mx-auto">
        <el-input
          v-model="searchText"
          placeholder="搜索任务或日程..."
          class="!rounded-full"
        >
          <template #prefix>
            <el-icon class="text-gray-400"><Search /></el-icon>
          </template>
          <template #suffix>
            <el-icon class="text-gray-400 cursor-pointer"
              ><Microphone
            /></el-icon>
          </template>
        </el-input>
      </div>
      <div class="flex items-center">
        <el-badge :value="2" class="mr-4">
          <el-icon class="text-xl text-gray-600"><Bell /></el-icon>
        </el-badge>
        <el-avatar
          :size="40"
          src="https://ai-public.mastergo.com/ai/img_res/c1d274010034e005082b120c3099585a.jpg"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style lang="scss" scoped>
.headBar-contain{
    padding-top: 20px;
}
</style>