/**
 * Copyright 2014-2017, FengMap, Ltd.
 * All rights reserved.
 *
 * The reducer takes care of our data. Using actions, we can change our
 * application state.
 * To add a new action, add it to the switch statement in the reducer function
 *
 * Example:
 * case YOUR_ACTION_CONSTANT:
 *   return state.set('yourStateVariable', true);
 *
 * @authors  zxg (zhangxiaoguang@fengmap.com)
 * @date     2017/8/6
 * @describe 设备管理 Reducer
 */


'use strict';
import {fromJS} from 'immutable';

import {
    QUERY_ALL_DEVICE,
    CREATE_DEVICE,
    MODIFY_DEVICE,
    GET_DEVICE,
    DELETE_DEVICE, QUERY_ALL_DEVICE_SUCCESS, DEVICE_OP_BEGIN, DEVICE_OP_FINISH, QUERY_ALL_DEVICE_BEGIN,
    QUERY_ALL_DEVICE_FINISH,
    QUERY_ALL_NOT_DEVICE_FINISH,
    CAR_MSG_BEGIN,
    CAR_MSG_FINISH,
    CAR_MSG_LIST_FINISH
} from './constants';
import _ from 'lodash';

const initialState = fromJS({
    //表格数据加载状态  【True】加载中 【False】加载完成
    tableDataLoading: true,
    //设备数据
    deviceDataSource: null,
    carMsg: null,
});


export default (state = initialState, action = {}) => {
    const {
        type,
        payload
    } = action;

    //对设备数据的操作（CURD）开始
    if (type === DEVICE_OP_BEGIN) {
        return state
            .set('tableDataLoading', true);
    }

    //对设备数据的操作（CURD）结束
    if (type === DEVICE_OP_FINISH) {
        return state
            .set('tableDataLoading', false);
    }

    //查询所有设备信息-结束
    if (type === QUERY_ALL_DEVICE_FINISH) {
        return state
            .set('deviceDataSource', payload.list);
    }

    //查询所有车辆信息-结束
    if (type === CAR_MSG_FINISH) {
        return state
            .set('carMsg', payload);
    }

    //查询所有车辆信息列表-结束
    if (type === CAR_MSG_LIST_FINISH) {
        return state
            .set('carMsgList', payload);
    }

    return state;
}
