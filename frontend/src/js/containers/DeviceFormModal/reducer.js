/**
 * @authors  hxb (huangxuebing@fengmap.com)
 * @date     2017/9/7
 * @describe 设备信息对话框（Modal）组件 reducer
 */

'use strict';
import {fromJS} from 'immutable';
import {
    DEVICE_FORM_MODAL_SHOW,
    DEVICE_FORM_MODAL_OP_BEGIN,
    DEVICE_FORM_MODAL_OP_FINISH, DEVICE_FORM_MODAL_HIDE, DEVICE_FORM_MODAL_CREATE_DEVICE
} from './constants';
import _ from 'lodash';

const initialState = fromJS({
    //Modal显示状态  [True]显示 [False]隐藏
    modalVisible: false,
    //设备数据
    //deviceDataSource: null,
    //操作执行状态  [True] 执行中 [False] 未执行
    operationRunning: false,
    //操作类型 [view] 查看（只读） [modify] 修改  [create] 添加
    operation: 'view',
    //设备实体对象 当操作类型为 [view | modify ] 时，需要传入设备对象
    deviceEntity: false,
});

export default (state = initialState, action = {}) => {
    const {
        type,
        payload
    } = action;

    //对设备数据的操作（CURD）开始
    if (type === DEVICE_FORM_MODAL_OP_BEGIN) {
        return state
            .set('operationRunning', true);
    }

    //对设备数据的操作（CURD）结束
    if (type === DEVICE_FORM_MODAL_OP_FINISH) {
        return state
            .set('operationRunning', false);
    }

    //显示设备信息对话框
    if (type === DEVICE_FORM_MODAL_SHOW) {
        return state
            .set('modalVisible', true)
            .set('operation', payload.operation)
            .set('deviceEntity', payload.deviceEntity)
    }

    //隐藏设备信息对话框
    if (type === DEVICE_FORM_MODAL_HIDE) {
        return state
            .set('modalVisible', false)
            .set('operation', 'view')
            .set('deviceCode', false)
    }

    return state;
}