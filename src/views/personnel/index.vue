<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom: 10px;">
      <el-input
        v-model="listQuery.name"
        placeholder="姓名/手机号码"
        style="width: 200px;margin-left: 5px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.name"
        placeholder="账号"
        style="width: 200px;margin-left: 5px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />

      <el-select
        v-model="listQuery.group_id"
        placeholder="团队"
        style="width: 140px;margin-left: 5px;"
        class="filter-item"
      >
        <el-option v-for="item in userGroup" :key="item.user_name" :label="item.user_name" :value="item.id"/>
      </el-select>

      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        搜索
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="dialogCreateVisible = true"
      >
        添加
      </el-button>

    </div>

    <el-table
      
      v-loading="listLoading"
      :data="list"
      row-key="id"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column
        type="selection"
        width="50"
        :selectable="checkboxT"
      />
      <el-table-column label="姓名" prop="user_name" width="100px" align="center"/>
      <el-table-column label="账号" prop="account" width="150px" align="center"/>
      <el-table-column label="所属" prop="group_name" width="100px"/>
      <el-table-column label="用户状态" prop="status" width="80px" align="center">
        <template slot-scope="{row}">
          <el-tag>{{ row.status | statusFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="余额" prop="account_amount" width="100px"/>
      <el-table-column label="收款费率" prop="collect_free" width="100px"/>
      <el-table-column label="出款费率" prop="out_free" width="100px"/>

      <el-table-column label="操作" align="center" width="300px" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-radio-group v-model="row.status" @change="((label)=>{selectUserStatus(label, row.id)}) ">
            <el-radio :label="1">
              启用
            </el-radio>
            <el-radio :label="0">
              禁用
            </el-radio>
          </el-radio-group>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog :title="'创建用户'" :visible.sync="dialogCreateVisible">
      <el-form
        ref="dataForm"
        :model="createTemp"
        label-position="left"
        label-width="150px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="名字" prop="type">
          <el-input v-model="createTemp.user_name"/>
        </el-form-item>
        <el-form-item label="账号" prop="title">
          <el-input v-model="createTemp.user_account"/>
        </el-form-item>
        <el-form-item label="收款佣金/10000" prop="title">
          <el-input v-model="createTemp.collect_free"/>
        </el-form-item>
        <el-form-item label="出款佣金/10000" prop="title">
          <el-input v-model="createTemp.out_free"/>
        </el-form-item>
        <el-form-item label="所属组" prop="type">
          <el-select v-model="createTemp.group_id" class="filter-item" placeholder="Please select">
            <el-option
              v-for="item in userGroup"
              :key="item.id"
              :label="item.user_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelCreateData()">
          取消
        </el-button>
        <el-button type="primary" @click="createData()">
          确认
        </el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
import {
  getUserList,
  addUser,
  modUserStatus, getsUserGroup
} from '@/api/user'

import Pagination from '@/components/Pagination'
import {MessageBox} from 'element-ui'

const originalStatus = [
  {key: '', display_name: '全部'},
  {key: '0', display_name: '禁用'},
  {key: '1', display_name: '正常'},
  {key: '2', display_name: '限制'}
]

const statusFilterKeyValue = originalStatus.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'Personnel',
  components: {Pagination},
  filters: {
    statusFilter(status) {
      return statusFilterKeyValue[status]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      userGroup: [],
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined,
        status: undefined
      },
      createTemp: {
        user_name: '',
        user_account: '',
        group_id: '',
        out_free: '',
        collect_free: ''
      },
      dialogCreateVisible: false

    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getUserList(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.total
        this.listLoading = false
      })
      getsUserGroup().then(response => {
        this.userGroup = response
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },

    selectUserStatus(label, id) {
      this.listLoading = true
      modUserStatus({
        id: id,
        status: label
      }).then(() => {
        this.listLoading = false
        this.$notify({
          title: '成功',
          message: '操作成功',
          type: 'success',
          duration: 2000
        })
        this.getList()
      }).catch(error => {
        this.listLoading = false
      })
    },
    createData() {
      this.listLoading = true
      addUser(this.createTemp).then(() => {
        this.dialogCreateVisible = false
        this.listLoading = false
        this.$notify({
          title: '成功',
          message: '创建成功',
          type: 'success',
          duration: 2000
        })
        this.getList()
        this.cancelCreateData()
      }).catch(error => {
        this.dialogCreateVisible = false
        console.log(error)
      })
    },
    cancelCreateData() {
      this.dialogCreateVisible = false
      this.createTemp = []
    },
    checkboxT(row, rowIndex) {
      if (row['status'] === 2) {
        return false
      } else {
        return true
      }
    },

  }
}
</script>
