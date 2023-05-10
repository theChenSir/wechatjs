import { createRouter,createWebHistory } from "vue-router";
import Home from '../components/Home.vue'
import login from '../components/login/login.vue'
import location from '../components/location.vue'
import activity from '../components/activity.vue'
import car from '../components/car.vue'
import goods from '../components/goods.vue'
import money from '../components/money.vue'
import user from '../components/user.vue'
import order from '../components/order.vue'


const router = createRouter({
    history:createWebHistory(),
    routes:[
        {
            path: "/home",
            name: "home",
            component: Home,
            redirect:'/home/car',
            children:[
                {
                    path:"/home/location",
                    name: "location",
                    component: location
                },{
                    path:"/home/activity",
                    name: "activity",
                    component: activity
                },{
                    path:"/home/car",
                    name: "car",
                    component: car
                },{
                    path:"/home/user",
                    name: "user",
                    component: user
                },{
                    path:"/home/goods",
                    name: "goods",
                    component: goods
                },{
                    path:"/home/money",
                    name: "money",
                    component: money
                },{
                    path:"/home/order",
                    name: "order",
                    component: order
                },
            ]
        },
        {
            path:'/login',
            name:'login',
            component: login
        }
    ]
})
router.beforeEach((to, from) => {
    if(to.path === '/login'){
        return true;
    }
    else {
        let status = sessionStorage.getItem("login_user_openid")
        if("false" === status || !status){
            // 无人登录或已注销
            router.push('/login')
        }
        else {
            return true;
        }
    }
})



export default router
