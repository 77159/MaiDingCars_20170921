/**
 * @authors  zxg (zhangxiaoguang@fengmap.com)
 * @date     2017/9/16
 * @describe 人员登陆 Reducer
 */
'use strict';
import {
    fromJS
} from 'immutable';

import {
    CHANGE_USERNAME,
    LOGIN_BEGIN,
    LOGIN_FINISH
} from './constants';

const initialState = fromJS({

    //操作执行状态  [True] 执行中 [False] 未执行
    operationRunning: false,
    loginMsg: null,
});

export default (state = initialState, action = {}) => {
    const {
        type,
        payload
    } = action;


    //登陆开始
    if (type === LOGIN_BEGIN) {
        return state.set('operationRunning', true);
    }

    //登陆结束
    if (type === LOGIN_FINISH) {
        return state.set('operationRunning', false);
    }

    return state;
}