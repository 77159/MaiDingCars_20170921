/**
 * @authors  zxg (zhangxiaoguang@fengmap.com)
 * @date     2017/9/16
 * @describe 密码修改 Reducer
 */
'use strict';
import {fromJS} from 'immutable';

import {
    MODIFY_PASSWORD,
    MODIFY_BEGIN,
    MODIFY_FINISH,
    MODIFY_FORM_MODAL_HIDE,
    MODIFY_FORM_MODAL_SHOW
} from './constants';

const initialState = fromJS({
    //操作执行状态  [True] 执行中 [False] 未执行
    operationRunning: false,
    //Modal显示状态  [True]显示 [False]隐藏
    modalVisible: false,
    //此操作的状态
    operation: 'modify',
    passwordMsg: null,
});


export default (state = initialState, action = {}) => {
    const {
        type,
        payload
    } = action;


    //密码修改-开始
    if (type === MODIFY_BEGIN) {
        return state
            .set('operationRunning', true);
    }

    //密码修改-结束
    if (type === MODIFY_FINISH) {
        return state
            .set('operationRunning', false);
    }

    //显示修改密码信息对话框
    if (type === MODIFY_FORM_MODAL_SHOW) {
        return state
            .set('modalVisible', true)
            .set('operation', payload.operation)
    }

    //隐藏修改密码信息对话框
    if (type === MODIFY_FORM_MODAL_HIDE) {
        return state
            .set('modalVisible', false)
            .set('operation', 'modify')
    }
    return state;
}