<template>
  <n-modal v-model:show="showUpdate">
    <n-card
            style="width: 600px;height: 200px;border-radius: 20px;position: relative;"
            title="修改库存"
            :bordered="false"
            size="huge"
            role="dialog"
            aria-modal="true"
    >
      <text style="position: absolute;top: 83px;left: 100px;font-size: 15px;">
        库存：
      </text>
      <n-input-number v-model:value="updateCarCount" placeholder="输入库存：" style="position: absolute;top: 80px;left: 180px;width: 280px;"/>
      <n-button type="info" style="position: absolute;bottom: 23px;right: 170px;width: 80px;" @click="cancel4">取消</n-button>
      <n-button type="success" style="position: absolute;bottom: 23px;right: 70px;width: 80px;" @click="sure4">确定</n-button>
    </n-card>
  </n-modal>
  <n-modal v-model:show="showUpdate2">
    <n-card
            style="width: 600px;height: 200px;border-radius: 20px;position: relative;"
            title="修改价格"
            :bordered="false"
            size="huge"
            role="dialog"
            aria-modal="true"
    >
      <text style="position: absolute;top: 83px;left: 100px;font-size: 15px;">
        价格：
      </text>
      <n-input v-model:value="updatePrice" placeholder="输入价格：" style="position: absolute;top: 80px;left: 180px;width: 280px;" />
      <n-button type="info" style="position: absolute;bottom: 23px;right: 170px;width: 80px;" @click="cancel5">取消</n-button>
      <n-button type="success" style="position: absolute;bottom: 23px;right: 70px;width: 80px;" @click="sure5">确定</n-button>
    </n-card>
  </n-modal>

  <n-modal v-model:show="showAddSpace"
           preset="dialog"
           positive-text="上架"
           negative-text="取消"
           @positive-click="sure3"
           @negative-click="cancel3"
           style="width: 700px;height: 820px;border-radius: 20px;"
  >

    <n-card
            style="width: 600px;height: 700px;border-radius: 20px;position: relative;overflow-y: scroll;"
            :bordered="false"
            size="huge"
            role="dialog"
            aria-modal="true"
    >
      <text style="position: absolute;top: 3px;left: 40px;font-size: 15px;">汽车名称：</text>
      <n-input v-model:value="currentCar.name" type="text" placeholder="汽车名称："
               style="position: absolute;top: 0px;left: 130px;width: 400px;height: 35px;"/>

      <text style="position: absolute;top: 63px;left: 40px;font-size: 15px;">汽车价格：</text>
      <n-input-number v-model:value="currentCar.price" style="position: absolute;top: 60px;left: 130px;width: 150px;" placeholder="">
        <template #prefix>
          ￥
        </template>
      </n-input-number>

      <text style="position: absolute;top: 63px;right: 215px;font-size: 15px;">汽车型号：</text>
      <n-input v-model:value="currentCar.type" type="text" placeholder="汽车型号："
               style="position: absolute;top: 60px;right: 60px;width: 150px;height: 35px;"/>

      <!-- 汽车图片上传 -->
      <text style="position: absolute;top: 120px;left: 40px;font-size: 15px;">汽车图片：</text>
      <n-upload
              directory-dnd
              :action="secretObj.host"
              :max="5"
              :data="secretObj"
              style="position: absolute;left: 40px;top: 168px;width: 22%;"
              :on-finish="showFile3"
      >
        <n-upload-dragger>
          <div style="margin-bottom: 12px">
            <n-icon size="48" :depth="3">
              <archive-icon />
            </n-icon>
          </div>

        </n-upload-dragger>
      </n-upload>
      <!-- 汽车详情页顶部图片上传 -->
      <text style="position: absolute;top: 120px;left: 210px;font-size: 15px;">详情页顶部图：</text>
      <n-upload
              directory-dnd
              :action="secretObj.host"
              :max="5"
              :data="secretObj"
              style="position: absolute;left: 210px;top: 168px;width: 22%;"
              :on-finish="showFile4"
      >
        <n-upload-dragger>
          <div style="margin-bottom: 12px">
            <n-icon size="48" :depth="3">
              <archive-icon />
            </n-icon>
          </div>


        </n-upload-dragger>
      </n-upload>
      <!-- 汽车详情图片上传 -->
      <text style="position: absolute;top: 120px;left: 385px;font-size: 15px;">详细参数图：</text>
      <n-upload
              directory-dnd
              :action="secretObj.host"
              :max="5"
              :data="secretObj"
              style="position: absolute;left: 385px;top: 168px;width: 22%;"
              :on-finish="showFile5"
      >
        <n-upload-dragger>
          <div style="margin-bottom: 12px">
            <n-icon size="48" :depth="3">
              <archive-icon />
            </n-icon>
          </div>


        </n-upload-dragger>
      </n-upload>


      <div style="position: relative;height: 400px;top: 285px;">
        <n-input-group style="position: absolute;top: 18px;left: 20px;font-size: 15px;">
          <n-input-group-label>发动机参数：</n-input-group-label>
          <n-input :style="{ width: '70%' }" v-model:value="currentCar.engine" placeholder=""/>
        </n-input-group>
        <n-input-group style="position: absolute;top: 58px;left: 20px;font-size: 15px;">
          <n-input-group-label>排量：</n-input-group-label>
          <n-input :style="{ width: '63%' }" v-model:value="currentCar.output" placeholder=""/>
          <n-input-group-label>立方厘米</n-input-group-label>
        </n-input-group>
        <n-input-group style="position: absolute;top: 98px;left: 20px;font-size: 15px;">
          <n-input-group-label>额定功率：</n-input-group-label>
          <n-input :style="{ width: '58%' }" v-model:value="currentCar.regularKW" placeholder=""/>
          <n-input-group-label>kw/rpm</n-input-group-label>
        </n-input-group>
        <n-input-group style="position: absolute;top: 138px;left: 20px;font-size: 15px;">
          <n-input-group-label>最大输出功率：</n-input-group-label>
          <n-input :style="{ width: '52.5%' }" v-model:value="currentCar.maxKW" placeholder=""/>
          <n-input-group-label>kw/rpm</n-input-group-label>
        </n-input-group>
        <n-input-group style="position: absolute;top: 178px;left: 20px;font-size: 15px;">
          <n-input-group-label>最大输出扭矩：</n-input-group-label>
          <n-input :style="{ width: '51.5%' }" v-model:value="currentCar.maxNM" placeholder=""/>
          <n-input-group-label>Nm/rpm</n-input-group-label>
        </n-input-group>
        <n-input-group style="position: absolute;top: 218px;left: 20px;font-size: 15px;">
          <n-input-group-label>变速器：</n-input-group-label>
          <n-input :style="{ width: '75.5%' }" v-model:value="currentCar.speedChanger" placeholder=""/>
        </n-input-group>
        <n-input-group style="position: absolute;top: 258px;left: 20px;font-size: 15px;">
          <n-input-group-label>驱动方式：</n-input-group-label>
          <n-input :style="{ width: '72.5%' }" v-model:value="currentCar.driveMode" placeholder=""/>
        </n-input-group>
        <n-input-group style="position: absolute;top: 298px;left: 20px;font-size: 15px;">
          <n-input-group-label>油箱体积：</n-input-group-label>
          <n-input :style="{ width: '66.5%' }" v-model:value="currentCar.oilBox" placeholder=""/>
          <n-input-group-label>L</n-input-group-label>
        </n-input-group>
        <n-input-group style="position: absolute;top: 338px;left: 20px;font-size: 15px;">
          <n-input-group-label>最大允许重量：</n-input-group-label>
          <n-input :style="{ width: '59%' }" v-model:value="currentCar.maxHeight" placeholder=""/>
          <n-input-group-label>KG</n-input-group-label>
        </n-input-group>
      </div>
    </n-card>
  </n-modal>
  <div style="width: 1100px;height: 600px;position:relative;left:5%;">

    <n-select :options="carTypeList"
              style="width: 200px;margin-bottom: 20px;"
              @update:value="changeType"
              placeholder="汽车系列"
    />
    <img @click="changeType(selectCarType)" src="https://ccsmybucket.oss-cn-hangzhou.aliyuncs.com/%E5%88%B7%E6%96%B0.png"
         style="width: 30px;height: 30px;position: absolute;left: 210px;top: 3px;">
    <n-button @click="showAddSpace = true" type="success" dashed style="width: 100px;height: 33px;position: absolute;left: 260px;top: 3px;">
      上架
    </n-button>
    <n-spin :show="isLoading" size="large">
    <n-space :wrap="true" :inline="true" size="large">
      <template v-for="(item,index) in carList">
        <n-card v-if="item.status === 0" style="width: 350px;height: 270px;position: relative;" hoverable>
          <img :src="'https://ccsmybucket.oss-cn-hangzhou.aliyuncs.com/activity/' + item.id + '-car.jpg'"
               style="position: absolute;top:10px;left: 35px;width: 280px;height: 170px;">
          <text style="position: absolute;top: 190px;left: 35px;font-size: 18px;width: 140px;">
              {{item.name}}
          </text>
          <text style="position: absolute;top: 195px;right: 60px;">
            预约次数：{{item.preCount}}
          </text>
          <n-dropdown trigger="hover" :options="[
              {label: '价格：' + item.price},
              {label: '发动机参数： ' + item.engine},
              {label: '排量： ' + item.output},
              {label: '额定功率： ' + item.regularKW},
              {label: '最大输出功率' + item.maxKW},
              {label: '最大输出扭矩' + item.maxNM},
              {label: '变速器' + item.speedChanger},
              {label: '驱动方式' + item.driveMode},
              {label: '油箱体积' + item.oilBox},
              {label: '最大允许重量' + item.maxHeight}
          ]" >
            <n-button style="position: absolute;top: 230px;right: 43px;" tertiary type="info" size="small">参数</n-button>
          </n-dropdown>
          <n-popconfirm :show-icon="false"
                        @positive-click="handlePositiveClick(item.id)"
                        @negative-click="handleNegativeClick">
            <template #trigger>
              <n-button @click="delCar" style="position: absolute;top: 230px;right: 100px;" tertiary type="error" size="small">下架</n-button>
            </template>
            确定下架？
          </n-popconfirm>
          <n-button @click="showCount(item.id)" style="position: absolute;top: 230px;right: 158px;" strong secondary size="small">库存</n-button>
          <n-button @click="updateCarPrice(item.id)" style="position: absolute;top: 230px;right: 215px;" type="success" quaternary  size="small">改价</n-button>
        </n-card>
        <n-card v-if="item.status === 1" style="width: 350px;height: 270px;position: relative;" hoverable @mouseover="showBackBut(index)" @mouseleave="showBackBut2(index)">
          <div id="zhemu" style="width: 350px;height: 270px;position: absolute;z-index: 9;top: 0;left: 0;background-color: rgba(0,0,0,0.3);">
            <!-- 遮罩层 -->
            <text style="padding: 20px;color: white;display: block;font-size: 18px;">已下架</text>
            <n-button @click="backCar(item.id)" v-show="showBackButArr[index]" style="width: 40%;height: 40px;background-color: white;position: absolute; left: 33%;top: 42%;">重新上架</n-button>
          </div>
          <img :src="'https://ccsmybucket.oss-cn-hangzhou.aliyuncs.com/activity/' + item.id + '-car.jpg'"
               style="position: absolute;top:10px;left: 35px;width: 280px;height: 170px;">
          <text style="position: absolute;top: 190px;left: 35px;font-size: 18px;width: 140px;">
            {{item.name}}
          </text>
          <text style="position: absolute;top: 195px;right: 60px;">
            预约次数：{{item.preCount}}
          </text>

        </n-card>
      </template>

    </n-space>
    </n-spin>
  </div>

