<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom: 10px">
      <el-input
        v-model="listQuery.order_no"
        placeholder="订单编号"
        class="filter-item"
        size="small"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.business_no"
        placeholder="商户编号"
        class="filter-item"
        size="small"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.amount"
        placeholder="订单金额"
        class="filter-item"
        size="small"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.status"
        placeholder="状态"
        class="filter-item"
        clearable
        size="small"
        @change="handleFilter"
      >
        <el-option
          v-for="item in orderStatusOption"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-select
        v-model="listQuery.pay_type"
        placeholder="支付类型"
        class="filter-item"
        clearable
        size="small"
        @change="handleFilter"
      >
        <el-option
          v-for="item in payTypeOption"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <!-- <el-date-picker
        v-model="listQuery.date"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      >
      </el-date-picker> -->

      <el-button
        class="filter-item-btn"
        type="primary"
        icon="el-icon-search"
        size="small"
        @click="handleFilter"
      >
        搜索
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      row-key="id"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column
        label="订单编号"
        prop="order_no"
        min-width="200px"
        align="left"
      >
        <template slot-scope="{ row }">
          <div>
            <div>系统: {{ row.order_no }}</div>
            <div>商户: {{ row.business_no }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="商户"
        prop="business_name"
        align="center"
        min-width="100px"
      />
      <el-table-column
        label="订单金额"
        prop="order_amount"
        min-width="150px"
        align="center"
      />
      <el-table-column
        label="手续费"
        prop="free"
        min-width="150px"
        align="center"
      />
      <el-table-column
        label="成本"
        prop="cost_free"
        min-width="150px"
        align="center"
      />
      <el-table-column
        label="状态"
        prop="status"
        min-width="150px"
        align="center"
      >
        <template slot-scope="{ row }">
          <el-tag>{{ row.status | statusFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="支付类型"
        prop="pay_type"
        min-width="150px"
        align="center"
      >
        <template slot-scope="{ row }">
          <el-tag>{{ row.pay_type | payTypeFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="最近更新时间"
        prop="update_time"
        align="left"
        min-width="190px"
      >
        <template slot-scope="{ row }">
          <div>
            <div>创建: {{ row.create_time }}</div>
            <div>完成: {{ row.finish_time }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="通知状态"
        prop="notify_status"
        align="center"
        min-width="80px"
      />
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

  </div>
</template>

<script>
import {
  getsCollectOrder
} from '@/api/collect'

import Pagination from '@/components/Pagination'
import { orderStatusOption, payTypeOption } from '@/utils/const'
const statusFilterKeyValue = orderStatusOption.reduce((acc, cur) => {
  acc[cur.id] = cur.name
  return acc
}, {})

const payTypeFilterKeyValue = payTypeOption.reduce((acc, cur) => {
  acc[cur.id] = cur.name
  return acc
}, {})

export default {
  name: 'Collect',
  components: { Pagination },
  filters: {
    statusFilter(key) {
      return statusFilterKeyValue[key]
    },
    payTypeFilter(key) {
      return payTypeFilterKeyValue[key]
    }
  },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        status: undefined,
        page: 1,
        limit: 20
      },
      orderStatusOption,
      payTypeOption
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getsCollectOrder(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.allnum
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    updateData() {
    },
    handleUpdate(row) {
      console.log(row)
    },
    handleDelete(row) {
      console.log(row)
    }
  }
}
</script>
<style lang="scss" scoped>
.filter-item {
  width: 150px;
  margin-bottom: 20px;
  margin-right: 10px;
}

.filter-item-btn {
  margin-left: 10px;
}
</style>
