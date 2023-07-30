import request from '@/utils/request'

/**
 * 获取收款信息
 */
export function getsCollectInfo(params) {
  return request({
    url: 'User_UserCollectController.getCollectInfoList',
    method: 'post',
    params
  })
}
