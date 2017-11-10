/**
 * Copyright 2014-2017, FengMap, Ltd.
 * All rights reserved.
 *
 * Each action has a corresponding type, which the reducer knows and picks up on.
 * To avoid weird typos between the reducer and the actions, we save them as
 * constants here. We prefix them with 'YourComponent' so we avoid
 * reducers accidentally picking up actions they shouldn't.
 *
 * CONSTANT的定义请遵循以下格式：
 * export const YOUR_ACTION_CONSTANT = 'YourContainer/YOUR_ACTION_CONSTANT';
 *
 * @authors  zxg (zhangxiaoguang@fengmap.com)
 * @date     2017/8/6
 * @describe 设备管理 constants，用于Action
 */
'use strict';
export const DEVICE_OP_BEGIN = 'DeviceMgr/DEVICE_OP_BEGIN';                             //对设备数据的操作（CURD）开始
export const DEVICE_OP_FINISH = 'DeviceMgr/DEVICE_OP_FINISH';                           //对设备数据的操作（CURD）结束
export const QUERY_ALL_DEVICE_BEGIN = 'DeviceMgr/QUERY_ALL_DEVICE_BEGIN';               //查询所有设备信息-开始
export const QUERY_ALL_DEVICE_FINISH = 'DeviceMgr/QUERY_ALL_DEVICE_FINISH';             //查询所有设备信息-结束
export const CREATE_DEVICE = 'DeviceMgr/CREATE_DEVICE';                                 //添加设备
export const MODIFY_DEVICE = 'DeviceMgr/MODIFY_DEVICE';                                 //修改设备信息
export const GET_DEVICE = 'DeviceMgr/GET_DEVICE';                                       //查询一个设备的信息
export const DELETE_DEVICE = 'DeviceMgr/DELETE_DEVICE';                                 //删除设备（一个或多个）

export const CAR_MSG_BEGIN = 'StatisticalMgr/CAR_MSG_BEGIN';                             //对车辆信息的操作（CURD）开始
export const CAR_MSG_FINISH = 'StatisticalMgr/CAR_MSG_FINISH';                           //对车辆信息的操作（CURD）结束


