/**
 * @authors  zxg (zhangxiaoguang@fengmap.com)
 * @date     2017/8/6
 * @describe 顶部导航 Reducer
 */
'use strict';
import {fromJS} from 'immutable';

import {
    LOGIN_OUT
} from './constants';

const initialState = fromJS({});

function homeReducer(state = initialState, action) {
    const {
        type,
        payload
    } = action;

    if (type === LOGIN_OUT) {
        return state
    }

}

export default homeReducer;
