<template>
  <div style="position: relative;left: 30px;top: 0px;width: 1350px;">
    <n-data-table :columns="columns" :data="tableData" :pagination="pagination"/>
  </div>


  <n-modal v-model:show="showModal"
           preset="dialog"
           title="确认"
           positive-text="确认"
           negative-text="取消"
           @positive-click="submitCallback"
           @negative-click="cancelCallback"
           :on-after-leave="cancelCallback"
  >
    <n-card
            v-show="!isLoading"
            style="width: 400px"
            :bordered="false"
            size="huge"
            role="dialog"
            aria-modal="true"
    >
      <!--  展示订单评价-->
      <div v-show="showAssess" style="width: 300px;height: 240px;">
        <div style="width: 300px;height: 40px;">
          <n-rate readonly v-model:value="content.assess.count" />
        </div>
        <div style="width: 300px;height: 170px;border: 1px solid black;">
          {{content.assess.content}}
        </div>
        <div style="width: 300px;height: 30px;color: grey;text-align: right;font-size: 13px;">
          来自 {{content.assess.nickName}} {{content.assess.date}}
        </div>
      </div>

      <!--  填写物流单号，发货-->
      <div v-show="showTransport" style="width: 300px;height: 100px;">
        <text style="font-size: 22px;font-weight: 500;">物流单号：</text>
        <br>
        <br>
        <n-input v-model:value="content.transport" style="width: 400px;"/>
      </div>

      <!--  展示订单取消原因-->
      <div v-show="showReason" style="width: 300px;height: 100px;border: 1px solid black;">
        {{content.reason}}
      </div>

      <!--  回复评价和取消原因-->
      <n-button type="primary" dashed
                @click="giveCallBack"
                v-show="showReason || showAssess" style="width: 300px;height: 35px;margin-top: 10px;">
         + 添加回复
      </n-button>

      <transition-group
              name="animate__animated animate__bounce"
              :appear="true"
              enter-active-class="animate__zoomIn"
              leave-active-class="animate__backOutLeft"
      >
        <n-input
                key="33"
                v-if="showCallBack"
                v-model:value="callBackContent"
                type="textarea"
                placeholder="商家回复："
                style="width: 300px;margin-top: 10px;"
        />
      </transition-group>
    </n-card>
    <n-spin size="medium" v-show="isLoading"/>
  </n-modal>

<!--  退货申请处理模态框-->
  <n-modal
          v-model:show="showModal2"
          class="custom-card"
          preset="card"
          :style="bodyStyle"
          title="订单处理"
          size="huge"
          :bordered="false"
          :segmented="segmented"
  >

    <n-card v-if="isAgree" title="" hoverable style="max-width: 600px;position: relative;height: 130px;">
      <n-avatar :src="backGoodsInfo.goods" style="position: absolute;left: 30px;height: 90px;width: 90px;"/>
      <text style="position: absolute;left:140px;">{{backGoodsInfo.name}}</text>
      <text style="position: absolute;left:140px;top: 50px;color: grey">{{backGoodsInfo.type}}</text>
      <text style="position: absolute;left:140px;top: 90px;color: grey">订单编号：{{backGoodsInfo.orderId}}</text>
      <n-button @click="agreeBackGoods" v-if="isBackGoods" tertiary  type="success" style="position: absolute;top: 15px;right: 30px;">
        同意退货
      </n-button>
      <n-button @click="refuceBackGoods" v-if="isBackGoods" tertiary  type="error" style="position: absolute;top: 55px;right: 30px;">
        拒绝退货
      </n-button>

      <n-button @click="agreeBackMoney" v-if="!isBackGoods" tertiary type="success" style="position: absolute;top: 15px;right: 30px;">
        退款
      </n-button>
      <n-button @click="refuceBackMoney" v-if="!isBackGoods && backGoodsInfo.msg === '定金订单'" tertiary  type="error" style="position: absolute;top: 55px;right: 30px;">
        拒绝
      </n-button>



    </n-card>
    <transition-group
            name="animate__animated animate__bounce"
            :appear="true"
            enter-active-class="animate__zoomIn"
            leave-active-class="animate__backOutLeft"
    >
      <n-card key="23" v-if="!isAgree" title="" hoverable style="max-width: 600px;position: relative;height: 150px;">
        <n-input
                v-model:value="refuseReason"
                type="textarea"
                placeholder="拒绝原因"
        />
        <n-button style="position: absolute;bottom: 10px;right: 20px;height: 25px;width: 50px;" type="success" @click="submitRefuseReason">
          提交
        </n-button>
        <n-button style="position: absolute;bottom: 10px;right: 80px;height: 25px;width: 50px;" @click="isAgree = true">
          取消
        </n-button>
      </n-card>
    </transition-group>
  </n-modal>
