/**
 * @authors  hxb (huangxuebing@fengmap.com)
 * @date     2017/9/6
 * @describe 车辆管理 Reducer
 */
'use strict';
import {fromJS} from 'immutable';

import {
    CHANGE_USERNAME,
    CREATE_CAR,
    MODIFY_CAR,
    GET_CAR,
    DELETE_CAR,
    QUERY_ALL_CAR_BEGIN,
    QUERY_ALL_CAR_FINISH,
    CAR_OP_BEGIN,
    CAR_OP_FINISH
} from './constants';

// The initial state of the App
const initialState = fromJS({
    username: '',
    tableDataLoading: true,
    carDataSource: null,
});

export default (state = initialState, action = {}) => {
    const {type, payload} = action;
    //对车辆数据的操作开始
    if(type === CAR_OP_BEGIN) {
        return state
            .set('tableDataLoading', true);
    }
    //对车辆数据的操作结束
    if(type === CAR_OP_FINISH) {
        return state
            .set('tableDataLoading', false);
    }
    //查询所有车辆信息结束
    if(type === QUERY_ALL_CAR_FINISH) {
        return state
            .set('carDataSource', payload)
    }
    //添加车辆
    if (type === CREATE_CAR) {

    }
    //修改车辆信息
    if (type === MODIFY_CAR) {

    }
    //查询一个车辆的信息
    if (type === GET_CAR) {

    }
    //删除车辆（一个或多个）
    if (type === DELETE_CAR) {

    }
    return state;
}





