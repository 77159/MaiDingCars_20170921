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
 * @describe 系统入口页面,路由的顶层 Reducer
 */

'use strict';
import {fromJS} from 'immutable';

import {
    SHOW_MESSAGE
} from './constants';

// The initial state of the App
const initialState = fromJS({
    message: false,        //提示信息
});

export default (state = initialState, action = {}) => {

    const {
        type,
        payload
    } = action;

    //显示全局提示信息
    if (type === SHOW_MESSAGE) {
        return state
            .set('message', payload);
    }

    return state;
}