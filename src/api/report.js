import request from '@/utils/request'

export function getsReport(params) {
  return request({
    url: 'Report_ReportController.getsReport',
    method: 'post',
    params
  })
}

export function getsPersonalReport(params) {
  return request({
    url: 'Report_ReportController.getsPersonalReport',
    method: 'post',
    params
  })
}

export function getsGroupReport(params) {
  return request({
    url: 'Report_ReportController.getsGroupReport',
    method: 'post',
    params
  })
}
