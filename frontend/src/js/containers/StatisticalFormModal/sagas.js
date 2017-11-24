/**
 * @authors  hxb (huangxuebing@fengmap.com)
 * @date     2017/09/25
 * @describe 统计信息对话框（Modal） sagas
 */

'use strict';
import {
    take,
    call,
    put,
    select,
    cancel,
    takeLatest,
    takeEvery
} from 'redux-saga/effects';

import {
    GET_CENTER_AREA_DATA
} from './constants';

import {
    getCenterAreaStaticDataDone
} from './actions';

import {
    showErrorMessage,
    showSuccessMessage
} from "../App/actions";

import {
    getCenterAreaStaticData as queryCenterAreaStaticData
} from '../../api/serverApi';
import requestError from "../../utils/requestError";

import {
    LOCATION_CHANGE
} from 'react-router-redux';

export function* getCenterAreaStaticDataSaga(action) {
    try {
        const response = yield call(queryCenterAreaStaticData, action.payload.deviceID);
        //TODO 获取成功提示
        console.log("queryCenterAreaStaticData is successful!");
        //错误提示
        if (!response || response.success == false) {
            yield put(showErrorMessage(response.error_message));
        } else if (response.success == true) {
            yield put(getCenterAreaStaticDataDone(response, action.payload.count));
        }
    } catch (error) {
        //TODO 提示错误信息
        console.log("queryCenterAreaStaticData error:" + (error.message ? error.message : error));
        yield put(showErrorMessage(requestError.GET_DATA_ERROR));
    }
    //TODO 隐藏加载进度条
    console.log("queryCenterAreaStaticData finish.");
}

/**
 * 监听
 */
export function* watchFetchData() {
    //监听查询车辆信息
    const queryCenterAreaWatcher = yield takeLatest(GET_CENTER_AREA_DATA, getCenterAreaStaticDataSaga);
    //当发生页面切换动作时，中断未完成的saga动作
    yield take([LOCATION_CHANGE]);
    yield cancel(queryCenterAreaWatcher);
}

export default [
    watchFetchData,
];