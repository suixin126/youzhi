<template>
<div>
    <el-container>
        <el-aside width="auto">
            <AsideBar></AsideBar>
        </el-aside>
        <el-container>
        <el-header height="60px">
            <HeadBar></HeadBar>
        </el-header>
        <el-main>
            <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
</div>
</template>

<script setup>
import {AsideBar,MainBar,HeadBar} from './components/index.js'
</script>

<style lang="scss" scoped>

</style>