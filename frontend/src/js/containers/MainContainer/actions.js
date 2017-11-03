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
    GET_ONLINE_CAR,
    GET_ONLINE_DEVICE,
    PUSH_ALARM_MESSAGE,
    PUT_MESSAGE_ISREAD,
    PUT_MESSAGE_LASTDATETIME,
    PUT_MESSAGE_ISAREA,
    PUT_MESSAGE_ISSHOW
} from './constants';

/**
 * 接收到新的人员位置
 * @param locationEntity 位置实体对象
 */
export const receivedCarLocation = (locationEntity) => ({
    type: RECEIVED_CAR_LOCATION,
    payload: locationEntity
});

//export const

/**
 * 接收到新的人员位置
 * @param locationEntity 位置实体对象
 */
export const getOnlineCar = (locationEntity) => ({
    type: GET_ONLINE_CAR,
    payload: onlineCar
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
 * 接受最新的人员
 * @param message
 */
export const pushAlarmMessage = (message) => ({
    type: PUSH_ALARM_MESSAGE,
    payload: message
});

/**
 * 接受最新的人员
 * @param message
 */
export const putMessageIsRead = (id) => ({
    type: PUT_MESSAGE_ISREAD,
    payload: id
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
 * 更新信息对象是否已经显示
 * @param obj
 */
export const putMessageIsShow = (obj) => ({
    type: PUT_MESSAGE_ISSHOW,
    payload: obj
});

//export const GET_ALARM_MSG = () => ({});
