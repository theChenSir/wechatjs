<template>
  <div style="width: 1100px;height: 600px;position:relative;left:5%;top:50px;">
    <n-button type="info"
              @click="addAdmin"
              style="position:absolute;left:0%;top:-40px;">+ 新增管理员</n-button>
    <n-space :wrap="true" :inline="true" size="large">
      <template v-for="(item,index) in userList">
        <n-card hoverable style="position: relative;width: 170px;height: 340px;">
          <transition-group
                  name="animate__animated animate__bounce"
                  :appear="true"
                  enter-active-class="animate__fadeInDown"
                  leave-active-class="animate__fadeOutDown"
          >
            <img key="2" v-show="!item.isPermit" @click="controlUser(item,0)" src="https://ccsmybucket.oss-cn-hangzhou.aliyuncs.com/activity/%E7%A6%81%E6%AD%A2.png" style="position: absolute;width: 22px;height: 22px;right: 7px;top: 7px;">
            <img key="3" v-show="item.isPermit" @click="controlUser(item,1)" src="https://ccsmybucket.oss-cn-hangzhou.aliyuncs.com/activity/%E6%B7%BB%E5%8A%A0%20%281%29.png" style="position: absolute;width: 22px;height: 22px;right: 7px;top: 7px;">
          </transition-group>
            <template #cover>
            <img :src="item.avatar"
                 style="width: 80px;height: 80px;border-radius: 10px;position: absolute;left: 45px;top: 20px;">
          </template>
          <text style="position: absolute;top: 120px;left: 35px;width: 100px;height: 30px;text-align: center;font-size: 18px;font-weight: 600;">
            {{item.nickName}}
          </text>
          <div v-show="item.status" style="position: absolute;width: 10px;height: 10px;background-color: lawngreen;top: 165px;left: 60px;border-radius: 5px;"/>
          <text v-show="item.status" style="position: absolute;top: 159px;left: 80px;">
            在线
          </text>
          <div v-show="!item.status" style="position: absolute;width: 10px;height: 10px;background-color: lightslategrey;top: 165px;left: 60px;border-radius: 5px;"/>
          <text v-show="!item.status" style="position: absolute;top: 159px;left: 80px;">
            离线
          </text>


          <n-button style="position: absolute;bottom:119px;right: 35px;width: 100px;" tertiary type="info" size="small"
                    @click="showCoupon(item.openId,false)">发放优惠券</n-button>
          <n-button style="position: absolute;bottom:82px;right: 35px;width: 100px;" tertiary type="info" size="small"
                    @click="showCoupon(item.openId,true)">查看优惠券</n-button>

          <n-dropdown trigger="hover" :options="[
              {label: '微信openId：' + item.openId},
          ]" >
            <n-button style="position: absolute;bottom: 45px;right: 35px;width: 100px;"
                      tertiary type="info" size="small">用户唯一凭证</n-button>
          </n-dropdown>

          <text style="position: absolute;bottom: 3px;left: 5px;font-size: 10px;color: darkgrey;width: 150px;text-align: center">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;上次登录时间：
            <br>{{item.lastTime.substring(3,25)}}
          </text>
        </n-card>
      </template>
    </n-space>

<!-- 发放优惠券 -->
    <n-modal v-model:show="isAdd"
             preset="dialog"
             positive-text="确认"
             negative-text="取消"
             @positive-click="submitCallback2"
             @negative-click="cancelCallback2">
      <n-card
              style="width: 400px;height: 130px;"
              :bordered="false"
              size="huge"
              role="dialog"
              aria-modal="true"
      >
        <text style="position: absolute;top: 13px;left: 0">种类：</text>
        <n-select v-model:value="addCoupon.type" :options="options"
        style="width: 120px;height: 25px;position: absolute;top: 10px;left: 50px;"
        />
        <text style="position: absolute;top: 13px;left: 200px">券额：</text>
        <n-input-number v-model:value="addCoupon.parVal" style="position: absolute;top: 10px;right: 40px;width: 120px;"/>


        <text style="position: absolute;top: 73px;left: 0px;">有效期：</text>
        <n-date-picker v-model:value="chooseTime" type="datetimerange"
                       clearable style="position: absolute;left: 60px;top: 70px;width: 300px;"
                       :is-date-disabled="disablePreviousDate"
                       :on-confirm="update"
                       :format="dateFormat"
        />
      </n-card>
    </n-modal>

