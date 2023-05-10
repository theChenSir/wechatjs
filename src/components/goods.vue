<template>
  <div style="position: relative;left: 30px;top: 0px;width: 1200px;">
    <n-p> 已选择 {{ checkedRowKeys.length }} 个商品。 </n-p>
    <n-button @click="showAddModal = true" type="info" dashed style="width: 100px;height: 33px;">
      增加新商品
    </n-button>
    <n-button @click="delGoods" type="error" dashed style="width: 100px;height: 33px;margin-left: 10px;margin-bottom: 10px;">
      删除
    </n-button>
    <img @click="show" src="https://ccsmybucket.oss-cn-hangzhou.aliyuncs.com/%E5%88%B7%E6%96%B0.png" style="width: 30px;height: 30px;position: absolute;left: 230px;top: 40px;">
    <n-data-table
            v-model:checked-row-keys="checkedRowKeys"
            :columns="columns"
            :data="tableData"
            :pagination="pagination"
            :loading="isLoading"
            @update:checked-row-keys="handleCheck"
            :bordered="true"
    />
  </div>

  <n-modal v-model:show="showAddModal">
    <n-card
            style="width: 600px;height: 730px;border-radius: 20px;position: relative;"
            title="添加商品"
            :bordered="false"
            size="huge"
            role="dialog"
            aria-modal="true"
    >
      <text style="position: absolute;top: 93px;left: 50px;font-size: 15px;">商品名称：</text>
      <n-input v-model:value="currentGoods.name" type="text" placeholder="商品名称："
               style="position: absolute;top: 90px;left: 140px;width: 400px;height: 35px;"/>
      <text style="position: absolute;top: 153px;left: 50px;font-size: 15px;">商品价格：</text>
      <n-input-number v-model:value="currentGoods.price" style="position: absolute;top: 150px;left: 140px;width: 120px;">
        <template #prefix>
          ￥
        </template>
      </n-input-number>
      <text style="position: absolute;top: 153px;left: 320px;font-size: 15px;">商品库存：</text>
      <n-input-number v-model:value="currentGoods.count" style="position: absolute;top: 150px;left: 410px;width: 120px;"></n-input-number>

      <text style="position: absolute;top: 213px;left: 50px;font-size: 15px;">商品图：</text>
      <text style="position: absolute;top: 213px;left: 320px;font-size: 15px;">商品详情图：</text>

      <n-upload
              directory-dnd
              :action="secretObj.host"
              :max="5"
              :data="secretObj"
              style="position: absolute;left: 40px;top: 263px;width: 35%;"
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


      <n-upload
              directory-dnd
              :action="secretObj.host"
              :max="5"
              :data="secretObj"
              style="position: absolute;left: 320px;top: 263px;width: 35%;"
              :on-finish="showFile2"
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

      <text style="position: absolute;bottom: 130px;left: 40px;font-size: 15px;">商品规格：（比如黑色+L，多个种类用;间隔）</text>
      <n-input v-model:value="currentGoods.type" type="text" placeholder="商品规格："
               style="position: absolute;bottom: 85px;left: 40px;width: 490px;height: 35px;"/>

      <n-button type="info" style="position: absolute;bottom: 23px;right: 170px;width: 80px;" @click="cancel">取消</n-button>
      <n-button type="success" style="position: absolute;bottom: 23px;right: 70px;width: 80px;" @click="sure">添加</n-button>



    </n-card>
  </n-modal>

  <n-modal v-model:show="showModal">
    <n-card
            style="width: 600px;height: 260px;border-radius: 20px;position: relative;"
            title="修改商品"
            :bordered="false"
            size="huge"
            role="dialog"
            aria-modal="true"
    >
      <text style="position: absolute;top: 83px;left: 180px;font-size: 15px;">
        改价：
      </text>
      <n-input-number v-model:value="updateGoods.price" style="position: absolute;top: 80px;left: 280px;width: 120px;"/>
      <text style="position: absolute;top: 133px;left: 180px;font-size: 15px;">
        改库存：
      </text>
      <n-input-number v-model:value="updateGoods.count" style="position: absolute;top: 130px;left: 280px;width: 120px;"/>
      <n-button type="info" style="position: absolute;bottom: 23px;right: 170px;width: 80px;" @click="cancel2">取消</n-button>
      <n-button type="success" style="position: absolute;bottom: 23px;right: 70px;width: 80px;" @click="sure2">确定</n-button>
    </n-card>
  </n-modal>


</template>


