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
        icon="el-icon-search"
        size="small"
        @click="handleFilter"
      >
        搜索
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
            <el-table-column label="收款名称" prop="pay_name" align="center" min-width="150px" />
            <el-table-column label="收款账户" prop="pay_account" align="center" min-width="200px" />
            <el-table-column label="收款备注" prop="pay_remark" align="center" min-width="200px" />
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

  </div>

</template>

<script>
import Pagination from '@/components/Pagination'
import { getChangeOrderList } from '@/api/out-order'
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
  name: 'OutOrder',
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
        type: 2,
        page: 1,
        limit: 20
      },
      userGroup: [],
      orderOutStatusOption,
      orderOutTypeOption
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
    }
  }
}
</script>
