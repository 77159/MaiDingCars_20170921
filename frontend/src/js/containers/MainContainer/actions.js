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
 * @describe 主界面 Actions
 */
'use strict';
import {
    RECEIVED_CAR_LOCATION,
    GET_ONLINE_DEVICE,
    PUSH_ALARM_MESSAGE,
    PUT_MESSAGE_LASTDATETIME,
    PUT_MESSAGE_ISAREA,
    PUT_ALARM_DATAS,
    DEL_ALARM_DATAS,
    DEL_ALARM_ALL_DATAS,
    UPDATE_MESSAGE_SHOW,
    UPDATE_UNREAD_MESSAGE,
    DELETE_ALARM_MESSAGE_BY_KEYS,
    UPDATE_ALARM_LASTDATETIME
} from './constants';

/**
 * 接收到新的人员位置
 * @param locationEntity 位置实体对象
 */
export const receivedCarLocation = (locationEntity) => ({
    type: RECEIVED_CAR_LOCATION,
    payload: locationEntity
});


/**
 * 获取当前最新设备
 * @param onlineDevice
 */
export const getOnlineDevice = (onlineDevice) => ({
    type: GET_ONLINE_DEVICE,
    payload: onlineDevice,
});

/**
 * 添加新的报警信息
 * @param message
 */
export const pushAlarmMessage = (message) => ({
    type: PUSH_ALARM_MESSAGE,
    payload: message
});

/**
 * 将人员移除重点区域报警列
 * @param obj 修改信息
 * @constructor
 */
export const putMessageLastDateTime = (obj) => ({
    type: PUT_MESSAGE_LASTDATETIME,
    payload: obj
});

/**
 * 将人员移除重点区域报警列
 * @param obj 修改信息
 * @constructor
 */
export const putMessageIsArea = (obj) => ({
    type: PUT_MESSAGE_ISAREA,
    payload: obj
});


/**
 * 更新当前报警信息列表
 * @param data
 */
export const putAlarmDatas = (data) => ({
    type: PUT_ALARM_DATAS,
    payload: data
});

/**
 * 删除当前报警信息列表
 * @param data
 */
export const delAlarmDatas = (data) => ({
    type: DEL_ALARM_DATAS,
    payload: data
});

/**
 * 清除所有的当前报警信息列表
 */
export const delAlarmAllDatas = () => ({
    type: DEL_ALARM_ALL_DATAS,
});

/**
 * 更新已经显示的报警信息状态
 */
export const updateMessageShow = (key) => ({
    type: UPDATE_MESSAGE_SHOW,
    payload: key
});

/**
 * 更新未读信息状态
 * @param ids 报警信息主键集合
 */
export const updateUnReadMessage = (ids) => ({
    type: UPDATE_UNREAD_MESSAGE,
    payload: {
        ids
    }
});

/**
 * 根据主键集合(keys)删除报警信息
 * @param keys 主键集合
 */
export const deleteAlarmMessageByKeys = (keys) => ({
    type: DELETE_ALARM_MESSAGE_BY_KEYS,
    payload: {
        keys
    }
});

/**
 * 更新报警最后时间
 * @param data {key:key,dateTime:dateTime}
 */
export const updateLastDateTime = (data) => ({
    type: UPDATE_ALARM_LASTDATETIME,
    payload: data
});