</template>


<script setup lang="ts">
    import {h, ref, VNode, onMounted,reactive,Component} from 'vue';
    import router from "../router";
    import useStore from '../store'
    import type {MenuOption} from 'naive-ui'
    import {DropdownGroupOption, DropdownOption, NIcon} from 'naive-ui'
    import axios from "axios";
    import { ArchiveOutline as ArchiveIcon } from '@vicons/ionicons5'
    let carList = ref([{
        id:'',   // id
        type: '',  // 汽车型号
        name:'',   // 汽车名称
        price:'',  // 价格
        title:'',  // 汽车类型
        carImg:'',  // 汽车图片路径
        shareImg:'',  // 官方商城直达图路径
        detailImg:'',  // 汽车详细参数图路径
        engine:'',  //发动机参数
        output:'',  // 排量
        regularKW:'',  // 额定功率
        maxKW:'',  // 最大输出功率
        maxNM:'',  // 最大输出扭矩
        speedChanger:'',  // 变速器
        driveMode:'', // 驱动方式
        oilBox:'',  // 油箱体积
        maxHeight:'',  // 最大允许重量
        preCount:0, // 被预约数
        status:2
    }])
    let updatePrice = ref()
    let selectCarType = ref('all')
    let currentCar = reactive({
        name:'',
        price:'',
        title:'',
        carImg:'',
        shareImg:'',
        detailImg:'',
        // 参数
        engine:'',
        output:'',
        regularKW:'',
        maxKW:'',
        maxNM:'',
        speedChanger:'',
        driveMode:'',
        oilBox:'',
        maxHeight:'',
        type:''
    })


    let carTypeList = ref([{
        label:'全部',
        value:'all'
    }])
    let showBackButArr = ref([

    ])
    let showUpdate = ref(false)
    let updateCarCount = ref('')

    let isLoading = ref(false)
    let showAddSpace = ref(false)
    let updateCountId = ref()
    let updatePriceId = ref()
    let showUpdate2 = ref(false)
    let secretObj = reactive({
        OSSAccessKeyId:'',
        policy:'',
        Signature:'',
        dir:'',
        host:'',
        key:'',
        // callback:''
    });


    onMounted(()=>{
        show()
        getAllCar()

        // 获取oss信息进行上传
        axios.get('https://cchencs.top:8181/activity/upload').then(
            resp => {
                secretObj.OSSAccessKeyId = resp.data.accessid
                secretObj.policy = resp.data.policy
                secretObj.Signature = resp.data.signature
                secretObj.dir = resp.data.dir
                secretObj.host = resp.data.host
                secretObj.key = resp.data.dir + '${filename}'
                // secretObj.callback = resp.data.callback
                // console.log(secretObj)
            },
            error => {
                console.log(error.reason)
            }
        )
    })

    function showBackBut(idx:number) {
        // console.log(idx)
        showBackButArr.value[idx] = true
    }

    function backCar(id:number) {
        axios.get("https://cchencs.top:8181/backCar/" + id).then(
            (d)=>{
                if(d.data.data) {
                    window.$message.success("上架成功")
                    getAllCar()
                }
                else {
                    window.$message.error("重新上架失败")
                }
            }
        )
    }

    function showBackBut2(idx:number) {
        // console.log(idx)
        showBackButArr.value[idx] = false
    }

    function updateCarPrice(id:number) {
        updatePriceId.value = id
        showUpdate2.value = true
        axios.get("https://cchencs.top:8181/getCarById/" + id).then(
            (d)=>{
                updatePrice.value = d.data.data.price
            }
        )
    }

    function showCount(id:number) {
        showUpdate.value = true
        updateCountId.value = id
    }

    function sure3() {
        showAddSpace.value = false
        axios.post("https://cchencs.top:8181/addCar",currentCar).then(
            (d)=>{
                if(d.data.data){
                    // console.log(currentCar)
                    window.$message.success("上架成功")
                    currentCar = {
                        name:'',
                        price:'',
                        title:'',
                        carImg:'',
                        shareImg:'',
                        detailImg:'',
                        // 参数
                        engine:'',
                        output:'',
                        regularKW:'',
                        maxKW:'',
                        maxNM:'',
                        speedChanger:'',
                        driveMode:'',
                        oilBox:'',
                        maxHeight:''
                    }
                }
                else{
                    window.$message.success("上架失败")
                }
            }
        )
    }

    function handlePositiveClick(id) {
        // window.$message.error("id=" + id)
        isLoading.value = true
        axios.get('https://cchencs.top:8181/delCar/' + id).then(
            (d)=>{
              if (d.data.data) {
                  window.$message.success("已下架！")
                  changeType(selectCarType.value)
              }
            }
        )
    }

    function sure5() {
        showUpdate2.value = false
        axios.get("https://cchencs.top:8181/updateCarPrice/" + updatePriceId.value + "/" + updatePrice.value).then(
            (d)=>{
                if(d.data.data){
                    window.$message.success("修改成功")
                    getAllCar()
                }else{
                    window.$message.error("修改失败")
                }
            }
        )
    }

    function cancel5() {
        showUpdate2.value = false
    }

    function showFile3(option){
        console.log(option.file.name)
        currentCar.carImg = "https://ccsmybucket.oss-cn-hangzhou.aliyuncs.com/" + option.file.name
    }
    function showFile4(option){
        console.log(option.file.name)
        currentCar.shareImg = "https://ccsmybucket.oss-cn-hangzhou.aliyuncs.com/" + option.file.name
    }
    function showFile5(option){
        console.log(option.file.name)
        currentCar.detailImg = "https://ccsmybucket.oss-cn-hangzhou.aliyuncs.com/" + option.file.name
    }

    function handleNegativeClick() {

    }


    function cancel3() {
        showAddSpace.value = false
    }


    function show() {
        axios.get("https://cchencs.top:8181/getAllCarType").then(
            (d)=>{
                carTypeList.value.splice(1)
                d.data.data.forEach((e)=>{
                    carTypeList.value.push({
                        label:e,
                        value:e
                    })
                })
            }
        )
    }
    function changeType(value:string) {
        isLoading.value = true
        // console.log(value)
        selectCarType.value = value
        if(value === 'all') {
            getAllCar()
            return;
        }
        axios.get("https://cchencs.top:8181/getCarByType/" + value).then(
            (d)=>{
                // console.log(d.data.data)
                carList.value.splice(0)
                let arr = []
                d.data.data.forEach((e)=>{
                    if(e.status === 1){
                        arr.push(e)
                        console.log(e)
                    }else if(e.status === 0){
                        carList.value.push(e)
                    }else{
                        window.$message.error("未知订单错误")
                    }
                })
                carList.value.concat(arr)
                setTimeout(()=>{
                    isLoading.value = false
                    window.$message.success("加载完成")
                },500)
            },
            (e)=>{
                window.$message.error("加载失败")
            }
        )
    }
    function getAllCar() {
        axios.get("https://cchencs.top:8181/getAllCar").then(
            (d)=>{
                carList.value.splice(0)
                console.log(111)
                let arr = []
                d.data.data.forEach((e)=>{
                    if(e.status === 1){
                        arr.push(e)
                        console.log(e)
                    }else if(e.status === 0){
                        carList.value.push(e)
                    }else{
                        window.$message.error("未知订单错误")
                    }
                })
                carList.value = carList.value.concat(arr)
                isLoading.value = false
                window.$message.success("加载完成")
            },
            (e)=>{
                window.$message.error("加载失败")
            }
        )
    }

    function delCar() {

    }

    function sure4() {
        showUpdate.value = false
        axios.get("https://cchencs.top:8181/updateCar/" + updateCountId.value + "/" + updateCarCount.value).then(
            (d) => {
                if(d.data.data){
                    window.$message.success("修改成功！")
                }
            }
        )
    }
    function cancel4() {
        showUpdate.value = false
    }

</script>


<style scoped lang="less">

</style>
