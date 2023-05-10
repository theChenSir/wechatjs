<template>
  <div style="position: relative;left: 1%;top: 10px;width: 98%;height: 80px;background-color: rgb(0, 21, 41);box-shadow: 2px 2px 10px 3px lightgrey;">
    <transition-group
            name="animate__animated animate__bounce"
            :appear="true"
            enter-active-class="animate__zoomIn"
            leave-active-class="animate__backOutLeft"
    >
      <div key="111" style="position: absolute;width: 180px;height: 80px;background: url('https://ccsmybucket.oss-cn-hangzhou.aliyuncs.com/car_logo.jpg') no-repeat;background-size: 180px 80px;"/>
    </transition-group>
    <n-tooltip trigger="hover">
      <template #trigger>
        <img src="https://ccsmybucket.oss-cn-hangzhou.aliyuncs.com/activity/%E6%B7%BB%E5%8A%A0%20%282%29.png"
           style="position: absolute;right: 210px;top:23px;width: 33px;height: 33px;"
           @click="addMsg"
        >
        </template>
        发布消息
    </n-tooltip>
    <n-popover style="width: 400px" trigger="click" :overlap="false" placement="bottom">

      <template #trigger>
        <view style="position: absolute;top: 30%;right: 9%;width: 40px;height: 30px;">
          <n-badge v-model:value="msgVal" show-zero>
            <n-tooltip trigger="hover">
              <template #trigger>
                <n-avatar src="https://ccsmybucket.oss-cn-hangzhou.aliyuncs.com/%E6%B6%88%E6%81%AF%20%281%29.png"
                          style="position: relative;top: 30%;right: 9%;width: 35px;height: 30px;"
                          color="black"
                />
              </template>
              消息列表
            </n-tooltip>
          </n-badge>

        </view>
      </template>

      <n-scrollbar style="max-height: 500px" trigger="hover">
        <n-list style="padding-right: 30px;">
          <template #header>
            <text style="font-size: 20px;font-weight: 550">消息列表</text>

          </template>
          <template v-for="(item,index) in msgList">
            <n-list-item >
              {{item.body}}

              <template #suffix>
                <n-button style="color: orangered;" strong secondary v-show="!item.status" @click="item.status = !item.status,changeMsgStatus(item.id)">未读</n-button>
                <n-button style="color: mediumspringgreen;" strong secondary v-show="item.status">已读</n-button>
              </template>
              <br>
              <text style="font-size: 10px;color: grey">
                {{item.date}}
              </text>
            </n-list-item>
          </template>

        </n-list>
      </n-scrollbar>


    </n-popover>

    <!-- 发布消息 -->
    <n-modal v-model:show="isPublish"
             preset="dialog"
             positive-text="确认"
             negative-text="取消"
             @positive-click="sure6"
             @negative-click="cancel6">
      <n-card
              style="width: 400px;height: 230px;"
              :bordered="false"
              size="huge"
              role="dialog"
              aria-modal="true"
      >
        <n-space vertical>
          <n-select v-model:value="userPublishList" multiple :options="options2" placeholder="选择发布对象"/>
          <n-input type="textarea" :autosize="{
              minRows: 3,
              maxRows: 6
          }"  placeholder="消息内容" round clearable
          style="margin-top: 10px;" v-model:value="msgBody"
          />
        </n-space>
      </n-card>
    </n-modal>

    <n-dropdown
            trigger="hover"
            :options="options"
            @select="handleSelect"
    >
      <n-avatar style="position: absolute;top: 30%;right: 4%;width: 35px;height: 30px;">{{username}}</n-avatar>
    </n-dropdown>
  </div>

  <div style="position: absolute;left: 1%;top: 100px;width: 98%;height: 685px;">
    <n-space vertical>
      <n-switch v-model:value="collapsed"/>
      <n-layout has-sider>
        <n-layout-sider
                bordered
                collapse-mode="width"
                :collapsed-width="64"
                :width="240"
                :collapsed="collapsed"
                show-trigger
                @collapse="collapsed = true"
                @expand="collapsed = false"
        >

          <n-menu
                  :collapsed="collapsed"
                  :collapsed-width="64"
                  :collapsed-icon-size="22"
                  :options="menuOptions"
                  :render-label="renderMenuLabel"
                  :render-icon="renderMenuIcon"
                  :expand-icon="expandIcon"
                  @update:value="handleUpdateValue"
          />
        </n-layout-sider>

        <n-layout>
          <span>
              <div style="width: 100%;height: 640px;">
                <router-view></router-view>
              </div>
          </span>
        </n-layout>

      </n-layout>
    </n-space>
  </div>

</template>


