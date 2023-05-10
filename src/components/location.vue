<template>


  <div style="position: relative;top: 1%;left: 5%;width: 1200px;height: 50px;">
    <text style="position: absolute;top: 1%;left: 0px;font-size: 16px;font-weight: 600">修改小程序定位</text>
    <n-select v-model:value="selectLocation.id" size="medium" :options="options" style="width: 400px;position: absolute;left: 120px;"/>
    <n-button style="position: absolute;top: 0%;left: 530px;width: 80px;height: 33px;" type="info" @click="addLocation">添加地址</n-button>
    <n-button style="position: absolute;top: 0%;left: 620px;width: 80px;height: 33px;" type="success" @click="submit">确定修改</n-button>



    <text style="position: absolute;top: 1%;left: 760px;font-size: 16px;font-weight: 600">修改搜索关键词</text>
    <n-input-group style="position: absolute;left: 900px;top: 0px;width: 400px">
      <n-input-group-label>关键词：</n-input-group-label>
      <n-input :style="{ width: '33%' }" v-model:value="changeKeyword"/>
    </n-input-group>
    <n-button style="position: absolute;top: 1.1%;left: 1120px;width: 80px;height: 33px;" type="success" @click="keyword">确定修改</n-button>


  </div>

  <div id="container" style="width: 1000px;height: 600px;position: relative;left: 5%;top: 3%;">
      <img src="https://ccsmybucket.oss-cn-hangzhou.aliyuncs.com/%E5%AE%9A%E4%BD%8D.png" style="width: 33px;height: 33px;position: absolute;left: 49%;top: 49%;z-index: 99;">
  </div>

</template>


<script setup lang="ts">
    import {computed, onMounted,ref,reactive} from 'vue';
    import axios from "axios";

    let map:object;
    let selectLocation = reactive({
        id:'',
        latitude:'',
        longitude:''
    })

    let changeKeyword = ref('')

    let geocoder = new TMap.service.Geocoder();
    let currentLocationList = []

    let options = ref([
        {
            label: "Everybody's Got Something to Hide Except Me and My Monkey",
            value: '---',
        }
    ])
    onMounted(()=>{
        axios.get("https://cchencs.top:8181/getAllLocation").then(
            (d)=>{
                currentLocationList = d.data.data
                options.value = []
                let latitude = "39.984120"
                let longitude = "116.307484"
                d.data.data.forEach((e)=>{
                    options.value.push({
                        label: e.addName,
                        value: e.id
                    })
                    if(e.isNow === 1 || e.isNow === "1"){
                        latitude = e.latitude
                        longitude = e.longitude
                        selectLocation.id = e.id
                        selectLocation.latitude = e.latitude
                        selectLocation.longitude = e.longitude
                        changeKeyword.value = e.keyword
                    }
                })
                //定义地图中心点坐标
                let center = new window.TMap.LatLng(latitude, longitude)
                //定义map变量，调用 TMap.Map() 构造函数创建地图

                map = new window.TMap.Map(document.getElementById('container'), {
                    center: center,//设置地图中心点坐标
                    zoom: 10,   //设置地图缩放级别
                    // mapStyleId: 'style1', //设置地图样式
                    // viewMode: '3D'
                    showControl: true
                });
            }
        )
    })





    function submit() {
        axios.get("https://cchencs.top:8181/updateNowLocation/" + selectLocation.id).then(
            (d)=>{
                if(d.data.code === 200){
                    map.setCenter({
                        lat:d.data.data.latitude,
                        lng:d.data.data.longitude
                    })
                    window.$message.success("修改成功！")
                }
                else{
                    window.$message.error("修改失败！")
                }
            }
        )

    }

    function keyword() {
        axios.get("https://cchencs.top:8181/updateNowLocationKeyword/" + selectLocation.id + "/" + changeKeyword.value).then(
            (d)=>{
                if(d.data.data){
                    window.$message.success("修改成功！")
                }
                else {
                    window.$message.error("修改失败！")
                }
            }
        )

    }

    function addLocation() {
        let t = map.getCenter()
        let address = ''

        geocoder.getAddress({ location: new TMap.LatLng(t.lat, t.lng) }).then((result) => {
            console.log(result.result)
            address = result.result.address_component.province
                + result.result.address_component.city
                + result.result.formatted_addresses.recommend  // 显示搜索到的地址
            console.log(address)
            axios.post('https://cchencs.top:8181/addLocation',{
                longitude:t.lng,
                latitude:t.lat,
                addName:address
            }).then(
                (d)=>{
                    window.$message.success("添加成功！")
                    currentLocationList = d.data.data
                    options.value = []
                    d.data.data.forEach((e)=>{
                        options.value.push({
                            label: e.addName,
                            value: e.id
                        })
                    })
                }
            )
        });

    }

</script>


<style scoped lang="less">

</style>
