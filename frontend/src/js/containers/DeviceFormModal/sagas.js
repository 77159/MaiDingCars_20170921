/**
 * @authors  hxb (huangxuebing@fengmap.com)
 * @date     2017/9/7
 * @describe 设备信息对话框（Modal）组件 sagas
 */

'use strict';
import {take, call, put, select, cancel, takeLatest, takeEvery} from 'redux-saga/effects';

import {
    deviceFormModalHide,
    deviceFormModalOpBegin,
    deviceFormModalOpFinish,
} from './actions';

import {
    showErrorMessage,
    showSuccessMessage
} from "../App/actions";

import {createDeviceAPI, modifyDeviceAPI} from '../../api/serverApi';
import requestError from "../../utils/requestError";
import {queryAllDeviceBegin} from "../DeviceMgrPage/actions";

/**
 * 添加设备
 */
export function* createDeviceSaga(action) {
    try {
        //操作开始，更新loading的state
        yield put(deviceFormModalOpBegin());
        //发起异步网络请求，并获取返回结果
        const response = yield call(createDeviceAPI,action.payload);
        //是否发生了错误，或者请求失败
        if (!response || response.success == false) {
            yield put(showErrorMessage(response.error_message));
        } else {
            yield put(showSuccessMessage(requestError.CREATE_DEVICE_SUCCESS));
            //关闭窗口
            yield put(deviceFormModalHide());
            //设备管理页面的数据重新加载
            yield put(queryAllDeviceBegin());
        }
    } catch (error) {
        //异常提示
        console.log(error);
        yield put(showErrorMessage(requestError.CREATE_DEVICE_ERROR));
    }
    //结束请求操作，更新loading的state
    yield put(deviceFormModalOpFinish());

}


/*
 * 修改设备信息
 * */
export function* modifyDeviceSaga(action) {
    try {
        //操作开始，更新loading的state
        yield put(deviceFormModalOpBegin());
        //发起异步网络请求，并获取返回结果
        const response = yield call(modifyDeviceAPI, action.payload);
        //是否发生了错误，或者请求失败
        if (!response || response.success == false) {
            //TODO 此处以后要对应接口的错误码，目前只能显示一种错误类型
            yield put(showErrorMessage(response.error_message));
        } else {
            yield put(showSuccessMessage(requestError.MODIFY_DEVICE_SUCCESS));
            //关闭窗口
            yield put(deviceFormModalHide());
            //人员管理页面的数据重新加载
            yield put(queryAllDeviceBegin());
        }
    } catch (error) {
        //异常提示
        console.log(error);
        yield put(showErrorMessage(requestError.REQUEST_ERROR));
    }
    //结束请求操作，更新loading的state
    yield put(deviceFormModalOpFinish());
}
