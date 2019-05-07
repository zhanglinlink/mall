<template>
<el-card>
    <my-bread level1='权限管理' level2='角色列表'></my-bread>
    <el-row class="addrolebtn">
        <el-col>
            <el-button type="primary">添加角色</el-button>
        </el-col>
    </el-row>
    <!-- 表格部分 row-key="id" -->
    <el-table :data="roleList" style="width: 100%" height="600px" row-key="id">
        <el-table-column type="expand" label="#" width="80">
            <template slot-scope="scope">
                <el-row v-for="(item1,i) in scope.row.children" :key="i">
                    <el-col :span="4">
                        <el-tag @close="deleRight(scope.row.id,item1.id)" closable type="success">{{item1.authName}}</el-tag>
                        <i class="el-icon-arrow-right"></i>
                    </el-col>
                    <el-col :span="20">
                        <el-row v-for="(item2,i) in item1.children" :key="i">
                            <el-col :span="4">
                                <el-tag @close="deleRight(scope.row.id,item2.id)" closable type="info">{{item2.authName}}</el-tag>
                                <i class="el-icon-arrow-right"></i>
                            </el-col>
                            <el-col :span="20">
                                <el-tag @close="deleRight(scope.row.id,item3.id)" closable v-for="(item3,i) in item2.children" :key="i">
                                    {{item3.authName}}
                                </el-tag>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
                <!-- 没权限 -->
                <span v-if = "scope.row.children.length === 0">未分配权限</span>
            </template>
        </el-table-column>
        <el-table-column type="index" label="#" width="80">
        </el-table-column>
        <el-table-column prop="roleName" label="角色名称" width="180">
        </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述">
        </el-table-column>
        <el-table-column prop="address" label="操作">
            <template slot-scope="scope">
                <el-button @click="showEditMsgBox(scope.row)" size="mini" plain type="primary" icon="el-icon-edit" circle></el-button>
                <el-button @click="showDeleUserMsgBox(scope.row.id)" size="mini" plain type="danger" icon="el-icon-delete" circle></el-button>
                <el-button @click="showSetRight(scope.row)" size="mini" plain type="success" icon="el-icon-check" circle></el-button>
            </template>
        </el-table-column>
    </el-table>
    <!-- 修改权限对话框 -->
    <el-dialog title="设置权限" :visible.sync="dialogFormVisibleRight">
        <el-tree :data="treeList" 
         ref = "tree"
         show-checkbox node-key="id" 
         default-expand-all
        :default-expanded-keys="[2, 3]" 
        :default-checked-keys="arrcheck" 
        :props="defaultProps">
        </el-tree>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleRight = false">取 消</el-button>
            <el-button type="primary" @click="setRight()">确 定</el-button>
        </div>
    </el-dialog>
</el-card>
</template>

<script>
export default {
    data() {
        return {
            roleList: [],
            dialogFormVisibleRight: false,
            treeList: [],
            defaultProps:{
                label:'authName',
                children:'children'
            },
            arrcheck:[],
            roleId:''
        }
    },
    created() {
        this.getRoleList()
    },
    methods: {
        //设置权限--发送请求 角色授权
        async setRight(){
            let arr1 = this.$refs.tree.getCheckedKeys()
            let arr2 = this.$refs.tree.getHalfCheckedKeys()
            let arr = [...arr1,...arr2]
            console.log(arr);
            
            const res = await this.$http.post(`roles/${this.roleId}/rights`,{rids:arr.join(',')})
            console.log(res);
            this.getRoleList()
            this.dialogFormVisibleRight = false
        },
        //设置权限对话框
        async showSetRight(role) {
            const res = await this.$http.get(`rights/tree`)
            console.log(res)
            this.treeList = res.data.data
            this.roleId = role.id

            //临时数组存储数据
            let tempArr = []
            role.children.forEach(item1 => {
                // tempArr.push(item1.id)
                item1.children.forEach(item2 => {
                    // tempArr.push(item2.id)
                    item2.children.forEach(item3 => {
                        tempArr.push(item3.id)
                    });
                });
            });
        this.arrcheck = tempArr



            this.dialogFormVisibleRight = true
        },
        //删除权限
        async deleRight(roleId, rightId) {
            const res = await this.$http.delete(`roles/${roleId}/rights/${rightId}`)
            this.getRoleList()
        },
        async getRoleList() {
            const res = await this.$http.get(`roles`)
            this.roleList = res.data.data
        }
    }
}
</script>

<style>
.addrolebtn {
    margin-top: 20px;
}
</style>
