<template>
<el-card>
    <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb> -->
    <my-bread level1='权限管理' level2='权限列表'></my-bread>
    <el-table :data="rightList" border style="width: 100%" height = "400px" class="el-table">
        <el-table-column type="index" label="#" width="180">
        </el-table-column>
        <el-table-column prop="authName" label="权限名称" width="180">
        </el-table-column>
        <el-table-column prop="path" label="路径">
        </el-table-column>
         <el-table-column prop="level" label="层级">
             <template slot-scope="scope">
                 <span v-if="scope.row.level === '0'">一级</span>
                 <span v-if="scope.row.level === '1'">二级</span>
                 <span v-if="scope.row.level === '2'">三级</span>
             </template>
        </el-table-column>
    </el-table>
</el-card>
</template>

<script>
export default {
    data() {
        return {
            rightList: []
        }
    },
    created() {
        this.getRightList()
    },
    methods: {
        async getRightList() {
            const res = await this.$http.get(`rights/list`)
            console.log(res);
            this.rightList = res.data.data
        }
    }
}
</script>

<style>
    .el-table{
        margin-top: 20px
    }
</style>
