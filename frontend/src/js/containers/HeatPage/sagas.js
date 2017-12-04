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
import {getHeatmapData} from './actions';
import {REQUEST_HEATMAP} from './constants';
import {showErrorMessage} from '../App/actions';
import {requestHeatMapDatas} from '../../api/serverApi';

export function* getHeatMapDatas(action) {
    try {
        //console.log('action.param', action.param);
        //发起异步网络请求，并获取返回结果
        const response = yield call(requestHeatMapDatas, action.param);
        //是否发生了错误，或者请求失败
        if (!response || response.success == false) {
            yield put(showErrorMessage('请求失败'));    //提示错误信息
        } else {
            if (response.success) {
                //更新state数据

                yield  put(getHeatmapData(response.result));
            }
            //yield put(getHeatmapData(response));
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
    const watcher = yield takeLatest(REQUEST_HEATMAP, getHeatMapDatas);
    yield take(LOCATION_CHANGE);
    yield cancel(watcher);
}

export default [
    watchFetchData
];

