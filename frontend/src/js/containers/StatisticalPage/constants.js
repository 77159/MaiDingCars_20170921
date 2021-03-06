/**
 * @authors  hxb (huangxuebing@fengmap.com)
 * @date     2017/09/25
 * @describe 统计页面 constants
 */
'use strict';
export const STATISTICAL_OP_BEGIN = 'StatisticalMgr/STATISTICAL_OP_BEGIN'; //对设备数据的操作（CURD）开始
export const STATISTICAL_OP_FINISH = 'StatisticalMgr/STATISTICAL_OP_FINISH'; //对设备数据的操作（CURD）结束

export const CAR_MSG_BEGIN = 'StatisticalMgr/CAR_MSG_BEGIN'; //对车辆信息的操作（CURD）开始
export const CAR_MSG_FINISH = 'StatisticalMgr/CAR_MSG_FINISH'; //对车辆信息的操作（CURD）结束
export const CAR_MSG_LIST_BEGIN = 'StatisticalMgr/CAR_MSG_LIST_BEGIN'; //对车辆信息列表的操作（CURD）开始
export const CAR_MSG_LIST_FINISH = 'StatisticalMgr/CAR_MSG_LIST_FINISH'; //对车辆信息列表的操作（CURD）结束

export const GET_DENSITY_DATA = 'StatisticalMgr/GET_DENSITY_DATA'; //区域密度统计
export const GET_DENSITY_DATA_DONE = 'StatisticalMgr/GET_DENSITY_DATA_DONE'; //区域密度统计
export const GET_SPEED_DATA = 'StatisticalMgr/GET_SPEED_DATA'; //车辆速度统计
export const GET_SPEED_DATA_DONE = 'StatisticalMgr/GET_SPEED_DATA_DONE'; //车辆速度统计
export const GET_ABNORMAL_DATA = 'StatisticalMgr/GET_ABNORMAL_DATA'; //车辆异常统计
export const GET_ABNORMAL_DATA_DONE = 'StatisticalMgr/GET_ABNORMAL_DATA_DONE'; //车辆异常统计

export const GET_GANTT_BEGIN = 'StatisticalMgr/GET_GANTT_BEGIN'; //查询甘特图开始
export const GET_GANTT_FINISH = 'StatisticalMgr/GET_GANTT_FINISH'; //查询甘特图结束


export const DENSITY_OPERATING_BEGIN = 'StatisticalMgr/DENSITY_OPERATING_BEGIN';    //查询密度统计数据（CURD）开始
export const DENSITY_OPERATING_FINISH = 'StatisticalMgr/DENSITY_OPERATING_FINISH';  //查询密度统计数据（CURD）结束

export const SPEED_OPERATING_BEGIN = 'StatisticalMgr/SPEED_OPERATING_BEGIN';    //查询车辆速度统计数据（CURD）开始
export const SPEED_OPERATING_FINISH = 'StatisticalMgr/SPEED_OPERATING_FINISH';  //查询车辆速度统计数据（CURD）结束abnormal

export const ABNORMAL_OPERATING_BEGIN = 'StatisticalMgr/ABNORMAL_OPERATING_BEGIN';    //查询车辆异常统计数据（CURD）开始
export const ABNORMAL_OPERATING_FINISH = 'StatisticalMgr/ABNORMAL_OPERATING_FINISH';  //查询车辆异常统计数据（CURD）结束 abnormal