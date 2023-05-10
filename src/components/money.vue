<template>


  <div style="position:relative;background-color: rgb(245,245,245);width: 100%;height:630px; ">
    <n-card  hoverable style="width: 510px;height: 410px;position: absolute;top: 20px;left: 20px;">
      过去七天营业额
      <div id="moneyWeek" style="width: 500px;height: 400px;"/>
    </n-card>

    <n-card  hoverable style="width: 390px;height: 200px;position: absolute;left: 540px;top:25px;">
      <n-statistic label="今日共有" tabular-nums>
        <n-number-animation ref="numberAnimationInstRef" :from="0" :to="today.user" />
        <template #suffix>
          人登录了小店
        </template>
      </n-statistic>
      <br>
      <n-statistic label="今日访问量为" tabular-nums>
        <n-number-animation ref="numberAnimationInstRef" :from="0" :to="today.count" />
        <template #suffix>

        </template>
      </n-statistic>
    </n-card>
    <n-card  hoverable style="width: 410px;height: 200px;position: absolute;right: 45px;top:25px;">
      <n-statistic label="今日营业额为" tabular-nums>
        <n-number-animation ref="numberAnimationInstRef" :from="0" :to="todayMoney" />
        <template #suffix>
          元
        </template>
      </n-statistic>
      <br>
      <n-statistic label="今日共售出" tabular-nums>
        <n-number-animation ref="numberAnimationInstRef" :from="0" :to="todayGoodsCount" />
        <template #suffix>
          件商品
        </template>
      </n-statistic>
    </n-card>

    <n-card  hoverable style="width: 510px;height: 195px;position: absolute;left: 20px;bottom:10px;">
      <n-statistic label="在售车型数" tabular-nums>
        <n-number-animation ref="numberAnimationInstRef" :from="0" :to="sellCar" />
        <template #suffix>

        </template>
      </n-statistic>
      <br>
      <n-statistic label="在售商品数" tabular-nums>
        <n-number-animation ref="numberAnimationInstRef" :from="0" :to="sellGoods" />
        <template #suffix>

        </template>
      </n-statistic>
    </n-card>
    <n-card  hoverable style="width: 160px;height: 385px;position: absolute;left: 540px;bottom:10px;">
      <n-progress type="dashboard" gap-position="bottom"
                  :percentage="Number(Math.round(orderArr[0]))"
                  style="width: 95px;height: 95px;"/>
      <br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;已发货
      <n-progress type="dashboard" gap-position="bottom"
                  :percentage="Number(Math.round(orderArr[1]))"
                  color="red"
                  style="width: 95px;height: 95px;"/>
      <br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;未发货
      <n-progress type="dashboard" gap-position="bottom"
                  color="green"
                  :percentage="Number(Math.round(orderArr[2]))"
                  style="width: 95px;height: 95px;"/>
      <br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;已评价

    </n-card>

    <n-card  hoverable style="width: 645px;height: 385px;position: absolute;right: 45px;bottom:10px;">
      <text style="font-size: 14px;font-weight: 500;">
        评价列表:
      </text>
      <n-scrollbar style="max-height: 300px" trigger="hover">
        <div style="height: 300px;width: 95%;margin: 20px auto 10px auto">
          <div class="small" v-for="(item,index) in assessList">

            <div style="position: relative;width: 100%;height: 70px;border-bottom: 1px solid grey">
              <img  :src="item.assess.avatar" style="width: 50px;height: 50px;position: absolute;top: 15%;left: 5%;border-radius: 50px;">
              <text style="position: absolute;top: 5%;right: 9%;color: forestgreen">{{item.name}} &nbsp; {{item.type}}</text>
              <text  style="position: absolute;top: 20%;left: 23%;font-size: 18px;font-weight: 600;">{{item.assess.nickName}}</text>
              <text  style="position: absolute;top: 32%;right: 9%;font-size: 13px;color: grey;">{{item.assess.date.toString().substring(0,19)}}</text>
              <n-rate readonly :default-value="item.assess.count" style="position: absolute;top: 60%;right: 10%;width: 20%;height: 10%;"/>
              <text style="position: absolute;top: 60%;left: 23%;">
                {{item.assess.content}}
              </text>
            </div>
          </div>
        </div>
      </n-scrollbar>
    </n-card>

    <button style="width: 35px;height: 155px;position: absolute;right: -1px;top: 35%;box-shadow: 1px 1px 55px -7px grey;text-align: center;line-height: 155px;border: transparent;"
      @click="showQueue"
    >
        《《
    </button>


    <n-drawer
            v-model:show="active"
            :default-width="502"
            :placement="placement"
            resizable
    >
      <n-drawer-content title="今日预约队列">
        <n-list hoverable clickable v-for="(item,index) in todayQueue">
          <transition-group
                  name="animate__animated animate__bounce"
                  :appear="true"
                  enter-active-class="animate__zoomIn"
                  leave-active-class="animate__backOutLeft"
          >
          <n-list-item key="index" v-show="!arr[index]">
            <template #suffix>
              <n-button quaternary round type="error" @click="removeQueue(item,index)">移除</n-button>
            </template>
            <template #prefix>
              <text style="font-size: 20px;color: rgb(24, 160, 88);margin-right: 15px;">
                {{index + 1}}
              </text>
            </template>

            <n-thing :title="new Date().getMonth()+1 + ' 月 ' +new Date().getDate() + ' 日 '" content-style="margin-top: 10px;">
              <template #description>
                <n-avatar :src="item.avator"></n-avatar>
                <text style="vertical-align: top;margin-left: 10px;">
                  {{item.nickName}}
                  <br>
                  <text style="color: lightslategrey">
                    联系人：{{item.name}} 联系方式： {{item.phone}}
                  </text>

                </text>
                <n-space size="small" style="margin-top: 4px">
                  <n-tag type="success" :bordered="false">
                    {{item.car.name}}
                    <template #icon>
                      <n-icon :component="CarOutline" />
                    </template>
                  </n-tag>
                  <n-tag type="success" :bordered="false">
                    {{item.address}}
                    <template #icon>
                      <n-icon :component="HomeOutline" />
                    </template>
                  </n-tag>

                </n-space>
              </template>


            </n-thing>
          </n-list-item>
          </transition-group>
        </n-list>

      </n-drawer-content>
    </n-drawer>
  </div>