<script setup lang="ts">
    import {h, ref, VNode, onMounted,reactive,Component} from 'vue';
    import router from "../router";
    import useStore from '../store'
    import type {MenuOption} from 'naive-ui'
    import {DropdownGroupOption, DropdownOption, NIcon} from 'naive-ui'
    import {BookmarkOutline, CaretDownOutline,LocationOutline,WalletOutline,CartOutline,CarOutline,PersonOutline,ReorderTwoOutline,AddOutline,SearchOutline,RemoveOutline,TextOutline,} from '@vicons/ionicons5'

    import axios from "axios";


    import {storeToRefs} from "pinia";
    const useStore1 = useStore();
    // const {getUserInfo} = storeToRefs(useStore1)

    let menuVal = ref()
    let isPublish = ref(false)
    let msgVal = ref(0)
    let collapsed = ref(true)
    let msgBody = ref('')
    let username = ref(sessionStorage.getItem("login_user_name"))
    let msgList = ref([
        {
          id:0,body:'',date:'',type:'',status:0
        }
    ])
    const menuOptions: MenuOption[] = [
        {
            label: '车辆',
            key: 'car',
            children: [
                {
                    label: "管理",
                    key:"car_select"
                }
            ]
        },
        {
            label: '商品',
            key: 'goods',
            children: [
                // {
                //     label: '上架',
                //     key: 'goods_add'
                // },
                // {
                //     label: "下架",
                //     key:"goods_del"
                // },
                {
                    label: "管理",
                    key:"goods_select"
                },
                // {
                //     label: '修改',
                //     key:'goods_update'
                // }
            ]
        },
        {
            label: "订单",
            key:'order',
            children: [
                {
                    label: "管理",
                    key:"order_select"
                }
            ]
        },
        {
            label: '活动',
            key: 'activity',
            children: [
                {
                    label: '上线',
                    key: 'activity_add'
                },
                {
                    label: "下线",
                    key:"activity_del"
                }
            ]
        },
        {
            label: '用户',
            key: 'user',
            children: [
                {
                    label: "管理",
                    key:"user_select"
                }
            ]
        },
        {
            label: '营业额',
            key: 'money'
        },
        {
            label: '地理',
            key: 'location',
            children: [
                {
                    label: '修改',
                    key: 'location_update',

                }
            ]
        },



    ]
    let userPublishList = ref([])
    let options2 = [
        {
            label:'',
            value:''
        }
    ]

    onMounted(()=>{
        username.value = sessionStorage.getItem("login_user_name")
        // window.$message.success("已登录！")
        msgList.value.splice(0)
        axios.get("https://cchencs.top:8181/msg/getAllMsg").then(
            (d) => {
                d.data.data.forEach(
                    (e)=>{
                        if(!e.status){
                            msgVal.value++;
                        }
                        if(e.status !== 2){
                            // status为2，无userId的为系统后台的消息
                            msgList.value.push({
                                id: e.id,
                                body: e.body,
                                date: e.date,
                                type: e.type,
                                status: e.status
                            })
                        }

                    }
                )
                msgList.value = msgList.value.reverse()
            }
        )
        axios.get("https://cchencs.top:8181/user/getAllUser").then(
            (d)=>{
                options2.splice(0)
                d.data.data.forEach((e)=>{
                    options2.push({
                        label: e.nickName,
                        value: e.openId
                    })
                })
            }
        )

    })

    function addMsg(){

        isPublish.value = true
    }

    function sure6(){
        isPublish.value = false
        axios.post("https://cchencs.top:8181/msg/publishMsg",
            {
                userOpenIdList: userPublishList.value,
                body:msgBody.value
            }
        ).then(
            (d)=>{
                if(d.data.data) window.$message.success("发布成功")
                else window.$message.error("出现错误")
            }
        )
    }

    function cancel6(){
        isPublish.value = false
    }

    let options = ref([
        {
            label: username.value,
            key: 'aaa',
            disabled: true
        },
        {
            label: '注销登录',
            key: "out"
        }
    ])



    function changeMsgStatus(id:number) {
        // 点击消息变为已读
        axios.get("https://cchencs.top:8181/msg/update/" + id).then(
            (d)=>{
                if(d.data.data){
                    msgVal.value--;
                }
            }
        )
    }


    function handleUpdateValue(key:string,item: MenuOption) {
        // add del select update
        // window.$message.error(key)
        router.push({
            name: key.split("_")[0],
            query:{
                data:key.split("_")[1]
            }
        })
    }


    function renderMenuLabel(option: MenuOption) {
        if ('href' in option) {
            return h(
                'a',
                {href: option.href, target: '_blank'},
                option.label as string
            )
        }
        return option.label;
    }

    function renderMenuIcon(option: MenuOption) {
        // 渲染图标占位符以保持缩进，就是保留一个空的图标位置，则return true
        if (option.key === 'activity') return h(NIcon, null, {default: () => h(BookmarkOutline)})
        if (option.key === 'goods') return h(NIcon, null, {default: () => h(CartOutline)})
        if (option.key === 'car') return h(NIcon, null, {default: () => h(CarOutline)})
        if(option.key === 'location') return h(NIcon, null, {default: () => h(LocationOutline)})
        if(option.key === 'user') return h(NIcon, null, {default: () => h(PersonOutline)})
        if(option.key === 'money') return h(NIcon, null, {default: () => h(WalletOutline)})
        if(option.key === 'order') return h(NIcon, null, {default: () => h(ReorderTwoOutline)})
        if(option.key.split("_")[1] === 'update') return h(NIcon, null, {default: () => h(TextOutline)})
        if(option.key.split("_")[1] === 'add') return h(NIcon, null, {default: () => h(AddOutline)})
        if(option.key.split("_")[1] === 'select') return h(NIcon, null, {default: () => h(SearchOutline)})
        if(option.key.split("_")[1] === 'del') return h(NIcon, null, {default: () => h(RemoveOutline)})
        return h(NIcon, null, {default: () => h(BookmarkOutline)})
    }


    function renderIcon (icon: Component) {
        return () => h(NIcon, null, { default: () => h(icon) })
    }

    function expandIcon() {
        return h(NIcon, null, {default: () => h(CaretDownOutline)})
    }


    function handleSelect(key: string | number) {
        // 系统弹窗
        // window.$message.success("aaa" + key)
        if(key === "out"){
            window.$message.success("注销成功，请重新登录！")
            // axios.post('https://cchencs.top:8181/login/back_logout')
            sessionStorage.setItem("login_user_openid","false")
            sessionStorage.setItem("login_user_username","")
            // useStore1.clearUserInfo()
            router.replace('/login')
        }
    }

</script>


<style scoped lang="less">


</style>
