<template>
<el-container class="container">
    <el-header class="header">
        <el-row>
            <el-col :span="4">
                <div class="grid-content bg-purple">
                    <img src="../../assets/logo.png" alt="无法显示图片">
                </div>
            </el-col>
            <el-col :span="18" class="middle">
                <h2>电商后台管理系统</h2>
            </el-col>
            <el-col :span="2">
                <div class="grid-content bg-purple">
                    <a class="loginout" href="#" @click.prevent = "handleSingout()">退出</a>
                </div>
            </el-col>
        </el-row>
    </el-header>
    <el-container>
        <el-aside class="aside" width="200px">
            <!-- 是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转 -->
            <el-menu :unique-opened = "true" :router = "true">
                <el-submenu :index="''+ item.order" v-for="(item,index) in menus" :key = "index">
                    <template slot="title">
                        <i class="el-icon-location"></i>
                        <span>{{item.authName}}</span>
                    </template>
                    <el-menu-item :index="item1.path" v-for="(item1,index) in item.children" :key = "index">
                        <i class="el-icon-menu"></i>
                        <span>{{item1.authName}}</span>
                    </el-menu-item>
                </el-submenu>
 
            </el-menu>
        </el-aside>
        <el-main class="main">
            <!-- 路由显示 -->
           <router-view></router-view>
        </el-main>
    </el-container>
</el-container>
</template>

<script>
export default {
// 有token 进入home页面  没有返回登录
beforeCreate(){
    // const token = localStorage.getItem('token')
    // if(!token){
    //     this.$router.push({name:'login'})
    // }
},
data(){
    return {
        menus:[]
    }
},
created(){
    this.getmenus()
},
methods:{
    async getmenus(){
        const res = await this.$http.get(`menus`)
        console.log(res);
        this.menus = res.data.data
        
    },
    handleSingout(){
        // 1 清除token
        localStorage.clear()
        // 2 提示退出成功
        this.$message.success('退出成功')
        // 3 跳转login页面
        this.$router.push({name:'login'})
    }
}
}
</script>

<style>
.container {
    height: 100%;

}

.header {
    background-color: #b3c0d1;
}

.aside {
    background-color: #d3dcd6;
}

.main {
    background-color: #e9eef3;
}

.middle {
    text-align: center;
    line-height: 25px;
}

.loginout {
    line-height: 60px;
    text-decoration: none;
}
</style>
