import {defineStore,createPinia} from 'pinia'

const useStore = defineStore('main', {      //store可以定义多个，保证key唯一即可（也就是’main‘）
    state: () => {
        return {
            count: 18,
            count2: 12,
            userInfo:{
                avatarUrl:'',
                nickName:'',
                city:'',           // 实际上是加密后的token
                openId:''
            }
        }
    },
    persist: {
        enabled: true
    },
    getters: {
        getCount(state):number{
            return state.count
        },
        getCount2(state):number{
            return state.count2
        },
        getUserInfo(state){
            return state.userInfo
        }
    },
    actions: {
        changeState(n:number){
            //单个操作
            this.count++
            this.count2+=n
            //批量操作，性能有优化
            this.$patch(state => {
                state.count++
                state.count2+=n
            })
        },
        saveUserInfo(avatarUrl:string,nickName:string,city:string,openId:string){
            this.userInfo.avatarUrl = avatarUrl
            this.userInfo.nickName = nickName
            this.userInfo.city = city
            this.userInfo.openId = openId
        },
        clearUserInfo(){
            this.userInfo.avatarUrl = ''
            this.userInfo.nickName = ''
            this.userInfo.city = ''
            this.userInfo.openId = ''
        }
    },
})

export default useStore
