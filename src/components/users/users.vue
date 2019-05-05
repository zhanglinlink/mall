<template>
<el-card class="box-card">
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row class="searchRow">
        <el-col>
            <el-input placeholder="请输入内容" v-model="query" class="inputSerch" clearable @clear="reLoad()">
                <el-button @click.prevent="searchUser()" slot="append" icon="el-icon-search"></el-button>
            </el-input>
            <el-button type="primary" @click.prevent="showDialog()">添加用户</el-button>
        </el-col>
    </el-row>
    <!-- 表格部分 -->
    <el-table :data="userlist" style="width: 100%" height="300px">
        <el-table-column type="index" label="#" width="80">
        </el-table-column>
        <el-table-column prop="username" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="email" label="邮箱">
        </el-table-column>
        <el-table-column prop="mobile" label="电话">
        </el-table-column>
        <el-table-column prop="create_time" label="创建日期">
            <template slot-scope="scope">
                {{scope.row.create_time | fmtdata}}
            </template>
        </el-table-column>
        <el-table-column prop="address" label="用户状态">
            <template slot-scope="scope">
                <el-switch @change="changeMgState(scope.row)" v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949">
                </el-switch>
            </template>
        </el-table-column>
        <el-table-column prop="address" label="状态">
            <template slot-scope="scope">
                <el-button @click="showEditMsgBox(scope.row)" size="mini" plain type="primary" icon="el-icon-edit" circle></el-button>
                <el-button @click="showDeleUserMsgBox(scope.row.id)" size="mini" plain type="danger" icon="el-icon-delete" circle></el-button>
                <el-button @click="showSetUserRoleId(scope.row)" size="mini" plain type="success" icon="el-icon-check" circle></el-button>
            </template>
        </el-table-column>
    </el-table>
    <!-- 分页 -->

    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagenum" :page-sizes="[2, 4, 6, 8]" :page-size="2" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>

    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
        <el-form :model="form">
            <el-form-item label="用户名" :label-width="formLabelWidth">
                <el-input v-model="form.username" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="密码" :label-width="formLabelWidth">
                <el-input v-model="form.password" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" :label-width="formLabelWidth">
                <el-input v-model="form.email" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="手机号" :label-width="formLabelWidth">
                <el-input v-model="form.mobile" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
            <el-button type="primary" @click="addUser()">确 定</el-button>
        </div>
    </el-dialog>

    <!-- 编辑用户对话框 -->

    <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
        <el-form :model="form">
            <el-form-item label="用户名" :label-width="formLabelWidth">
                <el-input disabled v-model="form.username" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" :label-width="formLabelWidth">
                <el-input v-model="form.email" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="手机号" :label-width="formLabelWidth">
                <el-input v-model="form.mobile" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
            <el-button type="primary" @click="editUser()">确 定</el-button>
        </div>
    </el-dialog>

    <!-- 设置用户权限对话框 -->
    <el-dialog title="分配角色" :visible.sync="dialogFormVisibleRol">
        <el-form :model="form">
            <el-form-item label="用户名" :label-width="formLabelWidth">
               {{currRoleName}}
            </el-form-item>
            <el-form-item label="角色" :label-width="formLabelWidth">
                <el-select v-model="currRoleId">
                    <el-option label="请选择" :value="-1"></el-option>
                    <el-option :label="item.roleName" :value="item.id" v-for="(item,i) in roles" :key = "i">
     
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleRol = false">取 消</el-button>
            <el-button type="primary" @click="setRol()">确 定</el-button>
        </div>
    </el-dialog>

</el-card>
</template>

<script>
export default {
    data() {
        return {
            query: '',
            pagenum: 1,
            pagesize: 2,
            userlist: [],
            total: -1,
            //添加用户对话框显示隐藏
            dialogFormVisibleAdd: false,
            //编辑用户对话框显示隐藏
            dialogFormVisibleEdit: false,
            //设置用户对话框显示隐藏
            dialogFormVisibleRol: false,
            formLabelWidth: '60px',
            currRoleName:'',
            currRoleId: -1,
            currUserId:-1,
            //保存所以角色数据
            roles:[],
            form: {
                username: '',
                password: '',
                email: '',
                mobile: ''
            }
        }
    },
    created() {
        this.getUserList()
    },
    methods: {
        //设置用户权限  发送请求
        async setRol(){
            await this.$http.put(`users/${this.currUserId}/role`,{
                rid:this.currRoleId
            })
            this.dialogFormVisibleRol = false
        },
        //设置用户权限  打开对话框
        async showSetUserRoleId(user){
            this.currRoleName = user.username
            this.currUserId = user.id
            //查询分配角色名称列表
            const res1 = await this.$http.get(`roles`)
            //  console.log(res1)
            this.roles = res1.data.data
            //查询用户角色信息rid
            const res = await this.$http.get(`users/${user.id}`)
            // console.log(res)
            this.currRoleId = res.data.data.rid
            this.dialogFormVisibleRol = true
        },
        // 改变用户状态
        async changeMgState(user) {
            //   users/:uId/state/:type 
            const res = await this.$http.put(`users/${user.id}/state/${user.mg_state}`)
        },
        //编辑用户 发送请求
        async editUser() {
            const res = await this.$http.put(`users/${this.form.id}`, this.form)
            this.getUserList()
            this.dialogFormVisibleEdit = false
        },
        //编辑对话框
        showEditMsgBox(user) {
            this.form = user
            this.dialogFormVisibleEdit = true
        },
        //删除对话框
        showDeleUserMsgBox(userId) {
            this.$confirm('删除用户?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                const res = await this.$http.delete(`users/${userId}`)
                console.log(res)
                if (res.data.meta.status === 200) {
                    this.$message({
                        type: 'success',
                        message: res.data.meta.msg
                    });
                    this.getUserList()
                    this.pagenum = 1
                }
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        //添加用户数据
        async addUser() {
            const res = await this.$http.post(`users`, this.form)
            // console.log(res)
            const {
                meta: {
                    msg,
                    status
                },
                data
            } = res.data
            if (status === 201) {
                //提示
                this.$message.success(msg)
                //关闭对话框
                this.dialogFormVisibleAdd = false
                //刷新数据
                this.getUserList()
                //清空对话框数据
                this.form = {}
            } else {
                this.$message.warning(msg)
            }
        },
        //打开对话框  添加用户
        showDialog() {
            this.form = {}
            this.dialogFormVisibleAdd = true
        },
        // 重新加载数据
        reLoad() {
            this.getUserList()
        },
        //搜索数据
        searchUser() {
            this.getUserList()
        },
        // 分页功能
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
            this.pagesize = val
            this.pagenum = 1
            this.getUserList()
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.pagenum = val
            this.getUserList()
        },
        // 获取列表发发送请求
        async getUserList() {
            const AUTH_TOKEN = localStorage.getItem('token')
            this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN;
            // 请求路径： users
            // 请求方法： get
            // 请求参数
            const res = await this.$http.get(`users?query=${this.query}&pagenum=${this.pagenum}&pagesize=
              ${this.pagesize}`)
            console.log(res);
            const {
                meta: {
                    status,
                    msg
                },
                data: {
                    users,
                    total
                }
            } = res.data
            if (status === 200) {
                this.userlist = users
                this.total = total
                // this.$message.success(msg)
            } else {
                this.$message.error(msg)
            }
        }
    }
}
</script>

<style>
.searchRow {
    margin-top: 20px;
}

.box-card {
    height: 100%;
}

.inputSerch {
    width: 300px;
}
</style>
