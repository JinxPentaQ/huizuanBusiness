import request from '@/utils/request'

/**
 * 获取导入历史列表
 */
export function getsCollectOrder(params) {
  return request({
    url: 'CollectOrder_CollectOrderController.getsCollectOrder',
    method: 'post',
    params
  })
}
