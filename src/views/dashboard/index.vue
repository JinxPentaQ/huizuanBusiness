<template>
  <div class="dashboard-container">
    <div class="welcome">
      <h2>欢迎您，{{ username }} !</h2>
      <span>北京时间 {{ currentDate }}</span>
    </div>
    <div class="dashboard-header">
      <div v-for="item in list" :key="item.icon" class="card_item">
        <div class="card_title">
          <div class="card_img">
            <img :src="item.icon" alt>
          </div>
          {{ item.name }}
        </div>
        <span class="card_content">{{ item.value }}</span>
      </div>
    </div>
    <div class="dashboard-content">
      <h3 class="platform-info-title">商户信息</h3>
      <div>
        <span class="platform-title"> 名称 </span>
        <el-tag class="platform-tag" size="small">{{ detail.name }}</el-tag>
      </div>
      <div>
        <span class="platform-title"> 账号 </span>
        <el-tag class="platform-tag" size="small">{{
          detail.account
        }}</el-tag>
      </div>
      <div>
        <span class="platform-title"> 商户编号 </span>
        <el-tag class="platform-tag" size="small">{{
          detail.platform_sn
        }}</el-tag>
      </div>
      <div>
        <span class="platform-title"> 密钥 </span>
        <el-tag class="platform-tag" size="small">{{
          detail.private_key
        }}</el-tag>
      </div>
      <div>
        <span class="platform-title"> 白名单 </span>
        <el-tag v-if="detail.whitelist" class="platform-tag" size="small">{{
          detail.whitelist
        }}</el-tag>
        <span v-else>-</span>
      </div>

      <div>
        <span class="platform-title"> 银行卡代收费率 </span>
        <el-tag
          class="platform-tag"
          size="small"
        >{{ detail.bank_collect_val }}/万</el-tag>
      </div>

      <div>
        <span class="platform-title"> 微信代收费率 </span>
        <el-tag
          class="platform-tag"
          size="small"
        >{{ detail.wx_collect_val }}/万</el-tag>
      </div>

      <div>
        <span class="platform-title"> 支付宝代收费率 </span>
        <el-tag
          class="platform-tag"
          size="small"
        >{{ detail.ali_collect_val }}/万</el-tag>
      </div>

      <div>
        <span class="platform-title">
          银行卡代付费率
        </span>
        <el-tag
          class="platform-tag"
          size="small"
        >{{ detail.bank_out_free }}/万</el-tag>
      </div>

      <div>
        <span class="platform-title">
          微信代付费率
        </span>
        <el-tag
          class="platform-tag"
          size="small"
        >{{ detail.wx_out_free }}/万</el-tag>
      </div>

      <div>
        <span class="platform-title">
          支付宝代付费率
        </span>
        <el-tag
          class="platform-tag"
          size="small"
        >{{ detail.ali_out_free }}/万</el-tag>
      </div>
      </h3></div>
  </div>
</template>

<script>
import { getHomeData, getInfo } from '@/api/business'
import { mapGetters } from 'vuex'
import store from '@/store'
import { getCurrentTime } from '@/utils/func'
export default {
  name: 'Dashboard',
  data() {
    return {
      username: '',
      currentDate: '',
      detail: {},
      list: [
        {
          name: '商户余额',
          value: '0'
        },
        {
          name: '今日代收金额',
          value: '0'
        },
        {
          name: '今日代付金额',
          value: '0'
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['name'])
  },
  created() {
    this.username = store.getters.name
    this.currentDate = getCurrentTime()
    this.getData()
  },

  methods: {
    getData() {
      getHomeData().then((res) => {
        // 今日代收金额
        this.list[1].value = res.today_collect_amount || 0
        // 今日代付金额
        this.list[2].value = res.today_out_amount || 0
      })
      getInfo().then((res) => {
        this.detail = res
        this.list[0].value = res.business_amount || 0
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;

    .welcome {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      color: #888;

      h2 {
        color: black;
      }
    }
  }

  &-header {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-column-gap: 20px;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: rgba(0, 0, 0, 0.12) 0px 0px 12px 0px;
    padding: 20px;
    text-align: center;

    .card_item {
      border-right: 1px solid #e4e7ed;

      .card_img {
        padding-right: 40px;
        display: none;
      }

      .card_title {
        font-size: 12px;
        margin-bottom: 8px;
        color: #888;
      }

      .card_content {
        font-size: 16px;
        font-weight: 700;
        margin-top: 8px;
      }
    }

    .card_item:nth-last-child(1) {
      border-right: unset;
    }
  }

  &-content {
    float: left;
    .platform-info-title {
      margin-top: 40px;
    }
    >div {
      margin-bottom: 10px;
    }
    .platform-title {
      display: inline-block;
      width: 150px;
      text-align: left;
      font-size: 12px;
      margin-bottom: 8px;
      color: #888;
    }
  }
}
</style>
