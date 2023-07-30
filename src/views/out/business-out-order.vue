<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom: 10px;">
      <el-select
        v-model="listQuery.status"
        placeholder="状态"
        class="filter-item"
        clearable
        size="small"
        @change="handleFilter"
      >
        <el-option
          v-for="item in orderOutStatusOption"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        size="small"
        icon="el-icon-search"
        @click="handleFilter"
      >
        搜索
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-plus"
        size="small"
        @click="dialogVisible = true"
      >
        创建提现订单
      </el-button>

    </div>

    <div>
      <el-row :gutter="20">

        <el-col ref="class_customer_list" class="test" :span="6" :xs="24" style="width:100%;">

          <el-table

            v-loading="listLoading"
            :data="list"
            row-key="id"
            border
            fit
            highlight-current-row
            style="margin-top: 5px"
          >

            <el-table-column label="订单编号" prop="order_no" min-width="200px" align="center" />
            <el-table-column label="订单金额" prop="order_amount" min-width="150px" align="center" />
            <el-table-column label="创建时间" prop="create_time" align="center" min-width="180px" />
            <el-table-column label="状态" prop="status" align="center" min-width="100px">
              <template slot-scope="{row}">
                <el-tag>{{ row.status | statusFilter }}</el-tag>
              </template>
            </el-table-column>

            <el-table-column label="接单用户" prop="user_name" align="center" min-width="100px" />
            <el-table-column label="接单账户" prop="user_account" align="center" min-width="100px" />
            <el-table-column label="收款名称" prop="pay_name" align="center" min-width="100px" />
            <el-table-column label="收款账户" prop="pay_account" align="center" min-width="100px" />
            <el-table-column label="收款备注" prop="pay_remark" align="center" min-width="100px" />

          </el-table>
          <pagination
            v-show="total>0"
            :total="total"
            :page.sync="listQuery.page"
            :limit.sync="listQuery.limit"
            @pagination="getList"
          />
        </el-col>
      </el-row>
    </div>
    <el-dialog
      title="创建提现订单"
      :visible.sync="dialogVisible"
      width="400px"
      :before-close="close"
    >
      <el-form
        ref="createWithdraw"
        :model="createWithdraw"
        :rules="rules"
        auto-complete="on"
        label-position="left"
        label-width="90px"
      >
        <el-form-item prop="amount" label="提现金额">
          <el-input
            v-model="createWithdraw.amount"
            placeholder="提现金额"
            type="text"
            tabindex="1"
            auto-complete="on"
            style="width: 270px;"
          />
        </el-form-item>
        <el-button
          :loading="loading"
          type="primary"
          style="width: 100%; margin-top: 20px;"
          @click.native.prevent="handleConfirm"
        >创建</el-button>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { getChangeOrderList, createOutOrder } from '@/api/out-order'
import { orderOutStatusOption, orderOutTypeOption } from '@/utils/const'
const statusFilterKeyValue = orderOutStatusOption.reduce((acc, cur) => {
  acc[cur.id] = cur.name
  return acc
}, {})

const typeFilterKeyValue = orderOutTypeOption.reduce((acc, cur) => {
  acc[cur.id] = cur.name
  return acc
}, {})

export default {
  name: 'BusinessOutOrder',
  // eslint-disable-next-line vue/no-unused-components
  components: { Pagination },
  filters: {
    statusFilter(key) {
      return statusFilterKeyValue[key]
    },
    typeFilter(key) {
      return typeFilterKeyValue[key]
    }
  },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        status: undefined,
        type: 3,
        page: 1,
        limit: 20
      },
      userGroup: [],
      orderOutStatusOption,
      orderOutTypeOption,
      dialogVisible: false,
      createWithdraw: {
        amount: ''
      },
      rules: {
        amount: [
          { required: true, trigger: 'blur', message: '请输入提现金额' }
        ]
      },
      loading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getChangeOrderList(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.allnum
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleConfirm() {
      this.$refs.createWithdraw.validate(valid => {
        if (valid) {
          this.loading = true
          createOutOrder({ amount: this.createWithdraw.amount }).then(() => {
            this.close()
            this.loading = false
            this.getList()
            this.$message.success('操作成功!')
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    close() {
      this.dialogVisible = false
      this.createWithdraw = {}
    }
  }
}
</script>
