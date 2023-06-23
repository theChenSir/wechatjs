<template>
  <div class="maxBox">
    <div class="centerBox">
      <img src="https://ccsmybucket.oss-cn-hangzhou.aliyuncs.com/logo%20%281%29.png"
           style="position: absolute;top: 15%;width: 80px;height: 80px;left: 43%;border-radius: 40px">
      <n-input round placeholder="账号" class="centerInput" style="position: absolute;bottom:45%;width: 75%;left: 15%;" v-model:value="userInfo.username"/>
      <n-input
              type="password"
              show-password-on="click"
              placeholder="密码"
              :maxlength="8"
              class="centerInput"
              style="bottom:30%;width: 75%;left: 15%;position: absolute;"
              round
              v-model:value="userInfo.password"
      >
        <template #password-visible-icon>
          <n-icon :size="16" :component="GlassesOutline"/>
        </template>
        <template #password-invisible-icon>
          <n-icon :size="16" :component="Glasses"/>
        </template>

      </n-input>

<!--      <n-button type="success" class="centerBut" @click="wxlogin">-->
<!--        使用微信账号登录-->
<!--      </n-button>-->
      <n-input
              show-password-on="click"
              placeholder="验证码"
              :maxlength="8"
              class="centerInput"
              style="bottom:15%;width: 50%;left: 15%;position: absolute;"
              round
      >

      </n-input>
      <n-button type="info" class="centerBut" style="position: absolute;left: 33%;top: 90%" @click="login">
        登录
      </n-button>
      <img @click="change"
              :src="baseValue" style="position: fixed;right: 36%;bottom: 33%;width: 100px;height: 50px;z-index: 9">

    </div>

  </div>

  <n-modal v-model:show="showModal">
    <n-card
            style="width: 400px"
            title="使用微信扫码"
            :bordered="false"
            size="huge"
            role="dialog"
            aria-modal="true"
    >
      <n-spin size="large" style="margin-left: 42%;height: 42%;" v-show="is_loading"/>
      <img :src="loginImgSrc" style="width: 320px;height: 300px;" v-show="!is_loading">
    </n-card>
  </n-modal>
</template>


<script setup lang="ts">
    // import { GlassesOutline, Glasses } from '@vicons/ionicons5'
    import {storeToRefs} from 'pinia'
    import useStore from '../../store'
    import router from '../../router'
    import axios from "axios";
    import {getCurrentInstance, ref,reactive,onMounted} from 'vue';

    const useStore1 = useStore();
    const {getUserInfo} = storeToRefs(useStore1)
    const instance = getCurrentInstance()
    let showModal = ref(false)
    let is_loading = ref(false)
    let loginImgSrc = ref('')
    let baseValue = ref('')
    let userInfo = reactive({
        username:'',
        password:''
    })

    onMounted(()=>{
        axios.get("https://cchencs.top:8181/token/getImageCode").then(
            (d)=>{
                baseValue.value = 'data:image/gif;base64,' + d.data.data.base64
            }
        )
    })

    function change() {
        axios.get("https://cchencs.top:8181/token/getImageCode").then(
            (d)=>{
                baseValue.value = 'data:image/gif;base64,' + d.data.data.base64
            }
        )
    }

    function wxlogin() {
        is_loading.value = true
        axios.get("https://yd.jylt.cc/api/wxLogin/tempUserId?secret=3d609c77").then(
            (d) => {
                if (d.data.code === 0) {
                    loginImgSrc.value = d.data.data.qrUrl;
                    is_loading.value = false
                } else {

                }
            },
            (e) => {
                console.log(e)
            }
        )
        showModal.value = true
    }



    function login() {

        if(!userInfo.username || !userInfo.password){
            window.$message.error("账号密码不能为空！")
            return;
        }
        // axios.get("https://cchencs.top:8181/user/checkLogin/" + userInfo.username + "/" + userInfo.password).then(
        axios.get("https://cchencs.top:8181/user/checkLogin/" + userInfo.username + "/" + userInfo.password).then(
            (d)=>{
                if(d.data.code === 100){
                    window.$message.error(d.data.data)
                }else if(d.data.code === 101){
                    window.$message.error(d.data.data)
                }else {
                    window.$message.success(d.data.data)
                    // useStore1.saveUserInfo(userInfo.username, userInfo.username, "", userInfo.password)
                    sessionStorage.setItem("login_user_openid",userInfo.username + '-' + userInfo.password)
                    sessionStorage.setItem("login_user_name",userInfo.username)
                    router.push({
                        name:'home',
                    })
                }

            }
        )
    }




    //  定时访问登录结果：
    // let sign = setInterval(() => {
    //     axios.get('https://cchencs.top:8181/login/back_isLogin').then(
    //         (d) => {
    //             if (d.data.code === 200) {
    //                 clearInterval(sign);
    //                 useStore1.saveUserInfo(d.data.data.avatarUrl, d.data.data.nickName, d.data.data.city, d.data.data.openId)
    //                 sessionStorage.setItem("login_user_openid",d.data.data.openId)
    //                 router.push({
    //                     name:'home'
    //                 })
    //             } else {
    //                 //仍未登录
    //             }
    //         }
    //     )
    // }, 2000)


</script>


<style scoped lang="less">
  .maxBox {
    width: 100%;
    height: 791px;
    background: url("https://ccsmybucket.oss-cn-hangzhou.aliyuncs.com/back_car1.jpg") no-repeat;
    background-size: 100% 791px;
    opacity: 0.7;

    .centerBox {
      width: 36%;
      height: 46%;
      background-color: rgb(212, 209, 209);
      position: relative;
      top: 27%;
      left: 32%;
      box-shadow: 4px 4px 10px 8px lightgrey;
      opacity: 0.9;

      .centerBut, .centerInput {
        width: 35%;
        height: 10%;
        position: absolute;
        bottom: 30%;
        left: 33%;
      }

    }
  }
</style>
