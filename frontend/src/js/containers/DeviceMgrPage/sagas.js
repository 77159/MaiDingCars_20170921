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
    DEVICE_OP_FINISH,
    QUERY_ALL_DEVICE,
    QUERY_ALL_DEVICE_BEGIN,
    QUERY_ALL_NOT_DEVICE_BEGIN,
    DELETE_DEVICE
} from './constants';

import {
    deviceOpBegin, deviceOpFinish,
    queryAllDevice, queryAllDeviceFinish,
    queryAllDeviceBegin,
    queryAllNotDeviceFinish
} from './actions';

import {
    showErrorMessage,
    showSuccessMessage
} from "../App/actions";

import {queryAllDeviceAPI, queryAllNotDeviceAPI, deleteDevicesAPI} from '../../api/serverApi';
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
 * 获取所有未被使用的设备数据
 */
export function* queryAllNotDeviceSaga() {
    try {
        //操作开始，更新loading的state
        yield put(deviceOpBegin());
        //发起异步网络请求，并获取返回结果
        const response = yield call(queryAllNotDeviceAPI);
        //是否发生了错误，或者请求失败
        if (!response || response.success == false) {
            //TODO 此处以后要对应接口的错误码，目前只能显示一种错误类型
            yield put(showErrorMessage(requestError.QUERY_ALL_DEVICE_ERROR));   //提示错误信息
        } else {
            //调用成功时，返回结果数据，让redux来更新state
            yield put(queryAllNotDeviceFinish(response));
        }
    } catch (error) {
        //异常提示
        console.log(error);
        yield put(showErrorMessage(requestError.QUERY_ALL_DEVICE_ERROR));
    }
}

/**
 * 删除一个或多个设备
 */
export function* deleteDeviceSaga(action) {
    try {
        const response = yield call(deleteDevicesAPI, {deviceCode: action.deviceCode});
        console.log(response);
        //判断是否发生错误并处理
        if (!response || response.success == false) {
            yield put(showErrorMessage(response.error_message));   //提示错误信息
        } else {
            yield put(showSuccessMessage(requestError.DELETE_DEVICE_SUCCESS));
        }
    } catch (err) {
        console.log(err);
        yield put(showErrorMessage(requestError.DELETE_DEVICE_ERROR));
    }
    //结束请求操作，更新loading的state
    yield put(deviceOpFinish());
    //设备管理页面的数据重新加载
    yield put(queryAllDeviceBegin());

}


export function* watchFetchData() {
    //设置监听
    const watcher = yield takeLatest(QUERY_ALL_DEVICE_BEGIN, queryAllDeviceSaga);
    const queryAllNotDeviceWatcher = yield takeLatest(QUERY_ALL_NOT_DEVICE_BEGIN, queryAllNotDeviceSaga);
    //监听删除设备
    const deleteDeviceWatcher = yield takeLatest(DELETE_DEVICE, deleteDeviceSaga);

    //设置监听
    const watcher2 = yield takeLatest(CREATE_DEVICE, createDeviceSaga);
    //监听修改设备
    const modifyDeviceWatcher = yield takeLatest(MODIFY_DEVICE, modifyDeviceSaga);
    //当发生页面切换动作时，中断未完成的saga动作
    yield take([LOCATION_CHANGE]);
    yield cancel(watcher);
    yield cancel(watcher2);
    yield cancel(queryAllNotDeviceWatcher);
    yield cancel(deleteDeviceWatcher);
    yield cancel(modifyDeviceWatcher);

}

export default [
    watchFetchData
];