<!--  回收优惠券  -->
    <n-modal v-model:show="isDel"
             preset="dialog"
             positive-text="回收"
             negative-text="取消"
             @positive-click="submitCallback2"
             @negative-click="cancelCallback2"
             style="width: 880px;"
    >
      <n-card
              style="width: 840px;height: 500px;"
              :bordered="false"
              size="huge"
              role="dialog"
              aria-modal="true"
      >
        <n-p>你选中了 {{ checkedRowKeysRef.length }} 行。</n-p>
        <n-data-table
                v-model:checked-row-keys="checkedRowKeysRef"
                :columns="columns"
                :data="dataArr"
                :pagination="pagination"

        />
      </n-card>
    </n-modal>


    <n-modal v-model:show="isAdminAdd"
             preset="dialog"
             positive-text="添加"
             negative-text="取消"
             @positive-click="submitCallback3"
             @negative-click="cancelCallback2"
             style="width: 580px;position: relative;"
             >
      <text style="position: absolute;left: 60px;top: 3px;">账户名：</text>
      <n-input v-model:value="adminInfo.username" type="text" placeholder="账户名" style="width: 70%;margin: 0 auto;display: block;margin-left: 120px;"/>
      <text style="position: absolute;left: 60px;top: 48px;">密码：</text>
      <n-input v-model:value="adminInfo.password" type="text" placeholder="密码" style="width: 70%;margin: 0 auto;display: block;margin-top: 10px;margin-left: 120px;"/>
    </n-modal>


  </div>
</template>


