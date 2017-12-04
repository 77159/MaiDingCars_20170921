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
 * @describe 轨迹回放 Sagas
 */
'use strict';
import {take, call, put, select, cancel, takeLatest} from 'redux-saga/effects';
import {LOCATION_CHANGE} from 'react-router-redux';
import {getTraceData} from './actions';
import {TRACE_REPLAY} from './constants';
import {traceReplayAPI} from '../../api/serverApi';
import {showErrorMessage} from '../App/actions';

export function* changeTraceReplaySaga(action) {
    try {
        //发起异步网络请求，并获取返回结果
        const response = yield call(traceReplayAPI, action.payload);
        //是否发生了错误，或者请求失败
        if (!response || response.success == false) {
            yield put(showErrorMessage('请求失败'));    //提示错误信息
        } else {
            //yield put(showSuccessMessage('请求成功'));              //提示成功信息
            yield put(getTraceData(response));
        }
    } catch (error) {
        //异常提示
        yield put(showErrorMessage('出现错误'));
    }
}

/**
 * 设置监听
 */
export function* watchFetchData() {
    const watcher = yield takeLatest(TRACE_REPLAY, changeTraceReplaySaga);
    yield take(LOCATION_CHANGE);
    yield cancel(watcher);
}

export default [
    watchFetchData
];

