<template>
  <div style="width: 1200px;height: 600px;position:relative;left:5%;">
    <n-collapse :default-expanded-names="defaultShow">
      <n-collapse-item title="上线" name="add">
        <div style="width: 1000px;height: 720px;position: relative;background-color: rgb(245,245,245)">
          <text style="position: absolute;left: 30px;top: 33px;">
            活动标题：
          </text>
          <n-input v-model:value="ac.title" type="text"
                   placeholder="输入活动标题" style="position: absolute;left: 140px;top: 30px;width: 700px;"/>

          <text v-show="ac.type !== 4" style="position: absolute;left: 30px;top: 83px;">
            活动内容描述：
          </text>
          <n-input
                  v-model:value="ac.content"
                  type="textarea"
                  placeholder="输入活动内容描述"
                  style="position: absolute;left: 140px;top: 80px;width: 700px;"
                  :autosize="
                  {
                      minRows: 5,
                      maxRows: 5
                  }"
          />
          <text style="position: absolute;left: 30px;top: 223px;">
            活动日期：
          </text>
          <n-date-picker v-model:value="chooseTime" type="datetimerange"
                         clearable style="position: absolute;left: 140px;top: 223px;width: 700px;"
                         :is-date-disabled="disablePreviousDate"
                         :on-confirm="update"
                         :format="dateFormat"
          />

          <text style="position: absolute;left: 30px;top: 283px;">
            活动大图：
          </text>
          <n-upload
                  directory-dnd
                  :action="secretObj.host"
                  :max="5"
                  :data="secretObj"
                  style="position: absolute;left: 140px;top: 283px;width: 35%;"
                  :on-finish="showFile"
          >
            <n-upload-dragger>
              <div style="margin-bottom: 12px">
                <n-icon size="48" :depth="3">
                  <archive-icon />
                </n-icon>
              </div>
              <n-text style="font-size: 16px">
                点击或者拖动图片到该区域来上传
              </n-text>
              <n-p depth="3" style="margin: 8px 0 0 0">
                请不要上传敏感数据，比如你的银行卡号和密码，信用卡号有效期和安全码
              </n-p>
            </n-upload-dragger>
          </n-upload>

<!--          <text style="position: absolute;right: 400px;top: 303px;">-->
<!--            活动详情图：-->
<!--          </text>-->
<!--          <n-upload-->
<!--                  directory-dnd-->
<!--                  :action="secretObj.host"-->
<!--                  :max="5"-->
<!--                  style="position: absolute;right: 30px;top: 303px;width: 35%;"-->
<!--                  :data="secretObj"-->
<!--                  :on-finish="showFile2"-->
<!--          >-->
<!--            <n-upload-dragger>-->
<!--              <div style="margin-bottom: 12px">-->
<!--                <n-icon size="48" :depth="3">-->
<!--                  <archive-icon />-->
<!--                </n-icon>-->
<!--              </div>-->
<!--              <n-text style="font-size: 16px">-->
<!--                点击或者拖动图片到该区域来上传-->
<!--              </n-text>-->
<!--              <n-p depth="3" style="margin: 8px 0 0 0">-->
<!--                请不要上传敏感数据，比如你的银行卡号和密码，信用卡号有效期和安全码-->
<!--              </n-p>-->
<!--            </n-upload-dragger>-->
<!--          </n-upload>-->

          <text style="position: absolute;left: 30px;top: 533px;">
            主办方备注：
          </text>
          <n-input v-model:value="ac.msg" type="text"
                   placeholder="活动主办方备注：" style="position: absolute;left: 140px;top: 530px;width: 700px;"/>

          <text style="position: absolute;left: 30px;top: 603px;">
            活动类型：
          </text>
          <n-radio-group v-model:value="ac.type" name="radiogroup" style="position: absolute;left: 140px;top: 603px;">
            <n-space>
              <n-radio :value="4">
                分享促销型
              </n-radio>
