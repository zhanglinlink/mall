<template>
<div class="login-wrap">
    <el-form label-position="top" label-width="80px" :model="formdata" class="login-form">
        <h1>用户登录</h1>
        <el-form-item label="用户名">
            <el-input v-model="formdata.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
            <el-input v-model="formdata.password"></el-input>
        </el-form-item>
           <el-button type="primary" round class="login-btn" @click.prevent = "handleLogin()">登录</el-button>
    </el-form>
</div>
</template>

<script>
export default {
    data() {
        return {
            formdata: {
                username: '',
                password: ''
            }
        }
    },
    methods:{
        async handleLogin(){
            const res = await this.$http.post('login',this.formdata)
                
                const{data,meta:{msg,status}} = res.data

                if(status === 200){
                    //登录成功
                    // 0 保存token
                    localStorage.setItem('token',data.token)
                    // 1 跳转home
                    this.$router.push({name:'home'})
                    this.$message.success(msg)
                }else{
                    this.$message.error(msg)
                }
           
        }
    }
}
</script>

<style>
    .login-wrap{
        width: 100%;
        height: 100%;
        background-color: #007ACC;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .login-form{
        width: 600px;
        height: 400px;
        background-color: #fff;
        /* margin: 0 auto; */
        padding: 30px;
        border-radius: 5px;
    }
    .login-btn{
        width: 100%;
    }
</style>
