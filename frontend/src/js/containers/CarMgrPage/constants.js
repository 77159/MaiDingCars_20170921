/**
 * @authors  hxb (huangxuebing@fengmap.com)
 * @date     2017/9/6
 * @describe 车辆管理 constants，用于Action
 *
 * CONSTANT的定义请遵循以下格式：
 * export const YOUR_ACTION_CONSTANT = 'YourContainer/YOUR_ACTION_CONSTANT';
 *
 */
'use strict';
export const CHANGE_USERNAME = 'boilerplate/Home/CHANGE_USERNAME';

export const CAR_OP_BEGIN = 'CarMgr/CAR_OP_BEGIN';                         //对车辆数据的操作开始
export const CAR_OP_FINISH = 'CarMgr/CAR_OP_FINISH';                       //对车辆数据的操作结束
export const QUERY_ALL_CAR_BEGIN = 'CarMgr/QUERY_ALL_CAR_BEGIN';           //查询所有设备信息开始
export const QUERY_ALL_CAR_FINISH = 'CarMgr/QUERY_ALL_CAR_FINISH';         //查询所有设备信息结束
export const CREATE_CAR = 'CarMgr/CREATE_CAR';                             //添加车辆
export const MODIFY_CAR = 'CarMgr/MODIFY_CAR';                             //修改车辆信息
export const GET_CAR = 'CarMgr/GET_CAR';                                   //查询一个车辆的信息
export const DELETE_CAR = 'CarMgr/DELETE_CAR';                             //删除车辆（一个或多个）
