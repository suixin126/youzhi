<template>
  <div class="privacy-container">
    <el-card class="privacy-card">
      <!-- 标题区 -->
      <div class="header">
        <el-icon class="privacy-icon"><Document /></el-icon>
        <h1>悠智日程管理软件隐私政策</h1>
      </div>

      <!-- 内容区 -->
      <div class="content">
        <el-divider content-position="left"
          >最后更新日期：2023年10月</el-divider
        >

        <el-scrollbar height="600px">
          <h2>引言</h2>
          <p>
            欢迎使用「悠智」日程管理软件（以下简称"本软件"）。我们深知个人信息对您的重要性，本政策将帮助您了解我们会如何收集、使用、存储和保护您的个人信息。
          </p>

          <h2>一、信息收集</h2>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-card shadow="hover">
                <h3>
                  <el-icon><Collection /></el-icon> 直接收集
                </h3>
                <ul>
                  <li>账户基本信息（昵称、头像）</li>
                  <li>日程内容（任务、提醒、备注）</li>
                  <li>设备信息（型号、操作系统版本）</li>
                </ul>
              </el-card>
            </el-col>
            <el-col :span="12">
              <el-card shadow="hover">
                <h3>
                  <el-icon><DataAnalysis /></el-icon> 自动收集
                </h3>
                <ul>
                  <li>使用日志与诊断数据</li>
                  <li>IP地址与网络状态</li>
                  <li>崩溃报告与性能数据</li>
                </ul>
              </el-card>
            </el-col>
          </el-row>

          <h2>二、信息使用</h2>
          <el-timeline>
            <el-timeline-item
              v-for="(item, index) in usageItems"
              :key="index"
              :timestamp="item.timestamp"
            >
              {{ item.content }}
            </el-timeline-item>
          </el-timeline>

          <!-- 更多政策内容... -->
        </el-scrollbar>
      </div>

      <!-- 操作栏 -->
      <div class="action-bar">
        <el-button type="primary" @click="downloadPDF" :icon="Download" round>
          下载完整隐私政策（PDF）
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from "vue";
import html2pdf from "html2pdf.js";
import {
  Document,
  Download,
  Collection,
  DataAnalysis,
} from "@element-plus/icons-vue";

const usageItems = ref([
  {
    timestamp: "核心功能",
    content: "提供日程管理、智能提醒、跨设备同步等基础服务",
  },
  { timestamp: "服务优化", content: "分析使用数据改进产品体验" },
  { timestamp: "安全保障", content: "检测异常登录等安全防护" },
]);

const downloadPDF = () => {
  const element = document.querySelector(".privacy-card");
  const opt = {
    margin: 10,
    filename: "悠智隐私政策.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };
  html2pdf().from(element).set(opt).save();
};
</script>

<style scoped>
.privacy-container {
  padding: 40px;
  background: linear-gradient(135deg, #f0f7ff 0%, #e6f4ff 100%);
  min-height: 100vh;
}

.privacy-card {
  max-width: 1200px;
  margin: 0 auto;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.header {
  text-align: center;
  padding: 30px 0;
  background: linear-gradient(45deg, #409eff, #79bbff);
  border-radius: 15px 15px 0 0;
  color: white;
}

.privacy-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

h1 {
  font-size: 28px;
  margin: 0;
}

.content {
  padding: 30px;
}

h2 {
  color: #303133;
  margin: 25px 0 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid #409eff;
}

.action-bar {
  text-align: center;
  padding: 30px 0 10px;
}

.el-timeline {
  margin-left: 20px;
}

.el-card__body ul {
  line-height: 2;
  color: #606266;
}
</style>
