/**
 * @authors  hxb (huangxuebing@fengmap.com)
 * @date     2017/9/7
 * @describe 设备管理页面 reducer
 */
'use strict';
import {fromJS} from 'immutable';

import {
    DEVICE_OP_BEGIN,
    DEVICE_OP_FINISH,
    QUERY_ALL_DEVICE_FINISH,
    QUERY_ALL_NOT_DEVICE_FINISH
} from './constants';
import _ from 'lodash';

const initialState = fromJS({
    //表格数据加载状态  【True】加载中 【False】加载完成
    tableDataLoading: true,
    //设备数据
    deviceDataSource: null,
    notDeviceDataSource:null,
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

    //查询所有未被使用的设备信息-结束
    if (type === QUERY_ALL_NOT_DEVICE_FINISH) {
        return state
            .set('notDeviceDataSource', payload);
    }
    return state;
}
