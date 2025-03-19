<!-- 代码已包含 CSS：使用 TailwindCSS , 安装 TailwindCSS 后方可看到布局样式效果 -->

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 主要内容区域 -->
    <div class="max-w-8xl mx-auto px-3 pt-4 pb-8">
      <!-- 状态概览卡片 -->
      <div class="grid grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-lg p-6 shadow-sm">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium text-gray-900">今日待办</h3>
            <span class="text-3xl font-semibold text-blue-500">{{
              tasks.length
            }}</span>
          </div>
          <div class="flex items-center text-gray-500">
            <el-icon>
              <Check />
            </el-icon>
            <span class="ml-1">已完成 {{ finishedTasks }} 项任务</span>
          </div>
        </div>

        <div class="bg-white rounded-lg p-6 shadow-sm">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium text-gray-900">学习时长</h3>
            <span class="text-3xl font-semibold text-emerald-500">{{ workTime }}h</span>
          </div>
          <div class="flex items-center text-emerald-500">
            <el-icon v-if="workTimeDiff >= 0">
              <ArrowUp />
            </el-icon>
            <el-icon v-else color="red">
              <ArrowDown />
            </el-icon>
            <span class="ml-1 text-green-600" v-if="workTimeDiff >= 0">较昨日增加 {{ workTimeDiff }}h</span>
            <span class="ml-1 text-red-600" v-else>较昨日减少{{ -workTimeDiff }}h</span>
          </div>
        </div>

        <div class="bg-white rounded-lg p-6 shadow-sm">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium text-gray-900">健康指数</h3>
            <span class="text-3xl font-semibold text-orange-500">{{
              healthy.point
            }}</span>
          </div>
          <div class="flex items-center text-gray-500">
            <span class="ml-1">{{ healthyState }}</span>
          </div>
        </div>
      </div>

      <!-- 健康数据和目标区域 -->
      <div class="grid grid-cols-3 gap-6">
        <div class="col-span-2">
          <div class="bg-white rounded-lg p-6 shadow-sm mb-6">
            <h3 class="text-lg font-medium text-gray-900 mb-6">健康数据概览</h3>
            <div class="grid grid-cols-2 gap-6">
              <div class="bg-blue-50 rounded-lg p-4">
                <div class="text-sm text-blue-600 mb-2">今日步数</div>
                <div class="text-2xl font-semibold">
                  {{ healthy.stepCount }}
                </div>
              </div>
              <div class="bg-purple-50 rounded-lg p-4">
                <div class="text-sm text-purple-600 mb-2">睡眠时长</div>
                <div class="text-2xl font-semibold">
                  {{ healthy.sleepTime }}小时
                </div>
              </div>
              <div class="bg-orange-50 rounded-lg p-4">
                <div class="text-sm text-orange-600 mb-2">心率</div>
                <div class="text-2xl font-semibold">
                  {{ healthy.heartRate }}次/分
                </div>
              </div>
            </div>
          </div>

          <!-- 健康建议区域 -->
          <div class="bg-white rounded-lg p-6 shadow-sm" v-loading="adviceExist">
            <h3 class="text-lg font-medium text-gray-900 mb-6">
              健康建议<span style="font-size: small; margin-left: 10px; color: red">(建议由AI生成，仅供参考)</span>
            </h3>
            <div class="space-y-4">
              <div class="rounded-lg p-4" :class="getColorClass(index)" v-for="(items, index) in advice" :key="index">
                <h4 class="font-medium mb-2" :class="getTitleColorClass(index)">
                  {{ items.title }}
                </h4>
                <p :class="getContentColorClass(index)">
                  {{ items.content }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧健康目标和记录 -->
        <div class="space-y-6">
          <div class="bg-white rounded-lg p-6 shadow-sm">
            <div class="flex justify-between">
              <h3 class="text-lg font-medium text-gray-900">健康数据导入</h3>
              <div class="import" @click="showImportDialog = true"></div>
            </div>
            <div style="font-size: small;font-weight: lighter;position: relative;left: -10px;" class="text-red-600">
              （目前仅支持苹果健康的数据导入）</div>
            <!-- 健康数据导入弹窗,选择文件进行上传 -->
            <el-dialog v-model="showImportDialog" title="健康数据导入" width="40%">
              <div v-loading="uploading">
                <el-upload class="upload-demo" drag action="#" :multiple="false" :auto-upload="false" :limit="1"
                  accept=".xml" @change="handleFileChange">
                  <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                  <div class="el-upload__text">
                    拖拽或者 <em>选择文件进行上传</em>
                  </div>
                </el-upload>
                <el-button size="medium" type="primary" @click="submitUpload" v-show="showBtn"
                  style="margin: 0 auto">导入</el-button>
              </div>
            </el-dialog>
          </div>

          <div class="bg-white rounded-lg p-6 shadow-sm">
            <div class="flex justify-between">
              <h3 class="text-lg font-medium text-gray-900 mb-6">健康目标</h3>
              <div class="edit" @click="showTargetDialog = true"></div>
            </div>
            <!-- 健康目标弹窗 -->
            <el-dialog v-model="showTargetDialog" title="编辑健康目标" width="40%">
              <el-form :model="targets" ref="targetForm" label-width="75px">
                <el-form-item label="每日步数">
                  <el-input v-model="targets.totalFoot" placeholder="请输入每日步数" />
                </el-form-item>
                <el-form-item label="睡眠时长">
                  <el-input v-model="targets.totalSleepTime" placeholder="请输入睡眠时长" />
                </el-form-item>
              </el-form>
              <div style="
                  display: flex;
                  justify-content: space-between;
                  width: 100%;
                ">
                <el-button @click="showTargetDialog = false">取消</el-button>
                <el-button type="primary" @click="saveTarget()">保存</el-button>
              </div>
            </el-dialog>
            <div class="space-y-6">
              <div>
                <div class="flex justify-between text-sm mb-2">
                  <span>每日步数</span>
                  <span class="text-blue-500">{{ footRatio * 100 }}%</span>
                </div>
                <div class="h-2 bg-gray-200 rounded-full">
                  <div class="h-2 bg-blue-500 rounded-full" :style="{ width: footRatio * 100 + '%' }"></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between text-sm mb-2">
                  <span>睡眠时长</span>
                  <span class="text-purple-500">{{ sleepRatio * 100 }}%</span>
                </div>
                <div class="h-2 bg-gray-200 rounded-full">
                  <div class="h-2 bg-purple-500 rounded-full" :style="{ width: sleepRatio * 100 + '%' }"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-lg p-6 shadow-sm relative">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-lg font-medium text-gray-900">健康记录</h3>
              <el-button size="small" @click="showHealthDialog = true" class="!rounded-button">
                查询近30天
              </el-button>
            </div>
            <div class="space-y-4">
              <!-- 今日数据展示-->
              <div class="items-center">
                <!-- 近三天的健康数据 -->
                <div v-for="(day, index) in threeDaysData" :key="index" class="bg-white rounded-lg p-4 shadow-sm">
                  <div v-show="index === 0" class="flex justify-between">
                    <div class="text-sm text-red-500 mb-2">{{ day.date }}</div>
                    <div v-if="currentDataType === 0" class="text-sm font-medium text-green-600">
                      心率: {{ day.heartRate }} bpm
                    </div>
                    <div v-else-if="currentDataType === 1" class="text-sm font-medium text-blue-600">
                      步数: {{ day.stepCount }} 步
                    </div>
                    <div v-else class="text-sm font-medium text-purple-600">
                      睡眠时长: {{ day.sleepTime }} 小时
                    </div>
                  </div>
                  <div v-show="index === 1" class="flex justify-between">
                    <div class="text-sm text-orange-500 mb-2">
                      {{ day.date }}
                    </div>
                    <div v-if="currentDataType === 1" class="text-sm font-medium text-green-600">
                      心率: {{ day.heartRate }} bpm
                    </div>
                    <div v-else-if="currentDataType === 2" class="text-sm font-medium text-blue-600">
                      步数: {{ day.stepCount }} 步
                    </div>
                    <div v-else class="text-sm font-medium text-purple-600">
                      睡眠时长: {{ day.sleepTime }} 小时
                    </div>
                  </div>
                  <div v-show="index === 2" class="flex justify-between">
                    <div class="text-sm text-yellow-500 mb-2">
                      {{ day.date }}
                    </div>
                    <div v-if="currentDataType === 2" class="text-sm font-medium text-green-600">
                      心率: {{ day.heartRate }} bpm
                    </div>
                    <div v-else-if="currentDataType === 0" class="text-sm font-medium text-blue-600">
                      步数: {{ day.stepCount }} 步
                    </div>
                    <div v-else class="text-sm font-medium text-purple-600">
                      睡眠时长: {{ day.sleepTime }} 小时
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- 健康数据弹窗 -->
            <el-dialog v-model="showHealthDialog" title="近30天健康数据" width="40vw">
              <el-table :data="healthData" style="width: 100%" max-height="400">
                <el-table-column prop="date" label="日期" width="150" />
                <el-table-column label="步数" width="120">
                  <template #default="{ row }">
                    {{ row.stepCount || 0 }} 步
                  </template>
                </el-table-column>
                <el-table-column label="睡眠时长" width="120">
                  <template #default="{ row }">
                    {{ row.sleepTime || 0 }} 小时
                  </template>
                </el-table-column>
                <el-table-column label="心率" prop="heartRate">
                  <template #default="{ row }">
                    {{ row.heartRate || "--" }} bpm
                  </template>
                </el-table-column>
              </el-table>
            </el-dialog>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="js" setup>
import axios from "axios";
import { onMounted, ref, onUnmounted } from "vue";
import { ElMessage } from "element-plus";
import { getHealthData, getHealthDataList, getHealthSuggestion, getTasksInfo, getWeekStudyTime } from "@/api/api.js";
import { ArrowDown, ArrowUp } from "@element-plus/icons-vue";
import { calculateHealthPoint } from '@/utils/healthyMethods.js'
const tasks = ref([]);
//当天的健康数据
const healthy = ref({
  point: 0,// 指数
  stepCount: 0,// 步数
  sleepTime: 0, // 睡眠时长
  heartRate: 0, // 心率
})
//工作时间
const workTime = ref(0);
//与最近一天工作时间的差值
const workTimeDiff = ref(0);
//健康建议
const advice = ref([])
//健康目标
const targets = ref({
  totalFoot: 0, // 每日步数
  totalSleepTime: 0, // 睡眠时长
})
//健康数据（30天）
const healthData = ref([]);
//三日的健康数据
const threeDaysData = ref([]);
//导入的健康数据
const importData = ref(null);

const finishedTasks = ref(0)
const healthyState = ref("");
const footRatio = ref(0);
const sleepRatio = ref(0);
const showHealthDialog = ref(false);
const showImportDialog = ref(false);
const showTargetDialog = ref(false);
const showBtn = ref(false);
const adviceExist = ref(false);
const uploading = ref(false);
const currentDataType = ref(0); // 当前展示的数据类型（0: sportTime, 1: footNum, 2: sleepTime）
// 健康数据切换定时器
let intervalId;
//初始化用户健康数据
onMounted(() => {
  //初始化用户健康目标
  targets.value = JSON.parse(localStorage.getItem("targets"));
  //获取健康数据(30天)
  getHealthDataList().then((res) => {
    if (res.data.data) {
      //根据时间排序
      res.data.data.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });
      //获取最近3天的健康数据
      for (let i = 0; i < 3; i++) {
        threeDaysData.value.push(res.data.data[i]);
      }
      healthData.value = res.data.data;
    }
  }).catch((err) => {
    console.log(err);
  })
  //获取今日的健康数据
  getHealthData().then((res) => {
    if (res.data.data == null) {
      //只提醒一次
      if (localStorage.getItem("message") == null) {
        localStorage.setItem("message", "true");
        ElMessage.error(res.data.message);
      }
      return;
    }
    //初始化用户今日健康数据
    healthy.value.heartRate = Math.round(res.data.data[0].heartRate);
    healthy.value.stepCount = Math.round(res.data.data[0].stepCount);
    healthy.value.sleepTime = Math.round(res.data.data[0].sleepTime);
    //计算目标进度
    calculateProgress();
    //计算健康指数
    calculateHealthPoint(healthy, healthyState);
    //如果本地仓库有健康建议，直接获取
    if (localStorage.getItem("advice")) {
      advice.value = JSON.parse(localStorage.getItem("advice"));
      adviceExist.value = false;
    }
    else {
      adviceExist.value = true;
      //如果本地仓库没有建议，获取健康建议
      getHealthSuggestion().then((res) => {
        console.log(res.data.message);
        //提取健康建议
        localStorage.setItem("advice", JSON.stringify(extractSectionsWithoutFormat(res.data.message)));
        advice.value = extractSectionsWithoutFormat(res.data.message);
        console.log(advice.value);
        adviceExist.value = false;
      }).catch((err) => {
        console.log(err);
      })
    }
  }).catch((err) => {
    console.log(err);
  })

  //获取任务信息
  getTasksInfo().then((res) => {
    tasks.value = res.data.data;
    finishedTasks.value = res.data.data.filter((item) => item.status == 1).length;
  }).catch((err) => {
    console.log(err);
  })
  //获取工作时间
  getWeekStudyTime().then((res) => {
    if (res.data.data.length !== 0) {
      //转换成小时
      workTime.value = Math.round(res.data.data[0].totalDuration / 60 * 10) / 10;
      workTimeDiff.value = Math.round((res.data.data[0].totalDuration - res.data.data[1].totalDuration) / 60 * 10) / 10;
    }
  })
  // 启动健康数据切换定时器
  intervalId = setInterval(() => {
    // 切换数据类型
    currentDataType.value = (currentDataType.value + 1) % 3;
  }, 5000); // 每5秒切换一次
});
// 组件卸载时清除定时器
onUnmounted(() => {
  clearInterval(intervalId);
});
//提取健康建议，提取每一段的标题和内容并去除格式
function extractSectionsWithoutFormat(fullText) {
  const lines = fullText.split('\n');
  const sections = [];
  let currentSection = null;

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith('###')) {
      // 如果是标题行，创建新的章节对象
      currentSection = {
        title: trimmedLine.replace('###', '').trim(),
        content: []
      };
      sections.push(currentSection);
    } else if (currentSection !== null && trimmedLine !== '') {
      // 如果不是标题行，将内容添加到当前章节
      // 去除行内的格式符号
      const cleanedLine = trimmedLine.replace(/[-*]|\*\*/g, '').trim();
      if (cleanedLine !== '') {
        currentSection.content.push(cleanedLine);
      }
    }
  }
  // 将内容数组转换为字符串
  for (const section of sections) {
    section.content = section.content.join(' ');
  }
  return sections;
}
//获取颜色类名
function getColorClass(index) {
  const colors = [
    'bg-blue-50',
    'bg-green-50',
    'bg-yellow-50',
    'bg-purple-50'
  ];
  return colors[index % colors.length];
};
function getTitleColorClass(index) {
  const colors = [
    'text-blue-700',
    'text-green-700',
    'text-yellow-700',
    'text-purple-700'
  ];
  return colors[index % colors.length];
};
function getContentColorClass(index) {
  const colors = [
    'text-blue-600',
    'text-green-600',
    'text-yellow-600',
    'text-purple-600'
  ];
  return colors[index % colors.length];
}
//获取上传文件
const handleFileChange = (file) => {
  showBtn.value = true;
  importData.value = file.raw;
}
//确认上传
const submitUpload = () => {
  showBtn.value = false;
  uploading.value = true;
  const formData = new FormData();
  formData.append('file', importData.value);
  axios.post('http://1.12.74.99:8080/HealthData/add', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': localStorage.getItem('token')
    }
  }).then((res) => {
    console.log(res);
    uploading.value = false;
    ElMessage.success('上传成功');
    showImportDialog.value = false;
    //刷新页面
    window.location.reload();
  }).catch((err) => {
    console.log(err);
    ElMessage.error('上传失败');
    showImportDialog.value = false;
  })
}
//保存健康目标
const saveTarget = () => {
  showTargetDialog.value = false;
  //将健康目标保存到本地存储
  localStorage.setItem("targets", JSON.stringify(targets.value));
  ElMessage.success("保存成功");
  calculateProgress();
}
//计算完成进度
const calculateProgress = () => {
  footRatio.value = parseFloat((healthy.value.stepCount / targets.value.totalFoot).toFixed(1));
  sleepRatio.value = parseFloat((healthy.value.sleepTime / targets.value.totalSleepTime).toFixed(1));
  if (footRatio.value > 1) {
    footRatio.value = 1;
  }
  if (sleepRatio.value > 1) {
    sleepRatio.value = 1;
  }
}
</script>

<style scoped>
.el-input :deep(.el-input__wrapper) {
  background-color: #f3f4f6;
  border: none;
  box-shadow: none !important;
}

.el-input :deep(.el-input__inner) {
  height: 40px;
}

.el-input :deep(.el-input__inner)::placeholder {
  color: #9ca3af;
}

.import {
  width: 25px;
  height: 25px;
  background-image: url("../../images/import.png");
  background-size: cover;
  cursor: pointer;
}

.edit {
  width: 25px;
  height: 25px;
  background-image: url("../../images/edit.png");
  background-size: cover;
  cursor: pointer;
}
</style>
