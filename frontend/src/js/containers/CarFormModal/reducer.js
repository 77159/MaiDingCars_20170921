/**
 * @authors  hxb (huangxuebing@fengmap.com)
 * @date     2017/9/7
 * @describe 添加车辆 Reducer
 */

'use strict';
import {fromJS} from 'immutable';
import {
    CAR_FORM_MODAL_SHOW,
    CAR_FORM_MODAL_OP_BEGIN,
    CAR_FORM_MODAL_OP_FINISH, CAR_FORM_MODAL_HIDE, CAR_FORM_MODAL_CREATE_CAR,
    IMAGE_URL,
} from './constants';
import _ from 'lodash';

const initialState = fromJS({
    //Modal显示状态  [True]显示 [False]隐藏
    modalVisible: false,
    //车辆数据
    //carDataSource: null,
    //操作执行状态  [True] 执行中 [False] 未执行
    operationRunning: false,
    //操作类型 [view] 查看（只读） [modify] 修改  [create] 添加
    operation: 'view',
    //车辆实体对象 当操作类型为 [view | modify ] 时，需要传入车辆对象
    carEntity: false,
    imgURL: '',
});

export default (state = initialState, action = {}) => {
    const {
        type,
        payload
    } = action;

    //对车辆数据的操作（CURD）开始
    if (type === CAR_FORM_MODAL_OP_BEGIN) {
        return state
            .set('operationRunning', true);
    }

    //对车辆数据的操作（CURD）结束
    if (type === CAR_FORM_MODAL_OP_FINISH) {
        return state
            .set('operationRunning', false);
    }

    //显示车辆信息对话框
    if (type === CAR_FORM_MODAL_SHOW) {
        return state
            .set('modalVisible', true)
            .set('operation', payload.operation)
            .set('carEntity', payload.carEntity)
    }

    //隐藏车辆信息对话框
    if (type === CAR_FORM_MODAL_HIDE) {
        return state
            .set('modalVisible', false)
            .set('operation', 'view')
            .set('carCode', false)
    }

    if (type === IMAGE_URL) {
        return state
            .set('imgURL', payload.imgURL);
    }

    return state;
}