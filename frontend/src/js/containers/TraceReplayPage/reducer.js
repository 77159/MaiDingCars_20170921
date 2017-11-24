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
 * @describe 轨迹回放 Reducer
 */
'use strict';
import {fromJS} from 'immutable';

import {
    TRACE_REPLAY,
    GET_TRACE_DATA,
    EMPTY_TRACE_DATA
} from './constants';

// The initial state of the App
const initialState = fromJS({
    traceDataSource: null,
});

export default (state = initialState, action = {}) => {
    const {
        type,
        payload
    } = action;

    if (type === TRACE_REPLAY) {
    }

    if (type === GET_TRACE_DATA) {
        return state.set('traceDataSource', payload);
    }

    if (type === EMPTY_TRACE_DATA) {
        return state.set('traceDataSource', null);
    }

    return state;
}

