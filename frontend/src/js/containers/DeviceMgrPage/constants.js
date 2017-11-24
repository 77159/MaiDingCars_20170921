/**
 * @authors  hxb (huangxuebing@fengmap.com)
 * @date     2017/9/7
 * @describe 设备管理页面constants 用于Actions
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
export const QUERY_ALL_NOT_DEVICE_BEGIN = 'DeviceMgr/QUERY_ALL_NOT_DEVICE_BEGIN';       //查询所有未被使用的设备信息-开始
export const QUERY_ALL_NOT_DEVICE_FINISH = 'DeviceMgr/QUERY_ALL_NOT_DEVICE_FINISH';     //查询所有未被使用的设备信息-结束