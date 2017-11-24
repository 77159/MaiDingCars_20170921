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
 * @describe 热力图回放 Sagas
 */
'use strict';
import {take, call, put, select, cancel, takeLatest} from 'redux-saga/effects';
import {LOCATION_CHANGE} from 'react-router-redux';
import {getTraceData} from './actions';
import {TRACE_REPLAY, GET_TRACE_DATA} from './constants';
import {makeTraceReplay} from './selectors';


/**
 * 设置监听
 */
export function* watchFetchData() {
    yield take(LOCATION_CHANGE);
}

export default [
    watchFetchData
];

