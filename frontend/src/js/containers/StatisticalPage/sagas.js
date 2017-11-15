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
 * @describe 设备管理 Sagas
 */


'use strict';
import {take, call, put, select, cancel, takeLatest, takeEvery} from 'redux-saga/effects';

import {
    CREATE_DEVICE,
    MODIFY_DEVICE,
    QUERY_ALL_DEVICE_BEGIN,
    CAR_MSG_BEGIN,
    CAR_MSG_LIST_BEGIN
} from './constants';

import {
    deviceOpBegin,
    deviceOpFinish,
    queryAllDeviceFinish,
    queryAllCarMsgFinish,
    queryAllCarMsgListFinish,
} from './actions';

import {
    showErrorMessage,
} from "../App/actions";

import {queryAllDeviceAPI, queryAllCarMsgAPI, queryAllCarMsgListAPI} from '../../api/serverApi';
import {LOCATION_CHANGE} from 'react-router-redux';
import requestError from "../../utils/requestError";
import {createDeviceSaga, modifyDeviceSaga} from "../DeviceFormModal/sagas";

/**
 * 获取所有设备数据
 */
export function* queryAllDeviceSaga() {
    try {
        //操作开始，更新loading的state
        yield put(deviceOpBegin());
        //发起异步网络请求，并获取返回结果
        const response = yield call(queryAllDeviceAPI);
        //是否发生了错误，或者请求失败
        if (!response || response.success == false) {
            //TODO 此处以后要对应接口的错误码，目前只能显示一种错误类型
            yield put(showErrorMessage(requestError.QUERY_ALL_DEVICE_ERROR));   //提示错误信息
        } else {
            //调用成功时，返回结果数据，让redux来更新state
            yield put(queryAllDeviceFinish(response));
        }
    } catch (error) {
        //异常提示
        console.log(error);
        yield put(showErrorMessage(requestError.QUERY_ALL_DEVICE_ERROR));
    }
    //结束请求操作，更新loading的state
    yield put(deviceOpFinish());
}

/**
 * 获取车辆信息数据
 */
export function* queryAllCarMsgSaga() {
    try {
        //操作开始，更新loading的state
        yield put(deviceOpBegin());
        //发起异步网络请求，并获取返回结果
        const response = yield call(queryAllCarMsgAPI);
        //是否发生了错误，或者请求失败
        if (!response || response.success == false) {
            //TODO 此处以后要对应接口的错误码，目前只能显示一种错误类型
            yield put(showErrorMessage(requestError.QUERY_ALL_DEVICE_ERROR));   //提示错误信息
        } else {
            //调用成功时，返回结果数据，让redux来更新state
            yield put(queryAllCarMsgFinish(response));
        }
    } catch (error) {
        //异常提示
        console.log(error);
        yield put(showErrorMessage(requestError.QUERY_ALL_DEVICE_ERROR));
    }
}



/**
 * 获取车辆信息列表数据
 */
export function* queryAllCarMsgListSaga() {
    try {
        //操作开始，更新loading的state
        yield put(deviceOpBegin());
        //发起异步网络请求，并获取返回结果
        const response = yield call(queryAllCarMsgListAPI);
        //是否发生了错误，或者请求失败
        if (!response || response.success == false) {
            //TODO 此处以后要对应接口的错误码，目前只能显示一种错误类型
            yield put(showErrorMessage(requestError.QUERY_ALL_DEVICE_ERROR));   //提示错误信息
        } else {
            //调用成功时，返回结果数据，让redux来更新state
            yield put(queryAllCarMsgListFinish(response));
        }
    } catch (error) {
        //异常提示
        console.log(error);
        yield put(showErrorMessage(requestError.QUERY_ALL_DEVICE_ERROR));
    }
}



export function* watchFetchData() {
    //设置监听
    const watcher = yield takeLatest(QUERY_ALL_DEVICE_BEGIN, queryAllDeviceSaga);
    //设置监听
    const watcher2 = yield takeLatest(CREATE_DEVICE, createDeviceSaga);
    //监听修改设备
    const modifyDeviceWatcher = yield takeLatest(MODIFY_DEVICE, modifyDeviceSaga);
    //监听查询车辆信息
    const queryAllCarMsgWatcher = yield takeLatest(CAR_MSG_BEGIN, queryAllCarMsgSaga);
    //监听查询车辆信息列表
    const queryAllCarMsgListWatcher = yield takeLatest(CAR_MSG_LIST_BEGIN, queryAllCarMsgListSaga);
    //当发生页面切换动作时，中断未完成的saga动作
    yield take([LOCATION_CHANGE]);
    yield cancel(watcher);
    yield cancel(watcher2);
    yield cancel(modifyDeviceWatcher);
    yield cancel(queryAllCarMsgWatcher);
    yield cancel(queryAllCarMsgListWatcher);

}

export default [
    watchFetchData
];