<script setup lang="ts">
    import {h, ref, VNode, onMounted,reactive,computed,onUpdated,watch} from 'vue';
    import axios from "axios";
    import { ArchiveOutline as ArchiveIcon } from '@vicons/ionicons5'
    import router from "../router";
    import type { DataTableColumns,DataTableRowKey  } from 'naive-ui'
    import { NTag,NInputNumber,NButton,NDropdown,NImage} from 'naive-ui'

    let currentGoods = reactive({
        name:'',
        price:'',
        title:'',
        type:'',
        count:'',
        img:'',
        detailImg:''
    })

    let secretObj = reactive({
        OSSAccessKeyId:'',
        policy:'',
        Signature:'',
        dir:'',
        host:'',
        key:'',
        // callback:''
    });

    let showAddModal = ref(false)
    let showModal = ref(false)
    let isLoading = ref(true)

    let updateGoods = reactive({
        id:0,
        count:0,
        price:0
    })
    onMounted(()=>{
        show()

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
    const checkedRowKeys = ref<DataTableRowKey[]>([])

    function show() {

        axios.get("https://cchencs.top:8181/goods/getAllGoods").then(
            (d)=>{
                tableData.value.splice(0)
                isLoading.value = false
                d.data.data.forEach((e)=>{
                    if(!e.type) e.type = ''
                    tableData.value.push({
                        key:e.id,
                        img:e.img,
                        name:e.name,
                        price:e.price,
                        type:e.type.split(";"),
                        count:e.count,
                        sell:e.sell
                    })
                })
            }
        )
    }

    function showFile(option){
        console.log(option.file.name)
        currentGoods.img = "https://ccsmybucket.oss-cn-hangzhou.aliyuncs.com/activity/" + option.file.name
    }
    function showFile2(option){
        console.log(option.file.name)
        currentGoods.detailImg = "https://ccsmybucket.oss-cn-hangzhou.aliyuncs.com/activity/" + option.file.name
    }

    function handleCheck (rowKeys: DataTableRowKey[]) {
        // console.log(rowKeys)
        checkedRowKeys.value = rowKeys
    }

    function sure () {
        axios.post('https://cchencs.top:8181/goods/addGooods',currentGoods).then(
            (d)=>{
                if(d.data.data) {
                    show()
                    window.$message.success("添加成功！")
                    currentGoods.type = ''
                    currentGoods.detailImg = ''
                    currentGoods.title = ''
                    currentGoods.name = ''
                    currentGoods.img = ''
                    currentGoods.count = ''
                    currentGoods.price = ''
                }
            }
        )
        showAddModal.value = false
    }
    function cancel () {
        showAddModal.value = false
    }
    function sure2 () {
        // window.$message.error(updateGoods.id)
        axios.get('https://cchencs.top:8181/goods/updateGoods/' + updateGoods.id + '/' + updateGoods.count + "/" + updateGoods.price).then(
            (d)=>{
                if(d.data.data) {
                    show()
                    window.$message.success("修改成功！")
                    updateGoods.count = ''
                    updateGoods.price = ''
                    showModal.value = false
                }
            }
        )
        showAddModal.value = false
    }
    function cancel2 () {
        showModal.value = false
    }

    type RowData = {
        key:number
        img:string
        name: string
        price: number
        type: string[]
        count: number
        sell: number
    }



    const tableData : RowData[] = ref([
        {
            key:0,
            name:'name',
            price:0,
            type:['a','b'],
            count:1,
            sell:99
        }
    ])
    // ellipsis:true resizable:true
    const columns:DataTableColumns<RowData> = [
        {
            type: 'selection'
        },
        {
            title: '商品',
            key:'img',
            resizable:true,
            width: 80,
            render(row, index) {
                return h(NImage, {
                    src: row.img,
                    style:{
                        width:'80px',
                        height:'80px'
                    }
                })
            }
        },
        {
            title: '名称',
            key: 'name',
            resizable:true,
            width: 250,

        },
        {
            title: '销量',
            key: 'sell',
            resizable:true,
            width:80
        },
        {
            title: '价格',
            key: 'price',
            resizable:true,
            width:80
        },
        {
            title: '库存',
            key: 'count',
            resizable:true,
            width:80
        },
        {
            title: '可选规格',
            key: 'type',
            resizable:true,
            width:350,
            render (row) {
                const tags = row.type.map((tagKey) => {
                    return h(
                        NTag,
                        {
                            style: {
                                marginRight: '6px',
                                marginBottom: '4px'
                            },
                            type: 'success',
                            bordered: false
                        },
                        {
                            default: () => tagKey
                        }
                    )
                })
                return tags
            }
        },
        {
            title: '管理',
            width:60,
            key: 'actions',
            render (row) {
                return h(
                    NButton,
                    {
                        size: 'small',
                        onClick: () => showDetail(row)
                    },
                    { default: () => '修改' }
                )
            }

        }
    ]

    const pagination = reactive({
        page: 1,
        pageSize: 5,
        showSizePicker: true,
        pageSizes: [3, 5, 7],
        onChange: (page: number) => {
            pagination.page = page
        },
        onUpdatePageSize: (pageSize: number) => {
            pagination.pageSize = pageSize
            pagination.page = 1
        }
    })

    function showDetail(row:RowData) {
        showModal.value = true
        updateGoods.price = row.price
        updateGoods.count = row.count
        updateGoods.id = row.key
    }


    function delGoods() {
        axios.post("https://cchencs.top:8181/goods/delGoods",{
            list:checkedRowKeys.value
        }).then(
            (d)=>{
                if (d.data.data){
                    show()
                    window.$message.success("删除成功！")
                    checkedRowKeys.value = []
                }
            }
        )
    }


</script>


<style scoped lang="less">

</style>