<!--              <n-radio :value="4">-->
<!--                抢购优惠券型-->
<!--              </n-radio>-->
              <n-radio :value="3">
                抢购商品型
              </n-radio>
            </n-space>
          </n-radio-group>

          <text style="position: absolute;right: 450px;top: 603px;" v-show="ac.type === 3">
            商品选择：
          </text>
          <n-select v-model:value="ac.goodsId" :options="options"
                    style="position: absolute;top: 600px;right: 235px;width: 210px"
                    v-show="ac.type === 3"
          />
          <text style="position: absolute;right: 150px;top: 603px;" v-show="ac.type === 3">
            商品库存：
          </text>
          <n-input v-model:value="ac.kucun" type="text" placeholder="输入商品库存："
                   style="position: absolute;top: 600px;width: 120px;right: 20px;"
                   v-show="ac.type === 3"
          />

          <!-- 优惠券种类 -->
          <text style="position: absolute;right: 450px;top: 603px;" v-show="ac.type === 4">
            优惠券种类：
          </text>
          <n-select v-model:value="cou_type" :options="options2"
                    style="position: absolute;top: 600px;right: 345px;width: 100px"
                    v-show="ac.type === 4"
          />
          <!-- 优惠券券额 -->
          <text style="position: absolute;right: 290px;top: 603px;" v-show="ac.type === 4">
            券额：
          </text>
          <n-input-number v-model:value="cou_num"
                          v-show="ac.type === 4"
                          style="position: absolute;top: 600px;right: 180px;width: 110px;" placeholder="">
            <template #prefix>
              ￥
            </template>
          </n-input-number>


          <!-- 设置有效期 -->
          <text style="position: absolute;right: 550px;top: 653px;" v-show="ac.type === 4">
            有效期：
          </text>
          <n-date-picker v-model:value="chooseTime2" type="datetimerange"
                         clearable style="position: absolute;right: 42px;top: 650px;width: 500px;"
                         :is-date-disabled="disablePreviousDate"
                         :on-confirm="update2"
                         :format="dateFormat"
                         v-show="ac.type === 4"
          />

          <!-- 设置数量 -->
          <text style="position: absolute;right: 120px;top: 603px;" v-show="ac.type === 4">
            数量：
          </text>
          <n-input v-model:value="cou_count" type="text" placeholder="输入数量："
                   style="position: absolute;top: 600px;width: 80px;right:40px;"
                   v-show="ac.type === 4"
          />

          <n-button type="success" style="position: absolute; bottom: 20px;left: 30px;width: 130px;"
                    @click="finishAdd">上传</n-button>
          <n-button type="info" style="position: absolute; bottom: 20px;left: 180px;width: 130px;"
                    @click="cancelAdd">清除</n-button>

        </div>
      </n-collapse-item>
      <n-collapse-item title="下线" name="del">
        <div style="width: 1000px;height: 100px;position: relative;background-color: rgb(245,245,245)">
          <text style="position: absolute;left: 30px;top: 33px;">
            选择商品标题：
          </text>
          <n-select v-model:value="del_ac_id" :options="ac_options"
                    style="position: absolute;top: 30px;left: 150px;width: 310px"
          />
          <n-button type="success" @click="delAc" style="position: absolute;top: 30px;left: 480px;width: 100px;">下线</n-button>
        </div>
      </n-collapse-item>
    </n-collapse>
  </div>
</template>