</template>


<script setup lang="ts">
    import {h, ref, VNode, onMounted,reactive,Component} from 'vue';
    import router from "../router";
    import useStore from '../store'
    import {NInput, NIcon,NImage,NDropdown,NButton,NGradientText,NTooltip} from 'naive-ui'
    import type { DataTableColumns } from 'naive-ui'
    import axios from "axios";

    let showReason = ref(false)
    let showTransport = ref(false)
    let showAssess = ref(false)
    let refuseReason = ref('')
    let callBackContent = ref('')
    let isAgree = ref(true)
    let isCarAgree = ref(false)

    let statusArr = {
        "0":'未支付',
        "1":'未发货',
        "-1":'已取消',
        "2":'已签收',
        "3":'已评价',
        "4":'未签收',
        "5":'退货待处理',
        "6":'等待寄回',
        '7':'退款待处理',
        "8":'已退款'
    }
    let carStatusArr = {
        "0":'未支付',
        "1":'待试车',
        "2":'已完成',
        '7':'退款待处理',
        "8":'已退款',
        "-1":'已取消',
    }
    let isLoading = ref(true)
    let showModal = ref(false)
    let showCallBack = ref(false)
    let orderList = ref([])
    let bodyStyle = {width: '600px'}
    let showModal2 = ref(false)
    let backGoodsInfo = ref({
        id: 65,
        key: 65,
        goods: "https://ccsmybucket.oss-cn-hangzhou.aliyuncs.com/goods/g2-show.jpg",
        name: "奥迪钥匙扣",
        price: 206,
        status: "退货中",
        user: "text,020-81167888,广东省广州市海珠区新港中路397号",
        sale: "免单券抵扣999元",
        date: "2023/5/4 00:08:23",
        msg: "333",
        reason: "不想要了",
        orderId: "6oMOYQn6r3JraxvAu7HVTu8duCI9qhfH",
        payTime: "2023-05-03T16:08:31",
        type: "Q8",
        count: 1,
        alive: 1
    })
    const segmented = {
        content: 'soft'
    }
    let isBackGoods = ref(false)
    let backGoodsOrderUserId = ref('')
    let content = reactive({
        assess:{
            orderId:0,
            nickName:'',
            content:'',
            count:0,
            date:''
        },
        transport:'',
        reason:'',
        id:0,
    })

    // 发货
    function submitCallback(){
        // window.$message.success(content.transport)
        if(showTransport.value) {
            // axios.post("https://cchencs.top:8181/order/addTransport",{
            axios.post("https://cchencs.top:8181/order/addTransport",{
                id:content.id,
                transport:content.transport
            }).then(
                (d)=>{
                    if(d.data.data) {
                        window.$message.success("发货成功!")
                        show()
                        content.transport = ''
                    }
                }
            )
        }
        if(callBackContent.value){
            let userId = ''
            orderList.value.forEach((e)=>{
                if(e.order.id === backGoodsInfo.value.id){
                    userId = e.order.userId
                }
            })
            axios.post("https://cchencs.top:8181/msg/addMsg",{
                body: "商家回复订单 " + backGoodsInfo.value.name + " ：”" + callBackContent.value + "“",
                date: new Date(new Date().setHours(new Date().getHours())),
                type: '后台消息',
                status: 2,
                userId: userId
            }).then(
                (d)=>{
                    if(d.data.code === 200){
                        callBackContent.value = ''
                        showCallBack.value = false
                        window.$message.success("回复成功")
                    }
                }
            )
        }

        setTimeout(()=>{isLoading.value = false},500)
    }

    function giveCallBack() {
        showCallBack.value = true
    }

    function cancelCallback(){
        showModal.value = false
        showCallBack.value = false
    }

    function agreeBackGoods(){
        // 同意退货
        axios.get("https://cchencs.top:8181/order/updateOrderStatus/" + backGoodsInfo.value.id + '/6').then(
            (d)=>{
                if(d.data.data){
                    window.$message.success("已同意用户退货申请")
                    showModal2.value = false
                    show()
                }
            }
        )
    }

    function refuceBackGoods(){
        // 打开填写原因面板即可
        isAgree.value = false
        isCarAgree.value = false
        orderList.value.forEach((e)=>{
            if(e.order.id === backGoodsInfo.value.id){
                backGoodsOrderUserId.value = e.order.userId
            }
        })
    }

    function agreeBackMoney(){
        // 同意退款
        axios.get("https://cchencs.top:8181/pay/refund/" + backGoodsInfo.value.orderId + "/0").then(
            (d)=>{
                if(d.data.data){
                    window.$message.success("已退款")
                    axios.get("https://cchencs.top:8181/order/updateOrderStatus/" + backGoodsInfo.value.id + "/8").then(
                        (d)=>{
                            if(d.data.data){
                                // 已退款
                                showModal2.value = false
                                show()
                            }
                        }
                    )
                }
            }
        )
    }

    function refuceBackMoney() {
        // 拒绝退款
        isAgree.value = false
        isCarAgree.value = true
        orderList.value.forEach((e)=>{
            if(e.order.id === backGoodsInfo.value.id){
                backGoodsOrderUserId.value = e.order.userId
            }
        })
    }

    function submitRefuseReason(){
        if(!refuseReason.value) window.$message.error("请填写拒绝原因")
        if(isCarAgree.value){
            // 汽车订单，拒绝退货
            axios.get("https://cchencs.top:8181/order/updateOrderStatus/" + backGoodsInfo.value.id + '/1').then(
                (d)=>{
                    if(d.data.data){
                        window.$message.success("已拒绝用户退款申请")
                        showModal2.value = false
                        show()
                    }
                }
            )
            // 发送消息给用户，表明拒绝原因
            axios.post("https://cchencs.top:8181/msg/addMsg",{
                body: "您的汽车订购订单” " + backGoodsInfo.value.name + " “退款申请已拒绝，原因是：" + refuseReason.value,
                date: new Date(new Date().setHours(new Date().getHours())),
                type: '后台消息',
                status: 2,
                userId: backGoodsOrderUserId.value
            }).then(
                (d)=>{
                    if(d.data.data){
                        refuseReason.value = ''
                    }
                }
            )
        }
        else{
            // 商品订单，拒绝退货
            axios.get("https://cchencs.top:8181/order/updateOrderStatus/" + backGoodsInfo.value.id + '/2').then(
                (d)=>{
                    if(d.data.data){
                        window.$message.success("已拒绝用户退货申请")
                        showModal2.value = false
                        show()
                    }
                }
            )
            // 发送消息给用户，表明拒绝原因
            axios.post("https://cchencs.top:8181/msg/addMsg",{
                body: "您的订单” " + backGoodsInfo.value.name + " “退货申请已拒绝，原因是：" + refuseReason.value,
                date: new Date(new Date().setHours(new Date().getHours())),
                type: '后台消息',
                status: 2,
                userId: backGoodsOrderUserId.value
            }).then(
                (d)=>{
                    if(d.data.data){
                        refuseReason.value = ''
                    }
                }
            )
        }

    }

    onMounted(()=>{
        show()
    })

    function show(){
        axios.get("https://cchencs.top:8181/order/getAllOrder").then(
            (d)=>{
                tableData.value.splice(0)
                orderList.value = d.data.data
                d.data.data.forEach((e)=>{
                    if(!e.reason) e.reason = '--'
                    let temp = ''
                    if(e.order.msg === "定金订单"){
                        temp = 'https://ccsmybucket.oss-cn-hangzhou.aliyuncs.com/activity/' + e.imgSrc + '.jpg'
                    }else{
                        temp = e.imgSrc
                    }
                    tableData.value.push({
                        id: e.order.id,
                        key:e.order.id,
                        goods: temp,
                        name: e.data,
                        price: e.price,
                        status: e.order.msg === '定金订单'?carStatusArr[e.order.status]:statusArr[e.order.status],
                        user: e.order.userName + ',' + e.order.userNumber + ',' + e.order.address,
                        sale: e.order.ctype + '抵扣' + e.order.useCoupon + '元',
                        date: new Date(new Date(e.order.date.substring(0,19)).setHours(new Date(e.order.date.substring(0,19)).getHours() + 8)).toLocaleString(),
                        msg: e.order.msg,
                        reason: e.order.reason,
                        orderId: e.order.orderId,
                        payTime: e.order.payTime?e.order.payTime.substring(0,19):'无',
                        type: e.order.type,
                        count: e.order.count,
                        alive: e.order.alive
                    })
                    tableData.value = tableData.value.sort((a,b)=>{
                        return b.id - a.id
                    })
                    // 用reverse()注意，它反转后是无序的
                })
            }
        )
    }

    type RowData = {
        id:number,
        key: number
        goods: string,
        status: string,
        user: string,
        date: string,
        msg: string,
        reason: string,
        orderId: string,
        payTime: string,
        sale:string,
        type:string,
        count:number,
        name:string,
        price: number,
        meta: string
    }

    function backGoods(row){
        // 处理退货
        isBackGoods.value = true
        showModal2.value = true
        backGoodsInfo.value = row
    }

    function backMoney(row){
        // 处理退款
        isBackGoods.value = false
        showModal2.value = true
        backGoodsInfo.value = row
    }

    let tableData:RowData[] = ref([])

    let pagination = {
        pageSize: 5
    }

    let assess = ref('')

    function showForm(val:string,id:number,row){
        backGoodsInfo.value = row
        // val表示订单状态。id表示订单id
        if(val === '已评价'){
            // 去查看评价

            showModal.value = true
            isLoading.value = false
            showAssess.value = true
            showReason.value = false
            showTransport.value = false
            axios.get("https://cchencs.top:8181/assess/getByOrderId/" + id).then(
                (d)=>{
                    content.assess = d.data.data[0]
                }
            )
        }
        else if(val === '未发货'){
            content.id = id
            showModal.value = true
            // 去发货，填运输单号
            isLoading.value = false
            showAssess.value = false
            showReason.value = false
            showTransport.value = true
        }
        else if(val === '未支付'){
            // 未支付，刷新状态
            show()
        }
        else if(val === '未签收'){
            let userId = '';
            orderList.value.forEach((e)=>{
                if(e.order.id === backGoodsInfo.value.id){
                    userId = e.order.userId
                }
            })
            // 未签收，提醒用户签收
            axios.post("https://cchencs.top:8181/msg/addMsg",{
                body: "您的订单” " + backGoodsInfo.value.name + " “已发货，收到后记得签收哦~",
                date: new Date(new Date().setHours(new Date().getHours())),
                type: '后台消息',
                status: 2,
                userId: userId
            }).then(
                (d)=>{
                    if(d.data.code === 200) window.$message.success("已发送提醒")
                }
            )
        }
        else if(val === '已签收'){
            let userId = '';
            orderList.value.forEach((e)=>{
                if(e.order.id === backGoodsInfo.value.id){
                    userId = e.order.userId
                }
            })
            // 未评价，提醒用户评价
            axios.post("https://cchencs.top:8181/msg/addMsg",{
                body: "您的订单” " + backGoodsInfo.value.name + " “显示已签收，记得评价哦~",
                date: new Date(new Date().setHours(new Date().getHours())),
                type: '后台消息',
                status: 2,
                userId: userId
            }).then(
                (d)=>{
                    if(d.data.code === 200) window.$message.success("已发送提醒")
                }
            )
        }
        else if(val === '退货待处理'){
            // 处理退货，是否同意
            backGoods(row)
        }
        else if(val === '等待寄回'){
            // 等待寄回，提示用户寄回商品

        }
        else if(val === '退款待处理'){
            // 处理退款，是否同意
            backMoney(row)
        }
        else if(val === '待试车'){
            // 处理退款，是否同意
            sureCarOrder(id)
        }
        else if(val === '已取消'){
            // 查看取消原因
            showModal.value = true
            isLoading.value = false
            showAssess.value = false
            showReason.value = true
            showTransport.value = false
            axios.get("https://cchencs.top:8181/order/getById/" + id).then(
                (d)=>{
                    content.reason = d.data.data.order.reason
                }
            )
        }
        else{


        }
    }

    let columns = [
        {
            title: "订单ID",
            key: "id",
            resizable:true,
            width: 80,
        },
        {
            title:'订单商品',       //  展示更多，商品图片、名称、所选规格、优惠券额、优惠券种类、商品数量
            key: 'goods',
            resizable:true,
            width: 80,
            render (row, index) {
                return h(NImage, {
                    src: row.goods,
                    style:{
                        width:'130px',
                        height:'80px'
                    }
                })
            }

        },
        {
            title:'商品名',
            key: "name",
            resizable:true,
            width: 150
        },
        {
            title:'单价',
            key: "price",
            resizable:true,
            width: 70
        },
        {
            title:'规格',
            key:'type',
            resizable:true,
            width: 110
        },
        {
            title:'数量',
            key:'count',
            resizable:true,
            width: 60
        },
        {
            title:'订单状态',
            key: 'status',
            resizable:true,
            defaultFilterOptionValues: [],
            filterOptions: [
                {
                    label: '未支付',
                    value: '未支付'
                },
                {
                    label: '未发货',
                    value: '未发货'
                },
                {
                    label: '已取消',
                    value: '已取消'
                },
                {
                    label: '已签收',
                    value: '已签收'
                },
                {
                    label: '已评价',
                    value: '已评价'
                },
                {
                    label: '未签收',
                    value: '未签收'
                },
                {
                    label: '退货待处理',
                    value: '退货待处理'
                },
                {
                    label: '等待寄回',
                    value: '等待寄回'
                },
                {
                    label: '退款待处理',
                    value: '退款待处理'
                },
                {
                    label: '已退款',
                    value: '已退款'
                },
                {
                    label: '待试车',
                    value: '待试车'
                },
                {
                    label: '已完成',
                    value: '已完成'
                }
            ],
            filter (value, row) {
                return ~row.status.indexOf(value)
            },
            width: 80,
            render(row, index){
                return h(NTooltip,
                    { keepAliveOnHover: false, style: { width: 'max-content' },trigger:"hover" },
                    {
                        // 显示的是Button，悬浮在Button上展示下面default插槽的内容
                        trigger: () => h(
                            NButton,
                            {
                                style:{
                                    width:'100px',
                                    height:'40px'
                                },
                                onClick:()=>{
                                    showForm(row.status,row.id,row)
                                }
                            },
                            {
                                default: () => row.status
                            }
                        ),
                        // 悬浮展示的文本内容，组件在trigger插槽上
                        default: () => {
                            if(row.status === '已评价'){
                                // 去查看评价，同时回复评价（发条消息）TODO
                                return '查看评价'
                            }
                            else if(row.status === '未发货'){
                                // 去发货，填运输单号
                                return '去发货'
                            }
                            else if(row.status === '未支付'){
                                // 刷新支付状态
                                return '刷新状态'
                            }
                            else if(row.status === '已取消'){
                                // 查看取消原因
                                return '查看取消原因'
                            }
                            else if(row.status === '未签收'){
                                // 提醒签收
                                return '去提醒签收'
                            }
                            else if(row.status === '退货待处理'){
                                // 是否同意退货，同意修改订单为6，拒绝修改为2并填写拒绝原因 TODO
                                return '去处理'
                            }
                            else if(row.status === '等待寄回'){
                                // 等待用户寄回商品 TODO
                                return '等待用户寄回商品'
                            }
                            else if(row.status === '退款待处理'){
                                //是否退款，以及退款金额 TODO
                                return '去处理'
                            }
                            else if(row.status === '已退款'){
                                return '已退款'
                            }
                            else if(row.status === '已签收'){
                                // 已收货
                                return '去提醒评价'
                            }
                            else if(row.status === '待试车'){
                                return '点击完成试车'
                            }
                            else if(row.status === '已完成'){
                                return '已完成试车'
                            }
                        }
                    }
                )
            }
        },
        {
            title:'收货信息',    //  展示更多，用户名、号码、地址
            key: 'user',
            resizable:true,
            width: 250
        },{
            title:'创建时间',
            key: 'date',
            resizable:true,
            width: 180
        },{
            title:'订单备注',
            key: 'msg',
            resizable:true,
            width: 150
        },{
            title:'订单取消原因',
            key: 'reason',
            resizable:true,
            width: 150
        },{
            title:'订单交易号',
            key: 'orderId',
            resizable:true,
            width: 200
        },{
            title:'付款时间',
            key: 'payTime',
            resizable:true,
            width: 230
        },{
            title:'优惠',
            key: 'sale',
            resizable:true,
            width: 180
        },
        {
            title:'删除',
            key: 'alive',
            resizable:true,
            width: 140,
            render (row, index) {
                return h(NButton, {
                    style:{
                        width:'80px',
                        height:'40px',
                        color:'red',
                        border:'1px solid red'
                    },
                    onClick:()=>{
                        deleteOrder(row.id)
                    }
                },
                    {
                        default: () => '删除'
                    }
                )
            }
        }
        // {
        //     title: 'Name',
        //     key: 'name',
        //     render (row, index) {
        //         return h(NInput, {
        //             value: row.name,
        //             onUpdateValue (v) {
        //                 data.value[index].name = v
        //             }
        //         })
        //     }
        // }
    ]

    function sureCarOrder(id:number) {
        axios.get("https://cchencs.top:8181/order/updateOrderStatus/" + id + '/2').then(
            (d)=>{
                if(d.data.data){
                    window.$message.success("订单完成")
                    show()
                }
            }
        )
    }

    function deleteOrder(id:number) {
        // 删除订单
        // window.$message.success("...")
        axios.get("https://cchencs.top:8181/order/deleteOrder/" + id).then(
            (d)=>{
                if(d.data.data){
                    window.$message.success("删除成功")
                    show()
                }
                else window.$message.error("出现错误")
            }
        )
    }

</script>


<style scoped lang="less">

</style>
