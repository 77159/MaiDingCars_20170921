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
 * @describe 主界面 Reducer
 */

'use strict';
import {fromJS} from 'immutable';

import {
    LOAD_REPOS_SUCCESS,
    LOAD_REPOS,
    LOAD_REPOS_ERROR, RECEIVED_PEOPLE_LOCATION,
} from './constants';

// The initial state of the App
const initialState = fromJS({
    loading: false,
    error: false,
    realTimeLocations: null     //实时位置信息
});


export default (state = initialState, action = {}) => {

    const {
        type,
        payload
    } = action;

    //接收实时位置信息
    if (type === RECEIVED_PEOPLE_LOCATION) {
        return state.set('realTimeLocations', payload);
    }
    return state;
}