<script setup lang="ts">
    import {h, ref, VNode, onMounted,reactive,Component} from 'vue';
    import router from "../router";
    import useStore from '../store'
    import type {MenuOption} from 'naive-ui'
    import {DropdownGroupOption, DropdownOption, NIcon, DataTableColumns} from 'naive-ui'
    import axios from "axios";
    import date from "naive-ui/es/date-picker/src/panel/date";


    let adminInfo = reactive({
        username:'',
        password:''
    })
    let isDel = ref(false)
    let isAdminAdd = ref(false)
    let isAdd = ref(false)
    let currentUser = ''
    let lastTime = ''
    let dataArr:Array<RowData> = [
        {
            type:'1',
            parVal:0,
            openTime:'1',
            endTime:'1',
            status:'1',
            key:0
        }
    ]

    function addAdmin() {
        isAdminAdd.value = true

    }

    function submitCallback3() {
        if(!adminInfo.username || !adminInfo.password){
            window.$message.error("数据为空，添加失败")
            return;
        }
        axios.post("http://localhost:8080/user/addAdmin",{
        // axios.post("https://cchencs.top:8181/user/addAdmin",{
            username:adminInfo.username,
            password:adminInfo.password
        }).then(
            (d)=>{
                if(d.data.data){
                    window.$message.success("添加成功")
                }
                else window.$message.error("添加失败")
            }
        )
    }

    function controlUser(obj,st:number){
        // 节流函数
        let currentTime = Date.now()
        //2.判断当前时间 与 上次触发时间 是否超过间隔
        if (currentTime - lastTime >= 5000) {
            //3.存储本次的触发时间
            if(!st){
                // 禁用
                obj.isPermit = true

                axios.get("https://cchencs.top:8181/user/delUser/" + obj.id + "/0").then(
                    (d)=>{
                        if(d.data.data){
                            window.$message.info("禁用账户 " + obj.nickName )
                        }
                        else {
                            window.$message.error("出现错误")
                        }
                    }
                )
            }
            else{
                // 解禁
                obj.isPermit = false
                axios.get("https://cchencs.top:8181/user/delUser/" + obj.id + "/1").then(
                    (d)=>{
                        if(d.data.data){
                            window.$message.success("恢复账户 " + obj.nickName )
                        }
                        else {
                            window.$message.error("出现错误")
                        }
                    }
                )

            }
            lastTime = currentTime
        } else window.$message.info("点击过快，歇会~")

    }

    type RowData = {
        type: string
        parVal: number
        openTime: string
        endTime: string
        status: string
        key:number
    }

    let options = ref([
        {
            label:'',
            value:''
        }
    ])
    const pagination  = {pageSize: 4}
    let dateFormat = 'yyyy-MM-dd HH:mm:ss'
    const checkedRowKeysRef = ref<Array<string | number>>([])
    const columns: DataTableColumns<RowData> = [
        {
            type: 'selection',
            options: [
                'all',
                'none'
            ]
        },
        {
            title: '券种类',
            key: 'type'
        },
        {
            title: '券额',
            key: 'parVal'
        },
        {
            title: '起始日期',
            key: 'openTime'
        },
        {
            title: '结束日期',
            key: 'endTime'
        },
        {
            title: '状态',
            key: 'status'
        }
    ]

    const couponArr = [
        '已过期','生效中','未生效'
    ]

    let addCoupon = reactive({
        id:0,
        type:'',
        parVal:0,
        openTime:'',
        endTime:'',
        userId:'',
        alive:1
    })
    let userList = ref([{
        id:'',
        nickName:'',
        avatar:'',
        openId:'',
        status:0,
        lastTime:'',
        isPermit:false
    }])

    function showCoupon(val:string,status:boolean){
        options.value.splice(0)
        currentUser = val
        if(!status){
            // 发放
            axios.get("https://cchencs.top:8181/coupon/getCouponType").then(
                (d)=>{
                    d.data.data.forEach((r)=>{
                        options.value.push({
                            label:r,
                            value:r
                        })
                    })
                    isAdd.value = true
                }

            )


        }else{
            dataArr.splice(0)
            // 回收，根据userId拿到其所有优惠券
            axios.get("https://cchencs.top:8181/coupon/getAllCoupon/" + val).then(
                (d)=>{
                    if(d.data.data){
                        d.data.data.forEach((e)=>{
                            dataArr.push({
                                type:e.coupon.type,
                                parVal:e.coupon.parVal,
                                openTime:e.coupon.endTime,
                                endTime:e.coupon.endTime,
                                status:couponArr[Number(e.coupon.expire) + 1],
                                key:e.coupon.id
                            })
                        })
                    }

                    isDel.value = true
                }
            )

        }
    }

    function update(a,b){
        // a是毫秒，b是选择的日期字符串
        // console.log(a+"--"+b)
        addCoupon.openTime = b[0]
        addCoupon.endTime = b[1]
    }

    function submitCallback2(){
        // window.$message.success(isAdd.value + "111" + isDel.value)
        addCoupon.userId = currentUser
        if(isAdd.value){
            // TODO  发放，调用增加优惠券接口
            axios.post("https://cchencs.top:8181/coupon/addCoupon",addCoupon).then(
                (d)=>{
                    // console.log(d.data.data)
                    if(d.data.data) window.$message.success("发放成功")
                    else window.$message.error("发放失败")

                }
            )
        }
        if(isDel.value){
            // TODO 回收，调用删除优惠券接口
            axios.post("https://cchencs.top:8181/coupon/deleteMul",checkedRowKeysRef.value).then(
                (d)=>{
                    // console.log(d.data.data)
                    if(d.data.data) window.$message.success("回收成功")
                    else window.$message.error("回收失败")

                }
            )
        }
    }
    function cancelCallback2(){
        isAdd.value = false
        isDel.value = false
        isAdminAdd.value = false
    }

    onMounted(()=>{
        axios.get("https://cchencs.top:8181/user/getAllUser").then(
            (d)=>{
                // console.log(d.data.data)
                userList.value = d.data.data.filter((e)=>{
                    return e.lastTime
                })
                userList.value.forEach((e)=>{
                    e.lastTime = new Date(Date.parse(e.lastTime)) + ''
                    if(e.status === 2 || e.status === '2'){
                        e.isPermit = true
                    }
                })
            }
        )
    })
</script>


<style scoped lang="less">

</style>
