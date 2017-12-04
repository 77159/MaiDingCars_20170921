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
    CHANGE_USERNAME,
    UPDATE_LOADING,
    GET_HEATMAP_DATA
} from './constants';

// The initial state of the App
const initialState = fromJS({
    username: '',
    playing: false,
    datas: []
});

export default (state = initialState, action = {}) => {
    switch (action.type) {
        case CHANGE_USERNAME:
            // Delete prefixed '@' from the github username
            return state
                .set('username', action.name.replace(/@/gi, ''));
        case UPDATE_LOADING:
            return state
                .set('playing', action.loading);
        case GET_HEATMAP_DATA:
            return state.set('datas', action.data);
        default:
            return state;
    }
}

