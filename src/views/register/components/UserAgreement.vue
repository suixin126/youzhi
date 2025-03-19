<template>
  <el-card class="agreement-container" shadow="never">
    <!-- 章节导航 -->
    <el-menu
      class="chapter-nav"
      mode="vertical"
      :default-active="activeChapter"
      @select="handleNavClick"
    >
      <el-menu-item
        v-for="chapter in chapters"
        :key="chapter.id"
        :index="chapter.id"
        class="!h-8 !leading-8 text-sm"
      >
        {{ chapter.title }}
      </el-menu-item>
    </el-menu>

    <!-- 协议内容 -->
    <div class="agreement-content">
      <!-- 顶部操作按钮 -->
      <div class="operation-buttons">
        <el-tooltip content="下载" placement="left">
          <el-button
            type="primary"
            circle
            size="large"
            @click="handleDownload"
            :icon="Download"
          />
        </el-tooltip>
      </div>

      <!-- 协议正文 -->
      <h1 class="text-2xl font-bold text-center mb-8 text-[#409EFF]">
        《悠智日程管理软件服务协议》
      </h1>

      <section v-for="section in sections" :id="section.id" :key="section.id">
        <h2 class="chapter-title">{{ section.title }}</h2>
        <div class="chapter-content">
          <template v-for="(content, index) in section.content" :key="index">
            <p v-if="typeof content === 'string'">{{ content }}</p>
            <ol v-else>
              <li v-for="(item, idx) in content" :key="idx">{{ item }}</li>
            </ol>
          </template>
        </div>
      </section>

      <!-- 版本信息 -->
      <div class="version-info">
        <el-divider />
        <div class="text-center">
          <el-tag type="info" size="small">当前版本 v2.1</el-tag>
          <p class="update-time">最后更新：2024年3月15日</p>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script setup>
import { ref } from "vue";
import { Printer, Download } from "@element-plus/icons-vue";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// 章节导航数据
const chapters = ref([
  { id: "general", title: "总则" },
  { id: "rights", title: "用户权利" },
  { id: "obligations", title: "用户义务" },
  { id: "service", title: "服务内容" },
  { id: "privacy", title: "隐私保护" },
  { id: "ip", title: "知识产权" },
  { id: "liability", title: "责任声明" },
  { id: "modification", title: "协议变更" },
]);

// 协议内容数据（部分示例）
const sections = ref([
  {
    id: "general",
    title: "第一章 总则",
    content: [
      `欢迎使用「悠智」学生日程管理系统！作为专为学生设计的智能日程助手，我们致力于帮助您高效管理课程安排、作业提醒和校园生活。请您在使用前仔细阅读本协议，特别是加粗显示的学生专属条款。`,
    ],
  },
  {
    id: "rights",
    title: "第二章 学生专属权利",
    content: [
      [
        "课程数据自主权：您对录入的所有课程表、考试安排等教学相关数据享有完全控制权",
        "智能提醒服务：可自由设置作业截止提醒、课程提醒等个性化学习提醒",
        "数据导出权限：支持将日程数据导出为iCalendar格式，方便与其他学习平台同步",
      ],
    ],
  },
]);

// 处理导航点击
const handleNavClick = (id) => {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  }
};

// 下载处理
const handleDownload = async () => {
  const agreementContent = document.querySelector(".agreement-content");
  try {
    const canvas = await html2canvas(agreementContent);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("悠智日程管理软件服务协议.pdf");
  } catch (error) {
    console.error("下载 PDF 时出错:", error);
  }
};
</script>

<style lang="scss" scoped>
.top-30 {
  top: 7.5rem; /* 假设你想让 top 为 7.5rem */
}
.agreement-container {
  @apply relative max-w-4xl mx-auto my-8;

  .chapter-nav {
    @apply w-40 fixed left-10 top-30 bg-transparent border-none;
  }

  .agreement-content {
    @apply pl-8 pr-12 py-6 min-h-screen;

    .operation-buttons {
      width: 200px;
      @apply fixed right-8 top-20 space-y-2;
    }

    .chapter-title {
      @apply text-lg font-semibold text-gray-800 mb-4 mt-8 pl-4 border-l-4 border-[#409EFF];
    }

    .chapter-content {
      @apply text-gray-700 leading-7 space-y-4;

      p {
        @apply indent-8 text-justify;
      }

      ol {
        @apply list-decimal pl-8 space-y-3;

        li {
          @apply text-[15px] leading-6;
          &::marker {
            @apply text-[#409EFF] font-bold;
          }
        }
      }
    }

    .version-info {
      @apply mt-12;

      .update-time {
        @apply text-gray-500 text-sm mt-2;
      }
    }
  }
}

@media print {
  .chapter-nav,
  .operation-buttons {
    display: none !important;
  }

  .agreement-content {
    padding: 0 !important;
    font-size: 14px !important;

    .chapter-title {
      font-size: 16px !important;
    }
  }
}
</style>
