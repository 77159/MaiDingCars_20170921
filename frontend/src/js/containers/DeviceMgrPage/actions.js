/**
 * Copyright 2014-2017, FengMap, Ltd.
 * All rights reserved.
 *
 * Actions change things in your application
 * Since this boilerplate uses a uni-directional data flow, specifically redux,
 * we have these actions which are the only way your application interacts with
 * your application state. This guarantees that your state is up to date and nobody
 * messes it up weirdly somewhere.
 *
 * To add a new Action:
 * 1) Import your constant
 * 2) Add a function like this:
 *    export function yourAction(var) {
 *        return { type: YOUR_ACTION_CONSTANT, var: var }
 *    }
 *
 * @authors  zxg (zhangxiaoguang@fengmap.com)
 * @date     2017/8/6
 * @describe 设备管理 Actions
 */
'use strict';
import {
    DEVICE_OP_BEGIN,
    DEVICE_OP_FINISH,
    QUERY_ALL_DEVICE_BEGIN,
    QUERY_ALL_DEVICE_FINISH,
    CREATE_DEVICE,
    MODIFY_DEVICE,
    GET_DEVICE,
    DELETE_DEVICE,
    QUERY_ALL_NOT_DEVICE_BEGIN,
    QUERY_ALL_NOT_DEVICE_FINISH
} from './constants';

/**
 * 对设备数据的操作（CURD）开始
 */
export const deviceOpBegin = () => ({
    type:DEVICE_OP_BEGIN
});

/**
 * 对设备数据的操作（CURD）结束
 */
export const deviceOpFinish = () => ({
    type:DEVICE_OP_FINISH
});

/**
 * 查询所有设备信息-开始
 */
export const queryAllDeviceBegin = () => ({
    type: QUERY_ALL_DEVICE_BEGIN
});

/**
 * 查询所有设备信息-结束
 * @param deviceData 设备集合
 */
export const queryAllDeviceFinish = (deviceData) => ({
    type: QUERY_ALL_DEVICE_FINISH,
    payload: deviceData
});

/**
 * 添加设备
 * @param deviceEntity 待添加的设备对象
 * @param callback
 */
export const createDevice = (deviceEntity) => ({
    type: CREATE_DEVICE,
    payload: deviceEntity
});

/**
 * 修改设备信息
 * @param deviceEntity 要修改的设备对象
 * @param callback
 */
export const modifyDevice = (deviceEntity) => ({
    type: MODIFY_DEVICE,
    payload: deviceEntity
});

/**
 * 根据设备编号，查询一个设备的信息
 * @param deviceCode 设备编号
 */
export const getDevice = (deviceCode) => ({
    type: GET_DEVICE,
    payload: {
        deviceCode
    }
});

/**
 * 删除设备（一个或多个）
 * @param deviceCode 要删除的 device_code
 */
export const deleteDevice = (deviceCode) => ({
    type: DELETE_DEVICE,
    deviceCode
});

/**
 * 查询所有未被使用的设备信息-开始
 */
export const queryAllNotDeviceBegin = () => ({
    type: QUERY_ALL_NOT_DEVICE_BEGIN
});

/**
 * 查询所有未被使用的设备信息-结束
 * @param notDeviceData 设备集合
 */
export const queryAllNotDeviceFinish = (notDeviceData) => ({
    type: QUERY_ALL_NOT_DEVICE_FINISH,
    payload: notDeviceData
});