</template>


<script setup lang="ts">
    import {h, ref, VNode, onMounted,reactive,inject} from 'vue';
    import router from "../router";
    import useStore from '../store'
    import type {MenuOption} from 'naive-ui'
    import {DropdownGroupOption, DropdownOption, NIcon} from 'naive-ui'
    import {BookmarkOutline, CaretDownOutline,LocationOutline,WalletOutline,CartOutline,CarOutline,PersonOutline,ReorderTwoOutline,AddOutline,SearchOutline,RemoveOutline,TextOutline,HomeOutline} from '@vicons/ionicons5'
    import axios from "axios";
    import type { DrawerPlacement } from 'naive-ui'

    let echarts = inject("ec");
    let moneyArr:any = []
    let today = reactive({
        user:0,
        count:0
    })
    let arr = ref([])
    let assessList = ref()
    let sellGoods = ref(0)
    let sellCar = ref(0)
    let orderArr = ref([])
    let todayMoney = ref(0.000)
    let todayQueue = ref([
        {
            id:'1',
            car:{
                name:'',
                title:'',
                carImg:'',
                count:''
            },
            openId:'3',
            address:'4',
            avator:'5',
            nickName:'6',
            name:'',
            phone:'',
            status:false
        }
    ])
    let todayGoodsCount = ref(0.000)
    const placement = ref<DrawerPlacement>('right')
    const active = ref(false)


    function removeQueue(obj,idx:number){
        let str = obj.openId + "？" + obj.car.id + "？" + obj.address + "？" + obj.avator + "？" + obj.nickName + "？" + obj.name + "？" + obj.phone
        axios.post("https://cchencs.top:8181/cancelYuyue",{
            str:str
        }).then(
            (d)=>{
                if(d.data.data){
                    arr.value[idx] = true
                    // todayQueue.value.splice(idx,1)
                }
            }
        )
    }

    onMounted(()=>{

        // 获取今日预约队列
        axios.get("https://cchencs.top:8181/getTodayQueue").then(
            (d)=>{
                // console.log(d.data.data)
                todayQueue.value = d.data.data
                todayQueue.value.forEach((d)=>{
                    d.status = false
                })
            }
        )

        // 获取今日访问人数
        axios.get("https://cchencs.top:8181/getAccessCount").then(
            (d)=>{
                today.count = d.data.data
            }
        )
        // 获取今日登录人数
        axios.get("https://cchencs.top:8181/getUserCount").then(
            (d)=>{
                today.user = d.data.data
            }
        )
        // 获取今日售出的商品数
        axios.get("https://cchencs.top:8181/getAllGoodsCount").then(
            (d)=>{
                todayGoodsCount.value = d.data.data
            }
        )
        // 获取在售商品数
        axios.get("https://cchencs.top:8181/goods/getSellGoodsCount").then(
            (d)=>{
                sellGoods.value = d.data.data
            }
        )
        // 获取在售车型数
        axios.get("https://cchencs.top:8181/getSellCarCount").then(
            (d)=>{
                sellCar.value = d.data.data
            }
        )
        // 获取订单状态比例
        axios.get("https://cchencs.top:8181/order/getOrderStatusArr").then(
            (d)=>{
                // console.log(d.data.data)
                orderArr.value = d.data.data
            }
        )
        axios.get("https://cchencs.top:8181/assess/getAllAssess").then(
            (d)=>{
                assessList.value = d.data.data
            }
        )

        let moneyWeek = echarts.init(document.getElementById("moneyWeek"));
        const arr = getDays()
        // 获取过去七天营业额
        axios.post("https://cchencs.top:8181/order/getLstSevenDayMoney",{
        // axios.post("http://localhost:8080/order/getLstSevenDayMoney",{
            dateList:arr
        }).then(
            (d)=>{
                // console.log(d.data.data)
                let temp = d.data.data
                todayMoney.value = temp[arr[6]]
                moneyWeek.setOption({
                    xAxis: {
                        type: 'category',
                        data: [arr[0], arr[1], arr[2], arr[3], arr[4], arr[5], arr[6]]
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [
                        {
                            data: [temp[arr[0]],temp[arr[1]],temp[arr[2]],temp[arr[3]],temp[arr[4]],temp[arr[5]],temp[arr[6]]],
                            type: 'line',
                            itemStyle:{
                                normal:{
                                    label : {
                                        show: true // 在折线拐点上显示数据
                                    },
                                    lineStyle:{
                                        width:2,  // 设置虚线宽度
                                        type:'solid'  // 虚线'dotted' 实线'solid'
                                    }
                                }
                            }
                        }
                    ]
                })
            }
        )


    })

    function showQueue() {
        // window.$message.info("111")
        active.value = true
    }

    // yyyy-MM-dd hh:mm:ss
    function getDays(){
        const days = []
        let oneDay = 24 * 60 * 60 * 1000
        // 获取今日日期
        let today = new Date(Date.now() - oneDay)
        today = formatterDate(today,"MM-dd")
        //获取前七天日期
        for(let i = 0;i<7;i++){
            // 02-01
            days[6-i] = formatterDate(new Date(Date.now() - i*oneDay),"MM-dd")
            if(days[6-i].split("-")[0][0] === '0') {
                days[6-i] = days[6-i].slice(1)
            }
            // 2-01
            if(days[6-i].split("-")[1][0] === '0'){
                days[6-i] = days[6-i].split("-")[0] + "-" + days[6-i].split("-")[1].slice(1)
            }
        }
        // console.log(days)
        return days
    }

    // 时间格式化
    function formatterDate(date,fmt){
        let nowDate = {
            yyyy: date.getFullYear(), // 年
            MM: date.getMonth() + 1, // 月份
            dd: date.getDate(), //日
            hh:date.getHours(),
            mm:date.getMinutes(),
            ss:date.getSeconds()
        }
        if(/(y+)/.test(fmt)){
            fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
        }
        for(var k in nowDate){
            if(new RegExp("("+ k +")").test(fmt)){
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (nowDate[k]) : (("00"+ nowDate[k]).substr((""+ nowDate[k]).length)));
            }
        }
        return fmt;
    }



</script>


<style scoped lang="less">
  .small{
    /*animation: move 10s linear infinite forwards;*/
  }
  @keyframes move {
    to {
      transform: translateY(-700px);
    }

  }
</style>