<script setup lang="ts">
    import {h, ref, VNode, onMounted,reactive,computed,onUpdated,watch} from 'vue';
    import axios from "axios";

    import { ArchiveOutline as ArchiveIcon } from '@vicons/ionicons5'
    import router from "../router";
    let a = ArchiveIcon
    let defaultShow = ref([''])
    let chooseTime = ref<[number, number]>([Date.now(), Date.now() + 86400000])
    let chooseTime2 = ref<[number, number]>([Date.now(), Date.now() + 86400000])
    let dateFormat = 'yyyy-MM-dd hh:mm:ss'
    let del_ac_id = ref()
    let cou_type = ref('')
    let cou_num = ref()
    let cou_time = ref('')
    let cou_count = ref()

    let ac = reactive({
        title:"",
        content:'',
        openTime:'',
        endTime:'',
        img:'',   // 活动大图
        // shareImg:'',  // 详情图
        msg:'',  // 备注
        type:'',  // 活动类型
        kucun:0,  // 3下的库存
        goodsId:0,   // 3下的商品id
        coupon:''
    })
    let options = ref([
        {
            label:'',
            value:''
        }
    ])
    let ac_options = ref([
        {
            label:'',
            value:''
        }
    ])
    let options2 = ref([
        {
            label:'',
            value:''
        }
    ])

    let secretObj = reactive({
        OSSAccessKeyId:'',
        policy:'',
        Signature:'',
        dir:'',
        host:'',
        key:'',
        // callback:''
    });

    function delAc() {
        if(del_ac_id.value){
            axios.get("https://cchencs.top:8181/activity/del/" + del_ac_id.value).then(
                (d)=>{
                  if(d.data.data) window.$message.success("下线成功！")
                }
            )
        }else{
            window.$message.error("请先选择需要下线的活动!")
        }

    }

    function update(a,b){
        // console.log(a+"--"+b)
        ac.openTime = b[0]
        ac.endTime = b[1]
        // console.log(ac.openTime,ac.endTime)
    }

    function update2(a,b){
        // console.log(a+"--"+b)
        cou_time.value = b[0] + '？' + b[1]
        // console.log(ac.openTime,ac.endTime)
    }

    onMounted(()=>{
        show()
        axios.get("https://cchencs.top:8181/goods/getAllGoods").then(
            (d)=>{
                options.value.splice(0)
                d.data.data.forEach((e)=>{
                    options.value.push({
                        label: e.title,
                        value: e.id
                    })
                })
            }
        )

        axios.get("https://cchencs.top:8181/activity/getAllActivity").then(
            (d)=>{
                ac_options.value.splice(0)
                d.data.data.forEach((e)=>{
                    ac_options.value.push({
                        label: e.title,
                        value: e.id
                    })
                })
            }
        )

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
        // 获取所有优惠券种类
        axios.get("https://cchencs.top:8181/coupon/getCouponType").then(
            (d)=>{
                options2.value.splice(0)
                d.data.data.forEach((e)=>{
                    options2.value.push({
                        label: e,
                        value: e
                    })
                })

            }
        )
    })


    function showFile(option){
        ac.img = "https://ccsmybucket.oss-cn-hangzhou.aliyuncs.com/activity/" + option.file.name
    }

    // function showFile2(option){
    //     ac.shareImg = "https://ccsmybucket.oss-cn-hangzhou.aliyuncs.com/activity/" + option.file.name
    // }


    function cancelAdd(){
        ac.title = ''
        ac.content = ''
        ac.msg = ''
        ac.type = ''
        ac.goodsId = 0
        ac.kucun = 0
        ac.openTime = ''
        ac.endTime = ''
        cou_count.value = ''
        cou_num.value = ''
        cou_type.value = ''
        chooseTime.value = [Date.now(), Date.now() + 86400000]
        chooseTime2.value = [Date.now(), Date.now() + 86400000]
    }

    onUpdated(()=>{
        show()

    })
    function disablePreviousDate (ts: number) {
        return ts < Date.now() - 7 * 86400000
    }

    function finishAdd() {
        if(!ac.openTime || !ac.endTime) {
            window.$message.error("请确认日期")
            return;
        }
        if(ac.type === 4 && (!cou_time.value.split("？")[0] || !cou_time.value.split("？")[1])){
            window.$message.error("请确认优惠券有效期")
            return;
        }
        if(ac.type === 4){
            ac.coupon = cou_type.value + '？' + cou_num.value + '？' + cou_time.value + '？' + cou_count.value
        }
        axios.post("https://cchencs.top:8181/activity/addActivity",ac).then(
            (d)=>{
                if(d.data.data){
                    window.$message.success("上线成功！")
                }
            }
        )
    }

    function show() {
        let query = router.currentRoute.value.query.data
        // window.$message.error(query)
        // console.log(query)
        if(query){
            defaultShow.value.splice(0)
            defaultShow.value.push(query)
            // console.log(defaultShow.value)
        }
    }


    // add del select update
</script>


<style scoped lang="less">

</style>
