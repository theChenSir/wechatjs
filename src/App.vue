<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import Home from './components/Home.vue'
import 'animate.css'
import {h,provide} from "vue";
import * as echarts from 'echarts'
provide('ec',echarts)
import MessageApi from "./components/message-api.vue";
import { NMessageProvider } from "naive-ui";
</script>

<template>
  <n-message-provider>
    <MessageApi />
  </n-message-provider>
  <router-view></router-view>

</template>

<style>
*{
  margin: 0;
  padding: 0;
}
html,header,body{
  margin: 0;
  padding: 0;
}
</style>
